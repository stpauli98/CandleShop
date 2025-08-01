"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import  Button  from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useShoppingCart } from '../../hooks/useShoppingCart'
import { formatCurrency } from '../../utilities/formatCurency'
import { createOrder } from '../../lib/firebase/orders'
import { sendOrderConfirmationEmail } from '../../lib/email/orderConfirmation'
import { error } from '../../lib/logger'

const paymentFormSchema = z.object({
  paymentMethod: z.enum(["pouzecem"]),
  firstName: z.string().min(1, "Ime je obavezno"),
  lastName: z.string().min(1, "Prezime je obavezno"),
  email: z.string().email("Unesite ispravnu email adresu"),
  phone: z.string().min(9, "Broj telefona mora imati najmanje 9 brojeva"),
  street: z.string().min(1, "Ulica je obavezna"),
  houseNumber: z.string().min(1, "Broj kuće/stana je obavezan"),
  city: z.string().min(1, "Grad je obavezan"),
  postalCode: z.string().min(5, "Poštanski broj mora imati 5 brojeva"),
  additionalInfo: z.string().optional()
});

type PaymentFormSchema = z.infer<typeof paymentFormSchema>;

export default function PaymentInput() {
  const [isLoading, setIsLoading] = useState(false)
  const { cart, clearCart, calculateTotal } = useShoppingCart()
  const navigate = useNavigate()

  const form = useForm<PaymentFormSchema>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "pouzecem",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      houseNumber: "",
      city: "",
      postalCode: "",
      additionalInfo: ""
    }
  });

  const onSubmit = async (data: PaymentFormSchema) => {
    setIsLoading(true)
    try {
      const total = calculateTotal();
      const shippingCost = total >= 50 ? 0 : 5;
      
      // Kreiranje objekta narudžbe
      const orderData = {
        orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        items: cart.map(item => ({
          id: item.id,
          naziv: item.naziv || '',
          cijena: item.cijena || '',
          kolicina: item.quantity || 1,
          selectedMiris: item.selectedMiris || '',
          selectedBoja: item.selectedBoja || ''
        })),
        total,
        shippingCost,
        paymentMethod: data.paymentMethod,
        shippingInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          street: data.street,
          houseNumber: data.houseNumber,
          city: data.city,
          postalCode: data.postalCode,
          phone: data.phone,
          additionalInfo: data.additionalInfo
        },
        customerEmail: data.email
      };

      // Spremanje narudžbe u Firebase
      const orderId = await createOrder(orderData);
      
      // Slanje email potvrde
      await sendOrderConfirmationEmail({
        ...orderData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        id: orderId
      });

      clearCart();
      navigate("/order-confirmation", { 
        state: { order: orderData } 
      })
    } catch (orderError: any) {
      error("Error processing order", orderError, 'ORDER');
      
      // Ako je Firebase greška, prikaži specifičnu poruku
      if (orderError.name === 'FirebaseError') {
        if (orderError.message.includes('permission')) {
          toast.error(
            <div className="space-y-2">
              <p className="font-medium">Pristup Firebase bazi je blokiran</p>
              <p className="text-sm">Molimo vas da:</p>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Isključite ad blocker za ovu stranicu</li>
                <li>Dodajte izuzetke za *.firebaseapp.com i *.googleapis.com</li>
                <li>Osvježite stranicu i pokušajte ponovno</li>
              </ol>
            </div>,
            {
              duration: 10000,
              icon: '⚠️',
              style: {
                background: '#FEF2F2',
                color: '#991B1B',
                border: '1px solid #FCA5A5',
                maxWidth: '400px'
              }
            }
          );
        } else {
          toast.error(orderError.message, {
            duration: 5000,
            icon: '⚠️',
            style: {
              background: '#FEF2F2',
              color: '#991B1B',
              border: '1px solid #FCA5A5'
            }
          });
        }
      } else {
        toast.error("Došlo je do greške prilikom procesiranja narudžbe.", {
          duration: 3000
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-lg font-semibold">Način plaćanja</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-lg">
                      <RadioGroupItem value="pouzecem" id="pouzecem" />
                      <Label htmlFor="pouzecem">Plaćanje pouzećem</Label>
                    </div>

                    <div className="flex items-center space-x-2 bg-gray-100 p-4 rounded-lg opacity-50 cursor-not-allowed">
                      <RadioGroupItem disabled value="paypal" id="paypal" />
                      <div>
                        <Label htmlFor="paypal" className="flex items-center">
                          PayPal <span className="ml-2 text-sm text-amber-600">(Uskoro)</span>
                        </Label>
                        <p className="text-sm text-gray-500">Online plaćanje PayPal-om će biti dostupno uskoro</p>
                      </div>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ime</FormLabel>
                  <FormControl>
                    <Input placeholder="Vaše ime" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prezime</FormLabel>
                  <FormControl>
                    <Input placeholder="Vaše prezime" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="vasa@email.com" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ulica</FormLabel>
                  <FormControl>
                    <Input placeholder="Naziv ulice" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="houseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broj</FormLabel>
                  <FormControl>
                    <Input placeholder="Broj kuće/stana" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grad</FormLabel>
                  <FormControl>
                    <Input placeholder="Naziv grada" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poštanski broj</FormLabel>
                  <FormControl>
                    <Input placeholder="npr. 71000" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Broj telefona</FormLabel>
                <FormControl>
                  <Input placeholder="Vaš kontakt telefon" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dodatne napomene (opcionalno)</FormLabel>
                <FormControl>
                  <Input placeholder="Npr. sprat, interfon, vrijeme dostave..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Order Summary */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">Pregled narudžbe</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Ukupno proizvodi:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Troškovi dostave:</span>
                {calculateTotal() >= 50 ? (
                  <span className="text-green-600 font-medium">Besplatno</span>
                ) : (
                  <span>5.00 KM</span>
                )}
              </div>
              
              {calculateTotal() >= 50 && (
                <div className="bg-green-50 p-2 rounded text-sm text-green-700">
                  Besplatna dostava za narudžbe preko 50 KM!
                </div>
              )}
              
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Ukupno za plaćanje:</span>
                  <span className="text-amber-600">
                    {formatCurrency(calculateTotal() >= 50 ? calculateTotal() : calculateTotal() + 5)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Plaćanje pouzećem - gotovinom prilikom preuzimanja</p>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-amber-600 hover:bg-amber-700 text-white" 
            disabled={isLoading}
          >
            {isLoading ? "Procesiranje..." : "Potvrdi narudžbu"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

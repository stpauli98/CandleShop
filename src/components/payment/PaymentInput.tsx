"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import  Button  from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useShoppingCart } from '../../hooks/useShoppingCart'
import { formatCurrency } from '../../utilities/formatCurrency'
import { calculateShippingCost, isFreeShipping } from '../../utilities/shipping'
import { createOrder } from '../../lib/firebase/orders'
import { sendOrderEmails } from '../../lib/email/emailService'
import { error, warn } from '../../lib/logger'

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

// Firebase error type definition
interface FirebaseError extends Error {
  code?: string;
  [key: string]: unknown;
}

export default function PaymentInput() {
  const [isLoading, setIsLoading] = useState(false)
  const { cart, clearCart, calculateTotal } = useShoppingCart()
  const navigate = useNavigate()
  const hasNavigated = useRef(false)

  // Redirect if cart is empty on initial load (but not after successful order)
  useEffect(() => {
    if (cart.length === 0 && !hasNavigated.current) {
      toast.error("Vaša korpa je prazna");
      navigate("/");
    }
  }, [cart.length, navigate]);

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
    hasNavigated.current = true // Prevent useEffect redirect
    try {
      const total = calculateTotal();
      const shippingCost = calculateShippingCost(total);

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

      // Slanje email potvrde (customer + admin)
      const emailResults = await sendOrderEmails({
        ...orderData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        id: orderId
      });

      // Log email results (but don't block navigation if emails fail)
      if (!emailResults.customer || !emailResults.admin) {
        warn('Some emails failed to send', emailResults as Record<string, unknown>, 'EMAIL');
      }

      clearCart();
      // Navigate will happen after clearCart, but hasNavigated flag prevents redirect
      navigate(`/order-confirmation/${orderId}`)
    } catch (orderError) {
      const firebaseError = orderError as FirebaseError;
      error("Error processing order", firebaseError, 'ORDER');

      // Ako je Firebase greška, prikaži specifičnu poruku
      if (firebaseError.name === 'FirebaseError') {
        if (firebaseError.message.includes('permission')) {
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
          toast.error(firebaseError.message, {
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
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* Back to shopping link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Nazad na kupovinu
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Informacije za dostavu</h1>

      {/* Product list */}
      <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">
          Vaša narudžba ({cart.length} {cart.length === 1 ? 'artikal' : cart.length < 5 ? 'artikla' : 'artikala'})
        </h3>
        <div className="space-y-2">
          {cart.map((item, index) => (
            <div key={`${item.id}-${item.selectedMiris}-${item.selectedBoja}-${index}`} className="flex justify-between items-start text-sm py-2 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <span className="text-gray-800">{item.naziv}</span>
                {(item.selectedMiris || item.selectedBoja) && (
                  <span className="text-gray-500 text-xs ml-1">
                    ({item.selectedMiris || item.selectedBoja})
                  </span>
                )}
                <span className="text-gray-500 ml-1">x{item.quantity}</span>
              </div>
              <span className="text-gray-700 font-medium">
                {formatCurrency(Number(item.cijena) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3 sm:space-y-4">
                <FormLabel className="text-base sm:text-lg font-semibold">Način plaćanja</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-3 sm:space-y-4"
                  >
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <RadioGroupItem value="pouzecem" id="pouzecem" />
                      <Label htmlFor="pouzecem" className="text-sm sm:text-base cursor-pointer">Plaćanje pouzećem</Label>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-100 p-3 sm:p-4 rounded-lg opacity-50 cursor-not-allowed">
                      <RadioGroupItem disabled value="karticno" id="karticno" />
                      <div className="flex-1">
                        <Label htmlFor="karticno" className="flex items-center text-sm sm:text-base">
                          Kartično plaćanje <span className="ml-2 text-xs sm:text-sm text-amber-600">(Uskoro)</span>
                        </Label>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Online plaćanje karticom će biti dostupno uskoro</p>
                      </div>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Ime</FormLabel>
                  <FormControl>
                    <Input placeholder="Vaše ime" className="h-11 text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Prezime</FormLabel>
                  <FormControl>
                    <Input placeholder="Vaše prezime" className="h-11 text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Email</FormLabel>
                <FormControl>
                  <Input placeholder="vasa@email.com" className="h-11 text-base" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Ulica</FormLabel>
                  <FormControl>
                    <Input placeholder="Naziv ulice" className="h-11 text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="houseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Broj</FormLabel>
                  <FormControl>
                    <Input placeholder="Broj kuće/stana" className="h-11 text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Grad</FormLabel>
                  <FormControl>
                    <Input placeholder="Naziv grada" className="h-11 text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Poštanski broj</FormLabel>
                  <FormControl>
                    <Input placeholder="npr. 71000" className="h-11 text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Broj telefona</FormLabel>
                <FormControl>
                  <Input placeholder="Vaš kontakt telefon" className="h-11 text-base" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Dodatne napomene (opcionalno)</FormLabel>
                <FormControl>
                  <Input placeholder="Npr. sprat, interfon, vrijeme dostave..." className="h-11 text-base" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Order Summary */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-50 rounded-lg space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Pregled narudžbe</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm sm:text-base">
                <span>Ukupno proizvodi:</span>
                <span className="font-medium">{formatCurrency(calculateTotal())}</span>
              </div>

              <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                <span>Troškovi dostave:</span>
                {isFreeShipping(calculateTotal()) ? (
                  <span className="text-green-600 font-medium">Besplatno</span>
                ) : (
                  <span className="font-medium">{formatCurrency(calculateShippingCost(calculateTotal()))}</span>
                )}
              </div>

              {isFreeShipping(calculateTotal()) && (
                <div className="bg-green-50 p-2 sm:p-3 rounded text-xs sm:text-sm text-green-700">
                  Besplatna dostava za narudžbe preko 50 KM!
                </div>
              )}

              <div className="pt-2 sm:pt-3 border-t border-gray-200">
                <div className="flex justify-between font-semibold text-base sm:text-lg">
                  <span>Ukupno za plaćanje:</span>
                  <span className="text-amber-600">
                    {formatCurrency(calculateTotal() + calculateShippingCost(calculateTotal()))}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Plaćanje pouzećem - gotovinom prilikom preuzimanja</p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 sm:py-3.5 text-base sm:text-lg font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Procesiranje..." : "Potvrdi narudžbu"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

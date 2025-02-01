"use client"

import { useState } from "react"
import { CreditCard, Calendar, Lock, Truck, ShoppingCartIcon as PaypalIcon, Apple } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import Button from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"

import { useShoppingCart } from '../../hooks/useShoppingCart'

import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'

const formSchema = z.object({
  paymentMethod: z.enum(["card", "cashOnDelivery", "paypal", "applePay"]),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "Broj kartice mora sadržavati 16 brojeva")
    .optional(),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Datum isteka mora biti u formatu MM/YY")
    .optional(),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, "CVV mora sadržavati 3 ili 4 broja")
    .optional(),
  shippingAddress: z.string().optional(),
  email: z.string().email("Unesite ispravnu email adresu").optional()
})

export default function PaymentInput() {
  const [isLoading, setIsLoading] = useState(false)
  const { cart, clearCart, calculateTotal } = useShoppingCart()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "card",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      shippingAddress: "",
      email: ""
    },
  })

  const watchPaymentMethod = form.watch("paymentMethod")

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("onSubmit called with data:", data);
    console.log("Cart items:", cart);
    console.log("Total:", calculateTotal());
    try {
      setIsLoading(true)
      
      // Simuliramo proces plaćanja
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generisanje jedinstvenog broja narudžbe
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      
      // Kreiranje objekta narudžbe sa svim potrebnim podacima
      const order = {
        orderNumber,
        items: cart, // Ovdje prenosimo sve items iz korpe
        total: calculateTotal(),
        paymentMethod: data.paymentMethod,
        shippingAddress: data.shippingAddress,
        orderDate: new Date().toISOString(),
        orderStatus: 'processing',
        customerEmail: data.email
      }
      
      // Čistimo korpu nakon uspješne narudžbe
      clearCart()
      
      // Prikazujemo poruku uspjeha
      toast.success('Vaša narudžba je uspješno primljena!')
      
      // Preusmjeravamo na stranicu za potvrdu sa svim podacima narudžbe
      navigate('/order-confirmation', { 
        state: { 
          order: {
            ...order,
            id: orderNumber
          } 
        } 
      })
      
    } catch (error) {
      toast.error('Došlo je do greške prilikom obrade narudžbe. Molimo pokušajte ponovo.')
      console.error("Greška:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Odaberite način plaćanja</CardTitle>
          <CardDescription>Izaberite željeni način plaćanja i unesite potrebne podatke</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Način plaćanja</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1 "
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center">
                            <CreditCard className="mr-2" />
                            Kreditna kartica
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cashOnDelivery" id="cashOnDelivery" />
                          <Label htmlFor="cashOnDelivery" className="flex items-center">
                            <Truck className="mr-2" />
                            Plaćanje pri preuzimanju
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal" className="flex items-center">
                            <PaypalIcon className="mr-2" />
                            PayPal
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="applePay" id="applePay" />
                          <Label htmlFor="applePay" className="flex items-center">
                            <Apple className="mr-2" />
                            Apple Pay
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchPaymentMethod === "card" && (
                <>
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Broj kartice</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input placeholder="1234 5678 9012 3456" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Datum isteka</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <Input placeholder="MM/YY" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <Input placeholder="123" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              <FormField
                control={form.control}
                name="shippingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresa dostave</FormLabel>
                    <FormControl>
                      <Input placeholder="Unesite adresu dostave" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email adresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Unesite email adresu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Obrađuje se..." : "Plati"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

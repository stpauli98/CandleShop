"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import  Button  from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useShoppingCart } from '../../hooks/useShoppingCart'

const paymentFormSchema = z.object({
  paymentMethod: z.enum(["card", "paypal"]),
  email: z.string().email("Unesite ispravnu email adresu"),
  shippingAddress: z.string().min(1, "Adresa za dostavu je obavezna")
});

type PaymentFormSchema = z.infer<typeof paymentFormSchema>;

export default function PaymentInput() {
  const [isLoading, setIsLoading] = useState(false)
  const { cart, clearCart, calculateTotal } = useShoppingCart()
  const navigate = useNavigate()

  const form = useForm<PaymentFormSchema>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "card",
      email: "",
      shippingAddress: ""
    }
  });

  const onSubmit = async (data: PaymentFormSchema) => {
    setIsLoading(true)
    try {
      // Simulacija procesiranja narudžbe
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Kreiranje objekta narudžbe
      const order = {
        orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        items: cart,
        total: calculateTotal(),
        paymentMethod: data.paymentMethod,
        shippingAddress: data.shippingAddress,
        orderDate: new Date().toISOString(),
        orderStatus: 'processing',
        customerEmail: data.email
      }

      console.log("Order processed:", order)
      clearCart()
      navigate("/order-confirmation", { 
        state: { order } 
      })
    } catch (error) {
      console.error("Error processing order:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
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
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Kartica</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="shippingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresa za dostavu</FormLabel>
                <FormControl>
                  <Input placeholder="Vaša adresa" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Procesiranje..." : "Završi narudžbu"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

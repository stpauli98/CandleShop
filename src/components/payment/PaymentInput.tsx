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
})

export default function PaymentForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "card",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  })

  const watchPaymentMethod = form.watch("paymentMethod")

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // Ovdje biste implementirali logiku za obradu plaćanja
    console.log(values)
    setTimeout(() => {
      setIsLoading(false)
      alert("Plaćanje uspješno!")
    }, 2000)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
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
                      className="flex flex-col space-y-1"
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
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? "Obrađuje se..." : "Plati"}
        </Button>
      </CardFooter>
    </Card>
  )
}

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { doc, setDoc, deleteDoc } from "firebase/firestore"
import { db } from "../lib/firebase"
import type { Product } from "./types"

import Button from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const categories = ["svijece", "mirisneSvijece", "mirisniVoskovi", "dekoracije", "omiljeniProizvodi"] as const

const productSchema = z.object({
  id: z.string().optional(),
  naziv: z.string().min(1, "Naziv je obavezan"),
  cijena: z.string().min(1, "Cijena je obavezna"),
  slika: z.string().url("Unesite valjani URL slike").optional(),
  opis: z.string().optional(),
  popust: z.coerce.number().min(0).max(100).default(0),
  dostupnost: z.boolean().default(true),
  kategorija: z.enum(categories),
})

type ProductFormProps = {
  product?: Product
  onSubmit: () => void
}

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: product?.id || "",
      naziv: product?.naziv || "",
      cijena: product?.cijena || "",
      slika: product?.slika || "",
      opis: product?.opis || "",
      popust: product?.popust || 0,
      dostupnost: product?.dostupnost ?? true,
      kategorija: (product?.kategorija && categories.includes(product.kategorija as any)) ? (product.kategorija as typeof categories[number]) : "dekoracije",
    },
  })

  // Reset form when product changes
  React.useEffect(() => {
    if (product) {
      form.reset({
        id: product.id,
        naziv: product.naziv,
        cijena: product.cijena,
        slika: product.slika || "",
        opis: product.opis || "",
        popust: product.popust || 0,
        dostupnost: product.dostupnost ?? true,
        kategorija: (product.kategorija && categories.includes(product.kategorija as any)) ? (product.kategorija as typeof categories[number]) : "dekoracije",
      })
    }
  }, [product, form])

  async function handleSubmit(values: z.infer<typeof productSchema>) {
    try {
      const productId = values.id || Date.now().toString()
      
      // Ako mijenjamo kategoriju proizvoda, moramo izbrisati stari i kreirati novi
      if (product && product.kategorija && product.kategorija !== values.kategorija) {
        // Izbriši iz stare kolekcije
        await deleteDoc(doc(db, product.kategorija.replace(/ /g, ''), product.id))
        // Kreiraj u novoj kolekciji
        const newCollection = values.kategorija.replace(/ /g, '')
        await setDoc(doc(db, newCollection, productId), {
          ...values,
          id: productId,
          popust: values.popust || 0,
          dostupnost: values.dostupnost ?? true,
          opis: values.opis || "",
          slika: values.slika || "",
        })
      } else {
        // Ako proizvod već postoji, koristi njegovu kategoriju, inače koristi novu
        const collection = product?.kategorija?.replace(/ /g, '') || values.kategorija.replace(/ /g, '')
        await setDoc(doc(db, collection, productId), {
          ...values,
          id: productId,
          popust: values.popust || 0,
          dostupnost: values.dostupnost ?? true,
          opis: values.opis || "",
          slika: values.slika || "",
        })
      }
      
      onSubmit()
      if (!product) { // Resetiraj formu samo ako je novi proizvod
        form.reset()
      }
    } catch (error) {
      console.error("Error saving product:", error)
      // Ovdje možete dodati toast ili neku drugu notifikaciju o grešci
    }
  }

  async function handleDelete() {
    if (product && product.id && product.kategorija) {
      const collection = product.kategorija.replace(/ /g, '') || 'dekoracije'
      await deleteDoc(doc(db, collection, product.id))
      onSubmit()
      form.reset()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="naziv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Naziv</FormLabel>
              <FormControl>
                <Input placeholder="Unesite naziv" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cijena"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cijena</FormLabel>
              <FormControl>
                <Input placeholder="Unesite cijenu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="kategorija"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategorija</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Odaberite kategoriju" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slika"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Slike</FormLabel>
              <FormControl>
                <Input placeholder="Unesite URL slike" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="opis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis</FormLabel>
              <FormControl>
                <Textarea placeholder="Unesite opis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="popust"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Popust (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Unesite popust" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dostupnost"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Dostupnost</FormLabel>
                <FormDescription>
                  Proizvod je dostupan za kupnju
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="submit">
            {product ? "Spremi promjene" : "Dodaj proizvod"}
          </Button>
          {product && (
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Obriši
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}

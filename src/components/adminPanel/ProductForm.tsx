import React, { useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { doc, setDoc, deleteDoc } from "firebase/firestore"
import { collections, type CollectionName } from "../../lib/controller"
import type { Product } from "./types"
import { uploadImage } from "../../lib/storage"
import { toast } from "react-hot-toast"

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

const categories = [
  { id: "svijece" as const, name: "Svijeće" },
  { id: "mirisneSvijece" as const, name: "Mirisne svijeće" },
  { id: "mirisniVoskovi" as const, name: "Mirisni voskovi" },
  { id: "dekoracije" as const, name: "Dekoracije" },
  { id: "omiljeniProizvodi" as const, name: "Omiljeni proizvodi" },
] as const

type CategoryId = CollectionName;

const isValidCategory = (category: string): category is CategoryId => {
  return categories.some(c => c.id === category);
}

const categorySchema = z.enum(["svijece", "mirisneSvijece", "mirisniVoskovi", "dekoracije", "omiljeniProizvodi"])

const productSchema = z.object({
  id: z.string().optional(),
  naziv: z.string()
    .min(1, "Naziv je obavezan")
    .max(100, "Naziv ne može biti duži od 100 znakova")
    .transform(val => val.trim()),
  cijena: z.string()
    .min(1, "Cijena je obavezna")
    .regex(/^\d+([.,]\d{1,2})?$/, "Cijena mora biti broj sa najviše 2 decimale")
    .transform(val => val.replace(',', '.')),
  slika: z.string()
    .transform(val => val.trim())
    .pipe(
      z.union([
        z.literal(''),
        z.string().url("Unesite valjani URL slike"),
      ])
    ),
  opis: z.string()
    .transform(val => val.trim()),
  popust: z.number()
    .min(0, "Popust ne može biti manji od 0")
    .max(100, "Popust ne može biti veći od 100"),
  dostupnost: z.boolean(),
  kategorija: categorySchema
})

type ProductFormProps = {
  product?: Product
  onSubmit: (success: boolean) => void
  mode: 'create' | 'edit'
  selectedCategory: CategoryId
}

export function ProductForm({ product, onSubmit, mode, selectedCategory }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultValues = useMemo(() => {
    if (mode === 'create') {
      return {
        id: '',
        naziv: '',
        cijena: '',
        slika: '',
        opis: '',
        popust: 0,
        dostupnost: true,
        kategorija: selectedCategory
      }
    } 
    
    if (product) {
      // Ensure we're using the product's actual category or fallback to selected
      const categoryId = isValidCategory(product.kategorija) ? 
        product.kategorija : 
        selectedCategory

      return {
        id: product.id,
        naziv: product.naziv || '',
        cijena: product.cijena || '',
        slika: product.slika || '',
        opis: product.opis || '',
        popust: product.popust || 0,
        dostupnost: product.dostupnost ?? true,
        kategorija: categoryId
      }
    }

    return {
      id: '',
      naziv: '',
      cijena: '',
      slika: '',
      opis: '',
      popust: 0,
      dostupnost: true,
      kategorija: selectedCategory
    }
  }, [mode, product, selectedCategory])

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  // Reset form when mode or selected category changes
  useEffect(() => {
    // When editing, use the product's category or fallback to selected
    const categoryId = mode === 'edit' && product?.kategorija && isValidCategory(product.kategorija) ? 
      product.kategorija : 
      selectedCategory

    const values = {
      id: mode === 'edit' && product ? product.id : '',
      naziv: mode === 'edit' && product ? product.naziv || '' : '',
      cijena: mode === 'edit' && product ? product.cijena || '' : '',
      slika: mode === 'edit' && product ? product.slika || '' : '',
      opis: mode === 'edit' && product ? product.opis || '' : '',
      popust: mode === 'edit' && product ? product.popust || 0 : 0,
      dostupnost: mode === 'edit' && product ? product.dostupnost ?? true : true,
      kategorija: categoryId
    }

    form.reset(values)
  }, [mode, selectedCategory, product, form])

  async function handleSubmit(values: z.infer<typeof productSchema>) {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const productId = values.id || Date.now().toString()
      
      // Ako mijenjamo kategoriju proizvoda, moramo izbrisati stari i kreirati novi
      const oldCollectionRef = product?.kategorija && collections[product.kategorija as CollectionName];
      const newCollectionRef = collections[values.kategorija as CollectionName];
      
      if (!newCollectionRef) {
        throw new Error("Neispravna kategorija");
      }

      // Ako mijenjamo kategoriju proizvoda, moramo izbrisati stari i kreirati novi
      if (product?.kategorija && product.kategorija !== values.kategorija && oldCollectionRef) {
        const oldDocRef = doc(oldCollectionRef(), product.id);
        await deleteDoc(oldDocRef);
      }
      
      // Pripremi podatke za spremanje
      const productData = {
        id: productId,
        naziv: values.naziv,  // već je trimano u schemi
        cijena: values.cijena,  // već je normalizirano u schemi
        slika: values.slika,  // već je trimano u schemi
        opis: values.opis,  // već je trimano u schemi
        popust: values.popust,  // već je normalizirano u schemi
        dostupnost: values.dostupnost,
        kategorija: values.kategorija
      }

      // Spremi u odabranu kolekciju
      const newDocRef = doc(newCollectionRef(), productId);
      await setDoc(newDocRef, productData)
      
      onSubmit(true)
      if (mode === 'create') { // Resetiraj formu samo ako je novi proizvod
        form.reset({
          id: '',
          naziv: '',
          cijena: '',
          slika: '',
          opis: '',
          popust: 0,
          dostupnost: true,
          kategorija: selectedCategory,
        })
      }
    } catch (error) {
      console.error("Error saving product:", error)
      setError("Došlo je do greške prilikom spremanja proizvoda. Molimo pokušajte ponovno.")
      onSubmit(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!product?.id || !product?.kategorija) return
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const collectionRef = collections[product.kategorija as CollectionName];
      if (!collectionRef) {
        throw new Error("Neispravna kategorija");
      }
      
      const docRef = doc(collectionRef(), product.id);
      await deleteDoc(docRef);
      onSubmit(true);
      form.reset({
        id: '',
        naziv: '',
        cijena: '',
        slika: '',
        opis: '',
        popust: 0,
        dostupnost: true,
        kategorija: selectedCategory,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Došlo je do greške prilikom brisanja proizvoda. Molimo pokušajte ponovno.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
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
              <Select 
                value={field.value}
                onValueChange={(value) => {
                  if (isValidCategory(value)) {
                    field.onChange(value)
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue>
                      {categories.find(c => c.id === field.value)?.name || 'Odaberite kategoriju'}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
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
              <FormLabel>Slika proizvoda</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          try {
                            // Provjeri veličinu fajla (max 5MB)
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error('Slika ne može biti veća od 5MB')
                              return
                            }
                            
                            toast.loading('Uploadanje slike...', { id: 'upload' })
                            const imageUrl = await uploadImage(file)
                            field.onChange(imageUrl)
                            toast.success('Slika je uspješno uploadana', { id: 'upload' })
                          } catch (error) {
                            console.error('Error uploading image:', error)
                            toast.error('Greška pri uploadu slike', { id: 'upload' })
                          }
                        }
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                  
                  {field.value && (
                    <div className="relative w-full max-w-[200px] aspect-square rounded-lg overflow-hidden border">
                      <img 
                        src={field.value} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => field.onChange('')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Maksimalna veličina slike je 5MB. Podržani formati: JPG, PNG, GIF
              </FormDescription>
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
          <Button 
            type="submit"
            disabled={isSubmitting}
            className={isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {isSubmitting ? 'Spremanje...' : (product ? 'Spremi promjene' : 'Dodaj proizvod')}
          </Button>
          {product && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isSubmitting}
              className={isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {isSubmitting ? 'Brisanje...' : 'Obriši'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}

import { useEffect, useRef, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { doc, setDoc, deleteDoc } from "firebase/firestore"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

import { collections } from "../../lib/controller"
import type { Product } from "./types"
import { error as logError } from "../../lib/logger"

import Button from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
import ConfirmDialog from "./shared/ConfirmDialog"
import { ImageDropzone } from "./ImageDropzone"
import { CATEGORIES_ARRAY, type CategoryId } from '@/lib/constants/admin'

const isValidCategory = (category: string): category is CategoryId => {
  return CATEGORIES_ARRAY.some(c => c.id === category)
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

type ProductFormValues = z.infer<typeof productSchema>

interface ProductSlideoutProps {
  isOpen: boolean
  onClose: () => void
  product?: Product
  mode: 'create' | 'edit'
  selectedCategory: CategoryId
  onSuccess: () => void
}

export function ProductSlideout({
  isOpen,
  onClose,
  product,
  mode,
  selectedCategory,
  onSuccess,
}: ProductSlideoutProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

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
      const categoryId = isValidCategory(product.kategorija)
        ? product.kategorija
        : selectedCategory

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

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  // Reset form when mode/product changes
  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues)
    }
  }, [isOpen, defaultValues, form])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !showDeleteConfirm) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, showDeleteConfirm])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  async function handleSubmit(values: ProductFormValues) {
    setIsSubmitting(true)

    try {
      const productId = values.id || Date.now().toString()

      const oldCollectionRef = product?.kategorija && isValidCategory(product.kategorija)
        ? collections[product.kategorija]
        : null
      const newCollectionRef = collections[values.kategorija]

      if (!newCollectionRef) {
        throw new Error("Neispravna kategorija")
      }

      // If changing category, delete from old collection
      if (product?.kategorija && product.kategorija !== values.kategorija && oldCollectionRef) {
        const oldDocRef = doc(oldCollectionRef(), product.id)
        await deleteDoc(oldDocRef)
      }

      const productData = {
        id: productId,
        naziv: values.naziv,
        cijena: values.cijena,
        slika: values.slika,
        opis: values.opis,
        popust: values.popust,
        dostupnost: values.dostupnost,
        kategorija: values.kategorija,
        updatedAt: new Date(),
        createdAt: product?.createdAt || new Date()
      }

      const newDocRef = doc(newCollectionRef(), productId)
      await setDoc(newDocRef, productData)

      toast.success(
        mode === 'create'
          ? 'Proizvod je uspješno dodan!'
          : 'Proizvod je uspješno ažuriran!'
      )
      onSuccess()
      onClose()
    } catch (err) {
      logError("Error saving product", err as Record<string, unknown>, 'PRODUCTS')
      toast.error("Došlo je do greške prilikom spremanja proizvoda.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteConfirm() {
    if (!product?.id || !product?.kategorija) return

    setIsSubmitting(true)
    const deleteToast = toast.loading('Brisanje proizvoda...')

    try {
      if (!isValidCategory(product.kategorija)) {
        throw new Error("Neispravna kategorija")
      }

      const collectionRef = collections[product.kategorija]
      const docRef = doc(collectionRef(), product.id)
      await deleteDoc(docRef)

      toast.success('Proizvod uspješno obrisan!', { id: deleteToast })
      setShowDeleteConfirm(false)
      onSuccess()
      onClose()
    } catch (err) {
      logError("Error deleting product", err as Record<string, unknown>, 'PRODUCTS')
      toast.error("Došlo je do greške prilikom brisanja proizvoda.", { id: deleteToast })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Slideout Panel */}
          <motion.div
            ref={panelRef}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Novi proizvod' : 'Uredi proizvod'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <Form {...form}>
                <form id="product-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  {/* Image Dropzone */}
                  <FormField
                    control={form.control}
                    name="slika"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slika proizvoda</FormLabel>
                        <FormControl>
                          <ImageDropzone
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="naziv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Naziv *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Unesite naziv proizvoda"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price and Discount */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cijena"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cijena (KM) *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0.00"
                              className="h-11"
                              {...field}
                            />
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
                              min={0}
                              max={100}
                              placeholder="0"
                              className="h-11"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="kategorija"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategorija *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            if (isValidCategory(value)) {
                              field.onChange(value)
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue>
                                {CATEGORIES_ARRAY.find(c => c.id === field.value)?.name || 'Odaberite kategoriju'}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES_ARRAY.map((category) => (
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

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="opis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opis</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Unesite opis proizvoda"
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Availability */}
                  <FormField
                    control={form.control}
                    name="dostupnost"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-xl border border-gray-200 p-4 bg-gray-50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">Dostupnost</FormLabel>
                          <p className="text-sm text-gray-500">
                            Proizvod je dostupan za kupnju
                          </p>
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
                </form>
              </Form>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                {mode === 'edit' && product && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSubmitting}
                  >
                    Obriši
                  </Button>
                )}
                <div className={`flex items-center gap-3 ${mode === 'create' ? 'ml-auto' : ''}`}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Otkaži
                  </Button>
                  <Button
                    type="submit"
                    form="product-form"
                    disabled={isSubmitting}
                    className="min-w-[100px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Spremanje...
                      </>
                    ) : (
                      mode === 'create' ? 'Dodaj' : 'Spremi'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delete Confirmation */}
          <ConfirmDialog
            isOpen={showDeleteConfirm}
            title="Potvrda brisanja"
            message={`Da li ste sigurni da želite obrisati proizvod "${product?.naziv}"? Ova akcija se ne može poništiti.`}
            confirmText="Obriši proizvod"
            cancelText="Otkaži"
            confirmVariant="destructive"
            onConfirm={handleDeleteConfirm}
            onCancel={() => setShowDeleteConfirm(false)}
            isLoading={isSubmitting}
          />
        </>
      )}
    </AnimatePresence>
  )
}

import { useState, useEffect, useMemo } from "react"
import { onSnapshot, doc, setDoc } from "firebase/firestore"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "./types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Package, Plus, X, Loader2 } from "lucide-react"
import { collections, type CollectionName } from '../../lib/controller'
import { warn, error } from '../../lib/logger'
import { CATEGORIES, type CategoryId, getCategoryName } from '@/lib/constants/admin'
import { ProductCard } from "./ProductCard"
import ConfirmDialog from "./shared/ConfirmDialog"
import { toast } from "react-hot-toast"

type ProductListProps = {
  onEdit: (product: Product) => void
  onAddNew: () => void
  selectedProduct?: Product
  selectedCategory: CategoryId
  onCategoryChange: (category: CategoryId) => void
}

export function ProductList({
  onEdit,
  onAddNew,
  selectedProduct,
  selectedCategory,
  onCategoryChange
}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!selectedCategory) {
      warn('No category selected', {}, 'PRODUCTS')
      return
    }

    setIsLoading(true)
    const getCollectionRef = collections[selectedCategory as CollectionName]
    if (!getCollectionRef) {
      error('Invalid category', { selectedCategory }, 'PRODUCTS')
      setIsLoading(false)
      return
    }

    const collectionRef = getCollectionRef()

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      try {
        const productsData = snapshot.docs
          .map(doc => {
            const data = doc.data()

            if (!data.naziv || !data.cijena) {
              warn('Proizvod nema naziv ili cijenu', { docId: doc.id }, 'PRODUCTS')
              return null
            }

            return {
              id: doc.id,
              naziv: String(data.naziv).trim(),
              cijena: String(data.cijena).trim(),
              slika: data.slika ? String(data.slika).trim() : '',
              opis: data.opis ? String(data.opis).trim() : '',
              popust: Number(data.popust) || 0,
              dostupnost: Boolean(data.dostupnost),
              kategorija: String(data.kategorija || selectedCategory),
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            } as Product
          })
          .filter((product): product is Product => product !== null)
          .sort((a, b) => a.naziv.localeCompare(b.naziv))

        setProducts(productsData)
      } catch (err) {
        error('Error processing products', err as Record<string, unknown>, 'PRODUCTS')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }, (err) => {
      error('Error fetching products', err as Record<string, unknown>, 'PRODUCTS')
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [selectedCategory])

  const displayProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products
    }

    const query = searchQuery.toLowerCase()
    return products.filter(product =>
      product.naziv.toLowerCase().includes(query) ||
      product.opis?.toLowerCase().includes(query) ||
      product.cijena.includes(query)
    )
  }, [products, searchQuery])

  const handleToggleAvailability = async (product: Product) => {
    try {
      const collectionRef = collections[selectedCategory as CollectionName]
      if (!collectionRef) return

      const docRef = doc(collectionRef(), product.id)
      await setDoc(docRef, {
        ...product,
        dostupnost: !product.dostupnost,
        updatedAt: new Date()
      })

      toast.success(
        product.dostupnost
          ? 'Proizvod označen kao nedostupan'
          : 'Proizvod označen kao dostupan'
      )
    } catch (err) {
      error('Error toggling availability', err as Record<string, unknown>, 'PRODUCTS')
      toast.error('Greška pri promjeni dostupnosti')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteProduct) return

    setIsDeleting(true)
    try {
      const collectionRef = collections[selectedCategory as CollectionName]
      if (!collectionRef) throw new Error('Invalid category')

      const { deleteDoc } = await import('firebase/firestore')
      const docRef = doc(collectionRef(), deleteProduct.id)
      await deleteDoc(docRef)

      toast.success('Proizvod uspješno obrisan')
      setDeleteProduct(null)
    } catch (err) {
      error('Error deleting product', err as Record<string, unknown>, 'PRODUCTS')
      toast.error('Greška pri brisanju proizvoda')
    } finally {
      setIsDeleting(false)
    }
  }

  const clearSearch = () => setSearchQuery('')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-100 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 rounded-lg">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Proizvodi</h3>
              <p className="text-sm text-gray-500">
                {isLoading ? (
                  'Učitavanje...'
                ) : (
                  <>
                    Ukupno: <span className="font-medium text-gray-700">{products.length}</span>
                    {searchQuery && (
                      <> | Pronađeno: <span className="font-medium text-purple-600">{displayProducts.length}</span></>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>

          <motion.button
            onClick={onAddNew}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            <span>Dodaj proizvod</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Kategorija
            </label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="h-11 bg-white">
                <SelectValue placeholder="Odaberite kategoriju" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(CATEGORIES).map((key) => (
                  <SelectItem key={key} value={key}>
                    {getCategoryName(key as CategoryId)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Pretraga
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Pretraži po nazivu, opisu, cijeni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-11 bg-white"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
          <p className="text-gray-500">Učitavanje proizvoda...</p>
        </div>
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
        >
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Nema proizvoda
          </h3>
          <p className="text-gray-500 text-center mb-4">
            U ovoj kategoriji trenutno nema proizvoda.
          </p>
          <motion.button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Dodaj prvi proizvod
          </motion.button>
        </motion.div>
      ) : displayProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-gray-200"
        >
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Nema rezultata
          </h3>
          <p className="text-gray-500 text-center mb-4">
            Nisu pronađeni proizvodi za "{searchQuery}"
          </p>
          <button
            onClick={clearSearch}
            className="text-purple-600 font-medium hover:text-purple-700"
          >
            Očisti pretragu
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence mode="popLayout">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
              >
                <ProductCard
                  product={product}
                  isSelected={selectedProduct?.id === product.id}
                  onEdit={onEdit}
                  onDelete={setDeleteProduct}
                  onToggleAvailability={handleToggleAvailability}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteProduct}
        title="Potvrda brisanja"
        message={`Da li ste sigurni da želite obrisati proizvod "${deleteProduct?.naziv}"? Ova akcija se ne može poništiti.`}
        confirmText="Obriši proizvod"
        cancelText="Otkaži"
        confirmVariant="destructive"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteProduct(null)}
        isLoading={isDeleting}
      />
    </div>
  )
}

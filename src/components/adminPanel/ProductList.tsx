import { useState, useEffect, useMemo } from "react"
import { onSnapshot } from "firebase/firestore"
import type { Product } from "./types"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Package } from "lucide-react"
import { collections, type CollectionName } from '../../lib/controller'
import { warn, error } from '../../lib/logger'
import { CATEGORIES, type CategoryId, getCategoryName } from '@/lib/constants/admin'

type ProductListProps = {
  onEdit: (product: Product) => void
  selectedProduct?: Product
  selectedCategory: CategoryId
  onCategoryChange: (category: CategoryId) => void
}

export function ProductList({ onEdit, selectedProduct, selectedCategory, onCategoryChange }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!selectedCategory) {
      warn('No category selected', {}, 'PRODUCTS');
      return;
    }

    const getCollectionRef = collections[selectedCategory as CollectionName];
    if (!getCollectionRef) {
      error('Invalid category', { selectedCategory }, 'PRODUCTS');
      return;
    }

    const collectionRef = getCollectionRef();
    
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      try {
        const productsData = snapshot.docs
          .map(doc => {
            const data = doc.data();
            
            // Provjeri da li proizvod ima sve potrebne podatke
            if (!data.naziv || !data.cijena) {
              warn('Proizvod nema naziv ili cijenu', { docId: doc.id }, 'PRODUCTS');
              return null;
            }

            // Konvertiraj podatke u ispravne tipove
            return {
              id: doc.id,
              naziv: String(data.naziv).trim(),
              cijena: String(data.cijena).trim(),
              slika: data.slika ? String(data.slika).trim() : '',
              opis: data.opis ? String(data.opis).trim() : '',
              popust: Number(data.popust) || 0,
              dostupnost: Boolean(data.dostupnost),
              kategorija: String(data.kategorija || selectedCategory)
            } as Product;
          })
          .filter((product): product is Product => product !== null)
          .sort((a, b) => a.naziv.localeCompare(b.naziv)); // Sortiraj po nazivu
        
        setProducts(productsData);
      } catch (err) {
        error('Error processing products', err as Record<string, unknown>, 'PRODUCTS');
        setProducts([]);
      }
    }, (err) => {
      error('Error fetching products', err as Record<string, unknown>, 'PRODUCTS');
    });

    return () => unsubscribe()
  }, [selectedCategory])

  // Filter products based on search query using useMemo
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

  return (
    <div className="space-y-4">
      {/* Header with stats and filters */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Proizvodi</h3>
          </div>
          <div className="text-sm text-gray-600">
            Ukupno: <span className="font-semibold text-gray-900">{products.length}</span>
            {searchQuery && (
              <span className="ml-2">
                | Pronađeno: <span className="font-semibold text-purple-600">{displayProducts.length}</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija</label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Pretraga</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Pretraži po nazivu, opisu, cijeni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Slika</TableHead>
                <TableHead>Naziv</TableHead>
                <TableHead className="w-24">Cijena</TableHead>
                <TableHead className="w-24">Popust</TableHead>
                <TableHead className="w-24">Dostupnost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Nema proizvoda u ovoj kategoriji</p>
                  </TableCell>
                </TableRow>
              ) : displayProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Nisu pronađeni proizvodi za "{searchQuery}"</p>
                  </TableCell>
                </TableRow>
              ) : (
                displayProducts.map((product) => (
                  <TableRow 
                    key={product.id}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      selectedProduct?.id === product.id ? 'bg-purple-50' : ''
                    }`}
                    onClick={() => onEdit(product)}
                  >
                    <TableCell>
                      {product.slika && (
                        <img
                          src={product.slika}
                          alt={product.naziv}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.naziv}</div>
                      {product.opis && (
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                          {product.opis}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{product.cijena} KM</div>
                    </TableCell>
                    <TableCell>
                      {product.popust > 0 ? (
                        <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
                          -{product.popust}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        product.dostupnost
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.dostupnost ? "Dostupno" : "Nije dostupno"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden space-y-2">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Nema proizvoda u ovoj kategoriji</p>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Nisu pronađeni proizvodi za "{searchQuery}"</p>
          </div>
        ) : (
          displayProducts.map((product) => (
            <div
              key={product.id}
              className={`border rounded-lg p-4 cursor-pointer ${
                selectedProduct?.id === product.id ? 'bg-purple-50' : 'bg-white'
              }`}
              onClick={() => onEdit(product)}
            >
              <div className="flex items-start gap-4">
                {product.slika && (
                  <img
                    src={product.slika}
                    alt={product.naziv}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="font-medium">{product.naziv}</h3>
                    <div className="text-gray-900 font-semibold whitespace-nowrap">
                      {product.cijena} KM
                    </div>
                  </div>
                  {product.opis && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{product.opis}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {product.popust > 0 && (
                      <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
                        -{product.popust}%
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.dostupnost
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.dostupnost ? "Dostupno" : "Nije dostupno"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

import React, { useState, useEffect } from "react"
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
import { omiljeniProizvodi, svijece, mirisneSvijece, mirisniVoskovi, dekoracije } from '../lib/controller'

const collections = {
  "Omiljeni proizvodi": omiljeniProizvodi,
  "Svijeće": svijece,
  "Mirisne svijeće": mirisneSvijece,
  "Mirisni voskovi": mirisniVoskovi,
  "Dekoracije": dekoracije
} as const

type ProductListProps = {
  onEdit: (product: Product) => void
  selectedProduct?: Product
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function ProductList({ onEdit, selectedProduct, selectedCategory, onCategoryChange }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const currentCollection = Object.entries(collections).find(([_, ref]) => 
      ref.path.split('/').pop() === selectedCategory
    )?.[1]

    if (!currentCollection) return

    const unsubscribe = onSnapshot(currentCollection, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product))
      setProducts(productsData)
    })

    return () => unsubscribe()
  }, [selectedCategory])

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Odaberite kategoriju" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(collections).map(([label, ref]) => (
              <SelectItem key={ref.path} value={ref.path.split('/').pop()!}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slika</TableHead>
              <TableHead>Naziv</TableHead>
              <TableHead>Cijena</TableHead>
              <TableHead>Popust</TableHead>
              <TableHead>Dostupnost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow 
                key={product.id}
                className={`cursor-pointer ${
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
                <TableCell>{product.naziv || 'Bez naziva'}</TableCell>
                <TableCell>{product.cijena || '0'} KM</TableCell>
                <TableCell>
                  {product.popust && product.popust > 0 ? (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      -{product.popust}%
                    </span>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.dostupnost 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.dostupnost ? 'Dostupno' : 'Nije dostupno'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

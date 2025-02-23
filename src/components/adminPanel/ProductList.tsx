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
import { collections, type CollectionName } from '../../lib/controller'

const displayNames = {
  "omiljeniProizvodi": "Omiljeni proizvodi",
  "svijece": "Svijeće",
  "mirisneSvijece": "Mirisne svijeće",
  "mirisniVoskovi": "Mirisni voskovi",
  "dekoracije": "Dekoracije"
} as const

type CategoryId = keyof typeof displayNames

type ProductListProps = {
  onEdit: (product: Product) => void
  selectedProduct?: Product
  selectedCategory: CategoryId
  onCategoryChange: (category: CategoryId) => void
}

export function ProductList({ onEdit, selectedProduct, selectedCategory, onCategoryChange }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!selectedCategory) {
      console.warn('No category selected');
      return;
    }

    const getCollectionRef = collections[selectedCategory as CollectionName];
    if (!getCollectionRef) {
      console.error('Invalid category:', selectedCategory);
      return;
    }

    const collectionRef = getCollectionRef();
    console.log('Subscribing to collection:', collectionRef.path);
    
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      try {
        const productsData = snapshot.docs
          .map(doc => {
            const data = doc.data();
            
            // Provjeri da li proizvod ima sve potrebne podatke
            if (!data.naziv || !data.cijena) {
              console.warn('Proizvod nema naziv ili cijenu:', doc.id);
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
      } catch (error) {
        console.error('Error processing products:', error);
        setProducts([]);
      }
    }, (error) => {
      console.error('Error fetching products:', error);
    });

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
            {Object.entries(collections).map(([key]) => (
              <SelectItem key={key} value={key}>
                {displayNames[key as keyof typeof displayNames]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                  <TableCell colSpan={5} className="text-center py-4">
                    Nema proizvoda u ovoj kategoriji
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
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
                    <TableCell className="font-medium">{product.naziv}</TableCell>
                    <TableCell>{product.cijena} KM</TableCell>
                    <TableCell>
                      {product.popust > 0 ? (
                        <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                          -{product.popust}%
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${
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
          <div className="text-center py-4 text-gray-500">
            Nema proizvoda u ovoj kategoriji
          </div>
        ) : (
          products.map((product) => (
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
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-medium truncate">{product.naziv}</h3>
                    <div className="text-gray-900 whitespace-nowrap">
                      {product.cijena} KM
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.popust > 0 && (
                      <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-sm">
                        -{product.popust}%
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-sm ${
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

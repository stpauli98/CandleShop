import React, { useState } from "react"
import { ProductForm } from "../adminPanel/ProductForm"
import { ProductList } from "../adminPanel/ProductList"
import type { Product } from "../adminPanel/types"
import { omiljeniProizvodi } from '../lib/controller'

const collections = {
  "Omiljeni proizvodi": omiljeniProizvodi,
  "Svijeće": "svijece",
  "Mirisne svijeće": "mirisneSvijece",
  "Mirisni voskovi": "mirisniVoskovi",
  "Dekoracije": "dekoracije"
} as const

export default function AdminPanel() {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [selectedCategory, setSelectedCategory] = useState<string>(omiljeniProizvodi.path.split('/').pop()!)

  const handleProductEdit = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleProductSubmit = () => {
    setSelectedProduct(undefined)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSelectedProduct(undefined)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <ProductList 
            onEdit={handleProductEdit} 
            selectedProduct={selectedProduct}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        <div>
          <ProductForm 
            product={selectedProduct} 
            onSubmit={handleProductSubmit}
          />
        </div>
      </div>
    </div>
  )
}

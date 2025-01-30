import React, { useState, useEffect } from "react"
import { ProductForm } from "../adminPanel/ProductForm"
import { ProductList } from "../adminPanel/ProductList"
import type { Product } from "../adminPanel/types"
import { omiljeniProizvodi } from '../lib/controller'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../lib/firebase"

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
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/admin-login")
      } else {
        setAuthenticated(true)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [navigate])

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

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate("/admin-login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Učitavanje...</div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Panel</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </div>
    </div>
  )
}

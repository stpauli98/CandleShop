import { useState, useEffect } from "react"
import { ProductForm } from "./ProductForm"
import { ProductList } from "./ProductList"
import type { Product } from "./types"
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../../lib/firebase"
import { toast } from "react-hot-toast"
import Button from "@/components/ui/button"
import ColorAndFragranceInput from "./ColorAndFragrancelnput"
import OrderTable from "./OrderTable"
import CustomerGroupsTable from "./CustomerGroupsTable"
import Dashboard from "./Dashboard"
import { error } from "../../lib/logger"

type CategoryId = 'omiljeniProizvodi' | 'svijece' | 'mirisneSvijece' | 'mirisniVoskovi' | 'dekoracije'

type ActiveTab = 'dashboard' | 'list' | 'form' | 'orders' | 'customers'

export default function AdminPanel() {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("svijece")
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
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
    setFormMode('edit')
  }

  const handleAddNewProduct = () => {
    setSelectedProduct(undefined)
    setFormMode('create')
    setActiveTab('form') // Prebaci na formu kada se klikne dugme
  }

  const handleProductSubmit = async (success: boolean) => {
    if (success) {
      setSelectedProduct(undefined)
      setFormMode('create')
      toast.success(
        formMode === 'create'
          ? 'Proizvod je uspješno dodan!'
          : 'Proizvod je uspješno ažuriran!'
      )
    }
  }

  const handleCategoryChange = (category: CategoryId) => {
    setSelectedCategory(category)
    setSelectedProduct(undefined)
    setFormMode('create')
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate("/admin-login")
    } catch (logoutError) {
      error("Logout error", logoutError as Record<string, unknown>, 'AUTH')
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
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Admin Panel</h1>
              <nav className="hidden md:flex space-x-4">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`${activeTab === 'dashboard' ? 'text-purple-600' : 'text-gray-500'} hover:text-purple-600`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('list')}
                  className={`${activeTab === 'list' ? 'text-purple-600' : 'text-gray-500'} hover:text-purple-600`}
                >
                  Proizvodi
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`${activeTab === 'orders' ? 'text-purple-600' : 'text-gray-500'} hover:text-purple-600`}
                >
                  Narudžbe
                </button>
                <button
                  onClick={() => setActiveTab('customers')}
                  className={`${activeTab === 'customers' ? 'text-purple-600' : 'text-gray-500'} hover:text-purple-600`}
                >
                  Kupci
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddNewProduct}
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Dodaj novi proizvod
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="sm"
              >
                Odjava
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          {/* Mobile Navigation */}
          <div className="md:hidden mb-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-3 text-center rounded-lg text-sm ${activeTab === 'dashboard' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`py-2 px-3 text-center rounded-lg text-sm ${activeTab === 'list' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
              >
                Proizvodi
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-3 text-center rounded-lg text-sm ${activeTab === 'orders' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
              >
                Narudžbe
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`py-2 px-3 text-center rounded-lg text-sm ${activeTab === 'customers' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
              >
                Kupci
              </button>
            </div>
            {activeTab === 'list' && (
              <Button
                onClick={handleAddNewProduct}
                variant="outline"
                className="w-full"
              >
                Dodaj novi proizvod
              </Button>
            )}
          </div>

          {/* Tabs for Mobile */}
          <div className="sm:hidden mb-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('list')}
                  className={`${
                    activeTab === 'list'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-1 text-center`}
                >
                  Lista proizvoda
                </button>
                <button
                  onClick={() => setActiveTab('form')}
                  className={`${
                    activeTab === 'form'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-1 text-center`}
                >
                  {formMode === 'create' ? 'Dodaj proizvod' : 'Uredi proizvod'}
                </button>
              </nav>
            </div>
          </div>

          {/* Responsive Grid */}
          {/* Main Grid Layout */}
          <div className="space-y-6">
            {activeTab === 'dashboard' ? (
              <Dashboard />
            ) : activeTab === 'orders' ? (
              <div>
                <h2 className="text-lg font-semibold mb-4">Pregled narudžbi</h2>
                <OrderTable />
              </div>
            ) : activeTab === 'customers' ? (
              <CustomerGroupsTable />
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Product List */}
                <div className={`${activeTab === 'form' ? 'hidden sm:block' : ''}`}>
                  <div className="hidden sm:flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Lista proizvoda</h2>
                  </div>
                  <ProductList
                    onEdit={(product) => {
                      handleProductEdit(product)
                      setActiveTab('form')
                    }}
                    selectedProduct={selectedProduct}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                  />
                </div>

                {/* Product Form */}
                <div className={`${activeTab === 'list' ? 'hidden sm:block' : ''}`}>
                  <h2 className="text-lg font-semibold mb-4 hidden sm:block">
                    {formMode === 'create' ? 'Dodaj novi proizvod' : 'Uredi proizvod'}
                  </h2>
                  <ProductForm
                    mode={formMode}
                    product={selectedProduct}
                    onSubmit={(success) => {
                      handleProductSubmit(success)
                      if (success) setActiveTab('list')
                    }}
                    selectedCategory={selectedCategory}
                  />
                </div>
              </div>
                <div className="mt-8 border-t pt-8">
                  <h2 className="text-lg font-semibold mb-4">Upravljanje bojama i mirisima</h2>
                  <ColorAndFragranceInput />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

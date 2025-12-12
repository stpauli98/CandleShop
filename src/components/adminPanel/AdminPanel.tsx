import { useState } from "react"
import { ProductList } from "./ProductList"
import { ProductSlideout } from "./ProductSlideout"
import { toast } from "react-hot-toast"
import Button from "@/components/ui/button"
import ColorAndFragranceSection from "./ColorAndFragranceSection"
import OrderTable from "./OrderTable"
import CustomerGroupsTable from "./CustomerGroupsTable"
import Dashboard from "./Dashboard"
import { useAuth } from "@/contexts/AuthContext"
import { useAdminState } from "./hooks/useAdminState"
import { LogOut, LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react"

export default function AdminPanel() {
  const { logout } = useAuth()
  const {
    selectedProduct,
    selectedCategory,
    formMode,
    activeTab,
    setTab,
    setCategory,
    startEdit,
    startCreate,
    resetForm,
  } = useAdminState()

  const [isSlideoutOpen, setIsSlideoutOpen] = useState(false)

  const handleEditProduct = (product: typeof selectedProduct) => {
    if (product) {
      startEdit(product)
      setIsSlideoutOpen(true)
    }
  }

  const handleAddNewProduct = () => {
    startCreate()
    setIsSlideoutOpen(true)
  }

  const handleSlideoutClose = () => {
    setIsSlideoutOpen(false)
  }

  const handleProductSuccess = () => {
    resetForm()
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      toast.error('Greška pri odjavi')
    }
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'list', label: 'Proizvodi', icon: Package },
    { id: 'orders', label: 'Narudžbe', icon: ShoppingCart },
    { id: 'customers', label: 'Kupci', icon: Users },
  ] as const

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Admin Panel
              </h1>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${activeTab === id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center">
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Odjava</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto py-2 gap-2 scrollbar-hide">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                  ${activeTab === id
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-xl p-4 sm:p-6">
          {activeTab === 'dashboard' ? (
            <Dashboard />
          ) : activeTab === 'orders' ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Pregled narudžbi</h2>
              <OrderTable />
            </div>
          ) : activeTab === 'customers' ? (
            <CustomerGroupsTable />
          ) : (
            <div className="space-y-8">
              {/* Product List with Grid */}
              <ProductList
                onEdit={handleEditProduct}
                onAddNew={handleAddNewProduct}
                selectedProduct={selectedProduct}
                selectedCategory={selectedCategory}
                onCategoryChange={setCategory}
              />

              {/* Colors and Fragrances Section */}
              <ColorAndFragranceSection />
            </div>
          )}
        </div>
      </main>

      {/* Product Slideout */}
      <ProductSlideout
        isOpen={isSlideoutOpen}
        onClose={handleSlideoutClose}
        product={selectedProduct}
        mode={formMode}
        selectedCategory={selectedCategory}
        onSuccess={handleProductSuccess}
      />
    </div>
  )
}

import { Link } from "react-router-dom"
import { Menu, X, Flame, ShoppingCart, Home, Droplet, Sparkles } from "lucide-react"
import { useState } from 'react'
import { useShoppingCart } from "../../hooks/useShoppingCart"
import ShoppingCartModal from "../cart/ShoppingCart"

interface Product {
    id: string;
    naziv?: string;
    cijena?: string;
    novaCijena?: string;
    slika?: string;
    opis?: string;
    popust?: number;
    dostupnost?: boolean;
    kategorija?: string;
}

interface CartItem extends Product {
    quantity: number;
}
// Navigation items
const navItems = [
  { name: 'Svijeće', href: '/svijece', icon: Flame },
  { name: 'Mirisne svijeće', href: '/mirisne-svijece', icon: Home },
  { name: 'Mirisni voskovi', href: '/mirisni-voskovi', icon: Droplet },
  { name: 'Dekoracije', href: '/dekoracije', icon: Sparkles },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItemCount } = useShoppingCart()

  return (
    <nav className="bg-gradient-to-b from-purple-50 to-orange-50 shadow-lg sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-400 bg-clip-text text-transparent flex items-center hover:from-purple-700 hover:to-orange-500 transition-colors duration-300"
        >
          <Flame className="h-8 w-8 mr-2 text-purple-500" />
          Šarena Čarolija
        </Link>
  
        {/* Desktop Navigation */}
        <div className="hidden sm:flex justify-between flex-1 max-w-3xl ml-20">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="group inline-flex items-center px-4 py-2 text-lg font-medium text-gray-500 hover:text-purple-600 rounded-md transition-all duration-300 relative hover:bg-white/80 hover:shadow-md"
            >
              <item.icon className="h-6 w-6 mr-2 group-hover:scale-110 text-purple-500 group-hover:text-orange-500 transition-transform duration-300" />
              {item.name}
            </Link>
          ))}
        </div>
  
        {/* Shopping Cart */}
        <div className="hidden sm:flex items-center ml-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:bg-white/80 rounded-full transition-colors duration-300 hover:shadow-md"
          >
            <ShoppingCart className="h-6 w-6 text-purple-500" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
  
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden relative inline-flex items-center justify-center p-2 rounded-md text-purple-600 hover:text-orange-500 hover:bg-white/80 transition-all duration-300"
        >
          <span className="sr-only">Otvori glavni meni</span>
          {isOpen ? (
            <X className="block h-6 w-6" />
          ) : (
            <div className="relative">
              <Menu className="block h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </div>
          )}
        </button>
      </div>
    </div>

    {/* Mobile menu */}
    <div
      className={`${
        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      } sm:hidden fixed inset-0 z-50 bg-white shadow-xl transition-all duration-300 ease-in-out transform`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-400 bg-clip-text text-transparent flex items-center"
            >
              <Flame className="h-8 w-8 mr-2 text-purple-500" />
              Šarena Čarolija
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-purple-600 hover:bg-gray-100 transition-colors duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-lg font-medium text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-300"
            >
              <item.icon className="h-6 w-6 mr-3 text-purple-500" />
              {item.name}
            </Link>
          ))}
          <button 
            onClick={() => {
              setIsCartOpen(true);
              setIsOpen(false);
            }}
            className="relative flex items-center w-full px-4 py-3 text-lg font-medium text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-300"
          >
            <ShoppingCart className="h-6 w-6 mr-3 text-purple-500" />
            Korpa
            {cartItemCount > 0 && (
              <span className="absolute top-3 left-8 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>

    {/* Shopping Cart Modal */}
    <ShoppingCartModal 
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
    />
  </nav>
  )
}

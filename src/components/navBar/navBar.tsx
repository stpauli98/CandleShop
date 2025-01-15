import { Link } from 'react-router-dom'
import { Flame, Home, Droplet, Sparkles, Menu, X, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import ShoppingCartModal from '../cart/ShoppingCart'
import { useShoppingCart } from '../../hooks/useShoppingCart'

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
    <nav className="bg-gradient-to-b from-white to-gray-50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-gray-800 hover:text-purple-600 transition-colors duration-300 flex items-center"
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
                className="group inline-flex items-center px-4 py-2 text-lg font-medium text-gray-500 hover:text-purple-600 rounded-md transition-all duration-300 relative"
              >
                <item.icon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform duration-300" />
                {item.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            ))}
          </div>

          {/* Shopping Cart */}
          <div className="hidden sm:flex items-center ml-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
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
            type="button"
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-purple-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Otvori glavni meni</span>
            {isOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        } sm:hidden fixed inset-0 z-50 bg-white shadow-xl transition-all duration-300 ease-in-out transform`}
        id="mobile-menu"
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <Link 
                to="/" 
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold text-gray-800 flex items-center"
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
                <item.icon className="h-6 w-6 mr-3" />
                {item.name}
              </Link>
            ))}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center px-4 py-3 text-lg font-medium text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-300"
            >
              <ShoppingCart className="h-6 w-6 mr-3" />
              Korpa
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
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

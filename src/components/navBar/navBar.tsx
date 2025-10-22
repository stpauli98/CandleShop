import { Link, useLocation } from "react-router-dom"
import { Flame, ShoppingCart } from "lucide-react"
import { useState, useEffect } from 'react'
import { useShoppingCart } from "../../hooks/useShoppingCart"
import ShoppingCartModal from "../cart/ShoppingCart"

// Navigation items - commented out for single-page layout
// const navItems = [
//   { name: 'Svijeće', href: '/svijece', icon: Flame },
//   { name: 'Mirisne svijeće', href: '/mirisne-svijece', icon: Home },
//   { name: 'Mirisni voskovi', href: '/mirisni-voskovi', icon: Droplet },
//   { name: 'Dekoracije', href: '/dekoracija', icon: Sparkles },
// ]

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItemCount } = useShoppingCart()
  const [isOverHero, setIsOverHero] = useState(true)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const checkHeroSection = () => {
      if (!isHomePage) {
        setIsOverHero(false)
        return
      }

      const heroSection = document.querySelector('.hero-section')
      if (!heroSection) return

      const heroRect = heroSection.getBoundingClientRect()
      setIsOverHero(heroRect.top <= 0 && heroRect.bottom >= 0)
    }

    // Inicijalna provjera
    checkHeroSection()

    // Provjera prilikom scrollanja
    if (isHomePage) {
      window.addEventListener('scroll', checkHeroSection, { passive: true })
      return () => window.removeEventListener('scroll', checkHeroSection)
    }
  }, [isHomePage])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOverHero && isHomePage
          ? 'bg-transparent'
          : 'bg-gradient-to-b from-purple-50 to-orange-50 shadow-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className={`text-3xl font-bold ${
              isOverHero && isHomePage
                ? 'text-white'
                : 'bg-gradient-to-r from-purple-600 to-orange-400 bg-clip-text text-transparent'
            } flex items-center transition-colors duration-300`}
          >
            <Flame className={`h-8 w-8 mr-2 ${isOverHero && isHomePage ? 'text-white' : 'text-purple-500'}`} />
            Šarena Čarolija
          </Link>

          {/* Desktop Navigation - commented out for single-page layout */}
          {/* <div className="hidden sm:flex justify-between flex-1 max-w-3xl ml-20">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group inline-flex items-center px-4 py-2 text-lg font-medium ${
                  isOverHero && isHomePage
                    ? 'text-white hover:text-gray-200'
                    : 'text-gray-500 hover:text-purple-600'
                } rounded-md transition-all duration-300 relative hover:bg-white/10`}
              >
                <item.icon className={`h-6 w-6 mr-2 group-hover:scale-110 ${
                  isOverHero && isHomePage
                    ? 'text-white group-hover:text-gray-200'
                    : 'text-purple-500 group-hover:text-orange-500'
                } transition-transform duration-300`} />
                {item.name}
              </Link>
            ))}
          </div> */}

          {/* Shopping Cart - Desktop and Mobile */}
          <div className="flex items-center ml-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 hover:bg-white/10 rounded-full transition-colors duration-300`}
            >
              <ShoppingCart className={`h-6 w-6 ${isOverHero && isHomePage ? 'text-white' : 'text-purple-500'}`} />
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
      <ShoppingCartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  )
}

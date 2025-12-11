import { Link, useLocation } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import { useState, useEffect } from 'react'
import { useShoppingCart } from "../../hooks/useShoppingCart"
import ShoppingCartModal from "../cart/ShoppingCart"

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItemCount } = useShoppingCart()
  const [isOverHero, setIsOverHero] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
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

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      checkHeroSection()
    }

    // Initial check
    checkHeroSection()
    handleScroll()

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [isHomePage])

  const isTransparent = isOverHero && isHomePage

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isTransparent
            ? 'bg-charcoal-900/30 backdrop-blur-md'
            : isScrolled
              ? 'bg-cream-50/95 backdrop-blur-md shadow-warm border-b border-stone-200/50'
              : 'bg-cream-50/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
            >
              {/* Brand Name */}
              <div className="flex flex-col">
                <span className={`font-display text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-300 ${
                  isTransparent
                    ? 'text-white'
                    : 'text-charcoal-800'
                }`}>
                  Šarena Čarolija
                </span>
                <span className={`text-2xs tracking-[0.2em] uppercase font-medium transition-colors duration-300 ${
                  isTransparent
                    ? 'text-amber-300/80'
                    : 'text-amber-600/80'
                }`}>
                  Ručno izrađene svijeće
                </span>
              </div>
            </Link>

            {/* Right Side - Cart */}
            <div className="flex items-center gap-4">
              {/* Contact Link - Desktop Only */}
              <a
                href="mailto:sarena.carolija2025@gmail.com"
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isTransparent
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-charcoal-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                Kontakt
              </a>

              {/* Shopping Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-3 rounded-full transition-all duration-300 ${
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-charcoal-700 hover:bg-amber-50 hover:text-amber-600'
                }`}
                aria-label="Otvori korpu"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-amber-500 text-charcoal-900 text-xs font-bold rounded-full shadow-warm animate-scale-in">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Shopping Cart Modal - Outside nav to avoid stacking context issues */}
      <ShoppingCartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

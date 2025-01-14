import { Link } from 'react-router-dom'
import { Flame, Home, Droplet, Sparkles, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { name: 'Svijeće', href: '/svijece', icon: Flame },
  { name: 'Mirisne svijeće', href: '/mirisne-svijece', icon: Home },
  { name: 'Mirisni voskovi', href: '/mirisni-voskovi', icon: Droplet },
  { name: 'Dekoracije', href: '/dekoracije', icon: Sparkles },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
            Šarena Čarolija
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex justify-between flex-1 max-w-3xl ml-20">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="inline-flex items-center px-3 py-2 text-lg font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <item.icon className="h-6 w-6 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
          isOpen ? 'block' : 'hidden'
        } sm:hidden transition-all duration-200 ease-in-out`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <item.icon className="h-5 w-5 mr-2" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

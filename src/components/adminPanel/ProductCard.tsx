import { useState } from "react"
import { motion } from "framer-motion"
import { Pencil, Trash2, Eye, EyeOff, Package } from "lucide-react"
import type { Product } from "./types"

interface ProductCardProps {
  product: Product
  isSelected: boolean
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onToggleAvailability: (product: Product) => void
}

export function ProductCard({
  product,
  isSelected,
  onEdit,
  onDelete,
  onToggleAvailability,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const discountedPrice = product.popust > 0
    ? (parseFloat(product.cijena.replace(',', '.')) * (1 - product.popust / 100)).toFixed(2)
    : null

  return (
    <motion.div
      className={`
        relative bg-white rounded-xl overflow-hidden cursor-pointer
        border-2 transition-colors duration-200
        ${isSelected
          ? 'border-purple-500 ring-2 ring-purple-200'
          : 'border-gray-100 hover:border-purple-200'
        }
      `}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.slika && !imageError ? (
          <img
            src={product.slika}
            alt={product.naziv}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            className="p-2.5 bg-white rounded-full text-gray-700 hover:bg-purple-500 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              onEdit(product)
            }}
            title="Uredi"
          >
            <Pencil className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="p-2.5 bg-white rounded-full text-gray-700 hover:bg-amber-500 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              onToggleAvailability(product)
            }}
            title={product.dostupnost ? "Označi kao nedostupno" : "Označi kao dostupno"}
          >
            {product.dostupnost ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </motion.button>
          <motion.button
            className="p-2.5 bg-white rounded-full text-gray-700 hover:bg-red-500 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(product)
            }}
            title="Obriši"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {/* Discount badge */}
          {product.popust > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full shadow-lg"
            >
              -{product.popust}%
            </motion.span>
          )}
        </div>

        {/* Availability badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`
              px-2 py-1 text-xs font-medium rounded-full shadow-sm
              ${product.dostupnost
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                : 'bg-red-100 text-red-700 border border-red-200'
              }
            `}
          >
            {product.dostupnost ? "Dostupno" : "Nedostupno"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate mb-1" title={product.naziv}>
          {product.naziv}
        </h3>

        {product.opis && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 min-h-[2.5rem]">
            {product.opis}
          </p>
        )}

        <div className="flex items-baseline gap-2">
          {discountedPrice ? (
            <>
              <span className="text-lg font-bold text-purple-600">
                {discountedPrice} KM
              </span>
              <span className="text-sm text-gray-400 line-through">
                {product.cijena} KM
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {product.cijena} KM
            </span>
          )}
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"
          layoutId="selectedIndicator"
        />
      )}
    </motion.div>
  )
}

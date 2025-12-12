import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Plus, X, Palette, Sparkles, Loader2 } from "lucide-react"
import { addItem, deleteItem, getAllItems } from "../../lib/firebase/fragrancesAndColors"
import { toast } from "react-hot-toast"
import { error } from "../../lib/logger"
import { Input } from "@/components/ui/input"
import Button from "@/components/ui/button"

interface Item {
  id: string
  name: string
  type: "color" | "fragrance"
}

export default function ColorAndFragranceSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [newColorName, setNewColorName] = useState("")
  const [newFragranceName, setNewFragranceName] = useState("")
  const [isAddingColor, setIsAddingColor] = useState(false)
  const [isAddingFragrance, setIsAddingFragrance] = useState(false)

  useEffect(() => {
    const loadItems = async () => {
      try {
        const allItems = await getAllItems()
        setItems(allItems)
      } catch (loadError) {
        error('Error loading items', loadError as Record<string, unknown>, 'ADMIN')
        toast.error('Greška pri učitavanju stavki')
      } finally {
        setLoading(false)
      }
    }

    loadItems()
  }, [])

  const handleAddColor = async () => {
    if (newColorName.trim() === "") return

    setIsAddingColor(true)
    try {
      const trimmedName = newColorName.trim()
      const id = await addItem({ name: trimmedName, type: "color" })
      setItems([...items, { id, name: trimmedName, type: "color" }])
      setNewColorName("")
      toast.success('Boja uspješno dodana')
    } catch (addError) {
      error('Error adding color', addError as Record<string, unknown>, 'ADMIN')
      if (addError instanceof Error) {
        toast.error(addError.message)
      } else {
        toast.error('Greška pri dodavanju boje')
      }
    } finally {
      setIsAddingColor(false)
    }
  }

  const handleAddFragrance = async () => {
    if (newFragranceName.trim() === "") return

    setIsAddingFragrance(true)
    try {
      const trimmedName = newFragranceName.trim()
      const id = await addItem({ name: trimmedName, type: "fragrance" })
      setItems([...items, { id, name: trimmedName, type: "fragrance" }])
      setNewFragranceName("")
      toast.success('Miris uspješno dodan')
    } catch (addError) {
      error('Error adding fragrance', addError as Record<string, unknown>, 'ADMIN')
      if (addError instanceof Error) {
        toast.error(addError.message)
      } else {
        toast.error('Greška pri dodavanju mirisa')
      }
    } finally {
      setIsAddingFragrance(false)
    }
  }

  const handleRemoveItem = async (item: Item) => {
    try {
      await deleteItem(item.id)
      setItems(items.filter((i) => i.id !== item.id))
      toast.success(`${item.type === 'color' ? 'Boja' : 'Miris'} uspješno obrisan`)
    } catch (removeError) {
      error('Error removing item', removeError as Record<string, unknown>, 'ADMIN')
      toast.error('Greška pri brisanju stavke')
    }
  }

  const colors = items.filter(item => item.type === 'color')
  const fragrances = items.filter(item => item.type === 'fragrance')

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Header - Collapsible Trigger */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Palette className="w-4 h-4 text-purple-600" />
            </div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Boje i Mirisi</h3>
            <p className="text-sm text-gray-500">
              {loading ? 'Učitavanje...' : `${colors.length} boja, ${fragrances.length} mirisa`}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 py-5 border-t border-gray-100 space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                </div>
              ) : (
                <>
                  {/* Colors Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Palette className="w-4 h-4 text-purple-600" />
                      <h4 className="font-medium text-gray-900">Boje</h4>
                    </div>

                    {/* Add Color Form */}
                    <div className="flex gap-2 mb-3">
                      <Input
                        type="text"
                        placeholder="Nova boja..."
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddColor()}
                        className="h-9"
                      />
                      <Button
                        onClick={handleAddColor}
                        disabled={isAddingColor || !newColorName.trim()}
                        size="sm"
                        className="h-9 px-3"
                      >
                        {isAddingColor ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {/* Color Tags */}
                    <div className="flex flex-wrap gap-2">
                      {colors.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Nema unesenih boja</p>
                      ) : (
                        colors.map((color) => (
                          <motion.span
                            key={color.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200 group hover:bg-purple-100 transition-colors"
                          >
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                            {color.name}
                            <button
                              onClick={() => handleRemoveItem(color)}
                              className="ml-1 p-0.5 text-purple-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </motion.span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100" />

                  {/* Fragrances Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <h4 className="font-medium text-gray-900">Mirisi</h4>
                    </div>

                    {/* Add Fragrance Form */}
                    <div className="flex gap-2 mb-3">
                      <Input
                        type="text"
                        placeholder="Novi miris..."
                        value={newFragranceName}
                        onChange={(e) => setNewFragranceName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddFragrance()}
                        className="h-9"
                      />
                      <Button
                        onClick={handleAddFragrance}
                        disabled={isAddingFragrance || !newFragranceName.trim()}
                        size="sm"
                        className="h-9 px-3"
                      >
                        {isAddingFragrance ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {/* Fragrance Tags */}
                    <div className="flex flex-wrap gap-2">
                      {fragrances.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Nema unesenih mirisa</p>
                      ) : (
                        fragrances.map((fragrance) => (
                          <motion.span
                            key={fragrance.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200 group hover:bg-amber-100 transition-colors"
                          >
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            {fragrance.name}
                            <button
                              onClick={() => handleRemoveItem(fragrance)}
                              className="ml-1 p-0.5 text-amber-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </motion.span>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

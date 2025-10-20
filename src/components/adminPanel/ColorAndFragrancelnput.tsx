"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { addItem, deleteItem, getAllItems } from "../../lib/firebase/fragrancesAndColors"
import { toast } from "react-hot-toast"
import { error } from "../../lib/logger"

interface Item {
  id: string
  name: string
  type: "color" | "fragrance"
}

const ColorAndFragranceInput: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])
  const [newItemName, setNewItemName] = useState("")
  const [newItemType, setNewItemType] = useState<"color" | "fragrance">("color")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadItems = async () => {
      try {
        const allItems = await getAllItems();
        setItems(allItems);
      } catch (loadError) {
        error('Error loading items', loadError as Record<string, unknown>, 'ADMIN');
        toast.error('Greška pri učitavanju stavki');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const handleAddItem = async () => {
    if (newItemName.trim() === "") return;

    try {
      const trimmedName = newItemName.trim();
      const id = await addItem({ name: trimmedName, type: newItemType });
      setItems([...items, { id, name: trimmedName, type: newItemType }]);
      setNewItemName("");
      toast.success(`${newItemType === 'color' ? 'Boja' : 'Miris'} uspješno dodan`);
    } catch (addError) {
      error('Error adding item', addError as Record<string, unknown>, 'ADMIN');
      if (addError instanceof Error) {
        toast.error(addError.message);
      } else {
        toast.error('Greška pri dodavanju stavke');
      }
    }
  }

  const handleRemoveItem = async (id: string) => {
    try {
      await deleteItem(id);
      setItems(items.filter((item) => item.id !== id));
      toast.success(`${items.find(i => i.id === id)?.type === 'color' ? 'Boja' : 'Miris'} uspješno obrisan`);
    } catch (removeError) {
      error('Error removing item', removeError as Record<string, unknown>, 'ADMIN');
      toast.error('Greška pri brisanju stavke');
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8 w-full">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8 w-full">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Unos boja i mirisa</h2>
      
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
              Naziv
            </label>
            <input
              id="itemName"
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Unesite naziv"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="itemType" className="block text-sm font-medium text-gray-700">
              Tip
            </label>
            <select
              id="itemType"
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value as "color" | "fragrance")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="color">Boja</option>
              <option value="fragrance">Miris</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleAddItem} 
          className="w-full md:w-auto px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition-colors"
        >
          Dodaj stavku
        </button>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tablica boja */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
              <h3 className="text-lg font-medium text-purple-900">Boje</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {items.filter(item => item.type === 'color').length === 0 ? (
                <p className="text-gray-500 text-center py-6">Nema unesenih boja</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naziv</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akcija</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items
                      .filter(item => item.type === 'color')
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <span className="w-4 h-4 rounded-full bg-purple-500" />
                              <span className="text-sm font-medium text-gray-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-3 py-1"
                            >
                              Ukloni
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Tablica mirisa */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
              <h3 className="text-lg font-medium text-amber-900">Mirisi</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {items.filter(item => item.type === 'fragrance').length === 0 ? (
                <p className="text-gray-500 text-center py-6">Nema unesenih mirisa</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naziv</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akcija</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items
                      .filter(item => item.type === 'fragrance')
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <span className="w-4 h-4 rounded-full bg-amber-500" />
                              <span className="text-sm font-medium text-gray-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-3 py-1"
                            >
                              Ukloni
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorAndFragranceInput


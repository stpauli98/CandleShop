import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useShoppingCart } from '../../hooks/useShoppingCart';
import { toast, Toaster } from 'react-hot-toast';
import { formatCurrency } from '../../utilities/formatCurency';
import { getDocs } from 'firebase/firestore';
import { omiljeniProizvodi } from '../../lib/controller';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mirisi = ["jagoda", "kruška", "vanilija", "lavanda", "kokos", "malina"] as const;

interface Product {
  id: string;
  naziv?: string;
  cijena?: string;
  slika?: string;
  opis?: string;
  popust?: number;
  dostupnost?: boolean;
  kategorija?: string;
  selectedMiris?: string;
}

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { cart, addToCart } = useShoppingCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(omiljeniProizvodi);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          cijena: doc.data().cijena || "",
          naziv: doc.data().naziv || "",
          opis: doc.data().opis || "",
          slika: doc.data().slika || "",
          popust: doc.data().popust ? Number(doc.data().popust) : undefined,
          dostupnost: doc.data().dostupnost ?? true,
          kategorija: doc.data().kategorija || ""
        } as Product)).slice(0, 6);

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    if (!product.selectedMiris) {
      toast.error("Molimo izaberite miris");
      return;
    }
    const productWithDiscount = {
      ...product,
      cijena: product.popust
        ? String(Number(product.cijena) * (1 - Number(product.popust) / 100))
        : product.cijena
    };
   
    addToCart(productWithDiscount);
    toast.success(`${product.naziv} dodan u korpu!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gradient-to-b from-purple-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Izdvojeni Proizvodi
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Pogledajte našu posebno odabranu kolekciju svijeća
          </p>
        </div>

        <div className="mt-10">
          <Toaster position="top-center" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative group">
                  <img
                    src={product.slika}
                    alt={product.naziv}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.popust && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                        -{product.popust}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.naziv}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{product.opis}</p>
                  {product.dostupnost && (
                    <div className="mb-4">
                      <Select 
                        onValueChange={(value) => {
                          const updatedProducts = products.map(p => 
                            p.id === product.id ? {...p, selectedMiris: value} : p
                          );
                          setProducts(updatedProducts);
                        }}
                        value={product.selectedMiris}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Izaberite miris" />
                        </SelectTrigger>
                        <SelectContent>
                          {mirisi.map((miris) => (
                            <SelectItem key={miris} value={miris}>
                              {miris.charAt(0).toUpperCase() + miris.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex justify-between items-end">
                    <div>
                      {product.popust && product.cijena ? (
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-amber-600">
                            {formatCurrency(Number(product.cijena) * (1 - Number(product.popust) / 100))}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatCurrency(Number(product.cijena))}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-amber-600">
                          {product.cijena ? formatCurrency(Number(product.cijena)) : 'Cijena nije definirana'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.dostupnost}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                        product.dostupnost 
                          ? 'bg-purple-600 text-white hover:bg-purple-700' 
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      } transition-colors`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span className="font-medium">
                        {cart.find(item => item.id === product.id && item.selectedMiris === product.selectedMiris)?.quantity || 'Dodaj'}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;

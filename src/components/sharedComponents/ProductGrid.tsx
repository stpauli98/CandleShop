import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useShoppingCart } from '../../hooks/useShoppingCart'
import { toast, Toaster } from 'react-hot-toast'
import { formatCurrency } from '../../utilities/formatCurency'
import { collection, getDocs, CollectionReference, DocumentData } from 'firebase/firestore'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageModal } from './ImageModal'

import { getFragrances, getColors } from '../../lib/firebase/fragrancesAndColors';

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
    selectedBoja?: string;
}

interface ProductGridProps {
    category: string;
    bgColor?: string;
    buttonColor?: string;
    collectionName: CollectionReference<DocumentData>;
}

export default function ProductGrid({ 
    category,
    bgColor = "bg-purple-50",
    buttonColor = "text-purple-600",
    collectionName
}: ProductGridProps) {
    const [products, setProducts] = useState<Product[]>([])
    const { cart, addToCart } = useShoppingCart()
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [mirisi, setMirisi] = useState<string[]>([])
    const [boje, setBoje] = useState<string[]>([])

    // Učitaj mirise i boje
    useEffect(() => {
        const loadData = async () => {
            try {
                const [fragrances, colors] = await Promise.all([
                    getFragrances(),
                    getColors()
                ]);
                setMirisi(fragrances);
                setBoje(colors);
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error('Greška pri učitavanju podataka');
            }
        };

        loadData();
    }, []);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collectionName)
                const productsData = querySnapshot.docs
                    .map(doc => ({ 
                        id: doc.id, 
                        ...doc.data(),
                        cijena: doc.data().cijena || "",
                        naziv: doc.data().naziv || "",
                        opis: doc.data().opis || "",
                        slika: doc.data().slika || "",
                        popust: doc.data().popust ? Number(doc.data().popust) : undefined,
                        dostupnost: doc.data().dostupnost ?? true,
                        kategorija: doc.data().kategorija || ""
                    } as Product))
                    // Ne filtriramo po kategoriji ako je featured
                    .filter(product => category === 'featured' ? true : product.kategorija === category)
                    // Limitiramo broj proizvoda na 6 ako je featured
                    .slice(0, category === 'featured' ? 6 : undefined)
                setProducts(productsData)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching products:", error)
                setLoading(false)
            }
        }

        fetchProducts()
    }, [category, collectionName])

    const handleAddToCart = (product: Product) => {
        const missingSelections = [];
        if (!product.selectedMiris) missingSelections.push('miris');
        if (!product.selectedBoja) missingSelections.push('boju');
        
        if (missingSelections.length > 0) {
            toast.error(`Molimo izaberite ${missingSelections.join(' i ')}`);
            return;
        }
        const productWithDiscount = {
            ...product,
            cijena: product.popust 
                ? String(Number(product.cijena) * (1 - Number(product.popust) / 100))
                : product.cijena
        }
        addToCart(productWithDiscount)
        toast.success("Proizvod dodat u korpu")
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        )
    }

    return (
        <>
            <Toaster position="top-center" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedImage && (
                    <ImageModal
                        imageUrl={selectedImage}
                        isOpen={true}
                        onClose={() => setSelectedImage(null)}
                    />
                )}
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`${bgColor} rounded-lg shadow-md overflow-hidden`}
                    >
                        <div className="relative group">
                            <img
                                src={product.slika}
                                alt={product.naziv}
                                onClick={() => {
                                    if (product.slika) {
                                        setSelectedImage(product.slika)
                                    }
                                }}
                                className={`w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 ${!product.dostupnost ? 'grayscale' : ''} cursor-pointer`}
                            />
                            {product.popust && (
                                <div className="absolute top-2 left-2">
                                    <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                                        -{product.popust}%
                                    </span>
                                </div>
                            )}
                            {!product.dostupnost && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <span className="text-white text-xl font-bold">Nije više dostupno</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.naziv}</h3>
                            <p className="text-gray-600 text-sm mb-4">{product.opis}</p>
                            {product.dostupnost && (
                                <div className="space-y-4 mb-4">
                                    <div>
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
                                    <div>
                                        <Select 
                                            onValueChange={(value) => {
                                                const updatedProducts = products.map(p => 
                                                    p.id === product.id ? {...p, selectedBoja: value} : p
                                                );
                                                setProducts(updatedProducts);
                                            }}
                                            value={product.selectedBoja}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Izaberite boju" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {boje.map((boja) => (
                                                    <SelectItem key={boja} value={boja}>
                                                        {boja.charAt(0).toUpperCase() + boja.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
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
                                        ? 'bg-amber-600 text-white hover:bg-amber-700' 
                                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    } transition-colors`}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span className="font-medium">
                                        {cart.find(item => item.id === product.id)?.quantity || 'Dodaj'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <ImageModal
                imageUrl={selectedImage || ''}
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
            />
        </>
    )
}

import { useEffect, useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useShoppingCart } from '../../hooks/useShoppingCart'
import { toast, Toaster } from 'react-hot-toast'
import { formatCurrency } from '../../utilities/formatCurency'
import { getDocs, CollectionReference, DocumentData } from 'firebase/firestore'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageModal } from './ImageModal'
import { error } from '../../lib/logger'

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
    collectionName: CollectionReference<DocumentData>;
}

export default function ProductGrid({
    category,
    bgColor = "bg-purple-50",
    collectionName
}: ProductGridProps) {
    const [products, setProducts] = useState<Product[]>([])
    const { cart, addToCart } = useShoppingCart()
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [mirisi, setMirisi] = useState<string[]>([])
    const [boje, setBoje] = useState<string[]>([])
    const [selections, setSelections] = useState<Record<string, { miris?: string; boja?: string }>>({})

    // Učitaj mirise i boje - moved async logic inside effect
    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            try {
                const [fragrances, colors] = await Promise.all([
                    getFragrances(),
                    getColors()
                ]);
                if (mounted) {
                    setMirisi(fragrances);
                    setBoje(colors);
                }
            } catch (loadError) {
                error('Error loading data', loadError as Record<string, unknown>, 'DATA_LOAD');
                if (mounted) {
                    toast.error('Greška pri učitavanju podataka');
                }
            }
        };

        void loadData();

        return () => {
            mounted = false;
        };
    }, []);

    // Fetch products - moved async logic inside effect
    useEffect(() => {
        let mounted = true;

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
                if (mounted) {
                    setProducts(productsData)
                    setLoading(false)
                }
            } catch (fetchError) {
                error("Error fetching products", fetchError as Record<string, unknown>, 'PRODUCTS');
                if (mounted) {
                    setLoading(false)
                }
            }
        };

        void fetchProducts()

        return () => {
            mounted = false;
        };
    }, [category, collectionName]);

    // Memoized discount calculation for better performance
    const calculateDiscountedPrice = useMemo(() => {
        return (price: string, discount?: number) => {
            if (!discount) return price;
            return String(Number(price) * (1 - Number(discount) / 100));
        };
    }, []);

    // Optimized cart handler with useCallback
    const handleAddToCart = useCallback((product: Product) => {
        const selectedOptions = selections[product.id];
        const missingSelections = [];
        if (!selectedOptions?.miris) missingSelections.push('miris');
        if (!selectedOptions?.boja) missingSelections.push('boju');

        if (missingSelections.length > 0) {
            toast.error(`Molimo izaberite ${missingSelections.join(' i ')}`);
            return;
        }
        const productWithDiscount = {
            ...product,
            selectedMiris: selectedOptions.miris,
            selectedBoja: selectedOptions.boja,
            cijena: calculateDiscountedPrice(product.cijena || '', product.popust)
        }
        addToCart(productWithDiscount)
        toast.success("Proizvod dodat u korpu")
    }, [addToCart, selections, calculateDiscountedPrice])

    // Optimized image modal handler with useCallback
    const handleImageClick = useCallback((imageUrl: string | undefined) => {
        if (imageUrl) {
            setSelectedImage(imageUrl);
        }
    }, []);

    // Memoized loading component
    const loadingComponent = useMemo(() => (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    ), []);

    if (loading) {
        return loadingComponent;
    }

    return (
        <>
            <Toaster position="top-center" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`${bgColor} rounded-lg shadow-md overflow-hidden flex flex-col`}
                    >
                        <div className="relative group flex-shrink-0">
                            <img
                                src={product.slika}
                                alt={product.naziv}
                                onClick={() => handleImageClick(product.slika)}
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
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">{product.naziv}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[4.5rem] flex-grow">{product.opis}</p>
                            {product.dostupnost && (
                                <div className="space-y-3 mb-4">
                                    <div>
                                        <Select
                                            onValueChange={(value) => {
                                                setSelections(prev => ({
                                                    ...prev,
                                                    [product.id]: { ...prev[product.id], miris: value }
                                                }));
                                            }}
                                            value={selections[product.id]?.miris}
                                        >
                                            <SelectTrigger className="w-full h-10">
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
                                                setSelections(prev => ({
                                                    ...prev,
                                                    [product.id]: { ...prev[product.id], boja: value }
                                                }));
                                            }}
                                            value={selections[product.id]?.boja}
                                        >
                                            <SelectTrigger className="w-full h-10">
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
                            {!product.dostupnost && <div className="mb-4 h-[5.5rem]"></div>}
                            <div className="flex justify-between items-center gap-3 mt-auto">
                                <div className="flex-shrink-0">
                                    {product.popust && product.cijena ? (
                                        <div className="flex flex-col">
                                            <span className="text-xl sm:text-2xl font-bold text-amber-600 whitespace-nowrap">
                                                {formatCurrency(Number(calculateDiscountedPrice(product.cijena, product.popust)))}
                                            </span>
                                            <span className="text-xs sm:text-sm text-gray-500 line-through whitespace-nowrap">
                                                {formatCurrency(Number(product.cijena))}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-xl sm:text-2xl font-bold text-amber-600 whitespace-nowrap">
                                            {product.cijena ? formatCurrency(Number(product.cijena)) : 'Cijena nije definirana'}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={!product.dostupnost}
                                    className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg flex-shrink-0 h-10 min-w-[100px] ${
                                        product.dostupnost
                                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    } transition-colors`}
                                >
                                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="font-medium text-sm sm:text-base">
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

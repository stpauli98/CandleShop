import { useEffect, useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useShoppingCart } from '../../hooks/useShoppingCart'
import { toast, Toaster } from 'react-hot-toast'
import { formatCurrency } from '../../utilities/formatCurency'
import { getDocs, CollectionReference, DocumentData } from 'firebase/firestore'
import { ImageModal } from './ImageModal'
import { error } from '../../lib/logger'

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
    manualProducts?: Product[];
}

export default function ProductGrid({
    category,
    bgColor = "bg-purple-50",
    collectionName,
    manualProducts
}: ProductGridProps) {
    const [products, setProducts] = useState<Product[]>([])
    const { cart, addToCart } = useShoppingCart()
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({})

    // Fetch products
    useEffect(() => {
        let mounted = true;

        const fetchProducts = async () => {
            try {
                if (manualProducts) {
                    if (mounted) {
                        setProducts(manualProducts)
                        setLoading(false)
                    }
                    return;
                }

                const querySnapshot = await getDocs(collectionName)
                const productsData = querySnapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        cijena: doc.data().cijena || "",
                        naziv: doc.data().naziv || "",
                        opis: doc.data().opis || "",
                        slika: doc.data().slika || "",
                        popust: doc.data().popust ? Number(doc.data().popust) : 0,
                        dostupnost: doc.data().dostupnost ?? true,
                        kategorija: doc.data().kategorija || ""
                    } as Product))
                    .filter(product => category === 'featured' ? true : product.kategorija === category)
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
    }, [category, collectionName, manualProducts]);

    // Memoized discount calculation
    const calculateDiscountedPrice = useMemo(() => {
        return (price: string, discount?: number) => {
            if (!discount || discount === 0) return price;
            const numPrice = Number(price);
            return (numPrice - (numPrice * discount / 100)).toFixed(2);
        };
    }, []);

    // Optimized add to cart handler
    const handleAddToCart = useCallback((product: Product) => {
        const productWithDiscount = {
            ...product,
            cijena: calculateDiscountedPrice(product.cijena || '', product.popust)
        }

        addToCart(productWithDiscount)
        toast.success('Proizvod dodat u korpu')
    }, [addToCart, calculateDiscountedPrice])

    // Image modal handler
    const handleImageClick = useCallback((imageUrl: string | undefined) => {
        if (imageUrl) {
            setSelectedImage(imageUrl);
        }
    }, []);

    // Description toggle
    const toggleDescription = useCallback((productId: string) => {
        setExpandedDescriptions(prev => ({ ...prev, [productId]: !prev[productId] }))
    }, [])

    // Loading component
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => {
                    const hasDiscount = typeof product.popust === 'number' && product.popust > 0;
                    const isExpanded = expandedDescriptions[product.id];

                    return (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden flex flex-col transition-all duration-300"
                        >
                            {/* Image Section */}
                            <div className="relative group flex-shrink-0 overflow-hidden">
                                <motion.img
                                    src={product.slika}
                                    alt={product.naziv}
                                    onClick={() => handleImageClick(product.slika)}
                                    className={`w-full h-56 object-cover cursor-pointer transition-transform duration-500 ${!product.dostupnost ? 'grayscale' : 'group-hover:scale-110'}`}
                                    whileHover={{ scale: 1.05 }}
                                />

                                {/* Discount Badge */}
                                {hasDiscount && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-3 right-3"
                                    >
                                        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                                            <div className="text-center -rotate-12">
                                                <div className="text-lg font-bold leading-none">-{product.popust}%</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Stock Badge */}
                                {product.dostupnost && (
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                                            Na stanju
                                        </span>
                                    </div>
                                )}

                                {/* Out of Stock Overlay */}
                                {!product.dostupnost && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                                        <span className="text-white text-2xl font-bold">Nije dostupno</span>
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-4 flex flex-col h-full">
                                {/* Title - Fixed Height */}
                                <h3 className="text-base font-bold text-gray-900 line-clamp-2 h-[2.5rem] hover:text-purple-600 transition-colors mb-2">
                                    {product.naziv}
                                </h3>

                                {/* Description - Expandable with flex-grow */}
                                <div className="flex-grow mb-4">
                                    <p className={`text-gray-600 text-sm leading-relaxed ${!isExpanded ? 'line-clamp-5' : ''}`}>
                                        {product.opis || 'Ručno izrađena svijeća vrhunskog kvaliteta.'}
                                    </p>
                                    {product.opis && product.opis.length > 150 && (
                                        <button
                                            onClick={() => toggleDescription(product.id)}
                                            className="text-purple-600 text-sm font-medium mt-2 hover:text-purple-700 transition-colors"
                                        >
                                            {isExpanded ? 'Prikaži manje' : 'Saznaj više'}
                                        </button>
                                    )}
                                </div>

                                {/* Selectors - Commented out for future use */}
                                {/* <div className="h-[100px] flex flex-col justify-end">
                                    {product.dostupnost && (
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                                    <Sparkles className="w-3 h-3 text-purple-500" />
                                                </div>
                                                <Select
                                                    onValueChange={(value) => {
                                                        setSelections(prev => ({
                                                            ...prev,
                                                            [product.id]: { ...prev[product.id], miris: value }
                                                        }));
                                                    }}
                                                    value={selections[product.id]?.miris}
                                                >
                                                    <SelectTrigger className="w-full h-9 pl-8 border-2 border-purple-200 focus:border-purple-500 rounded-lg transition-colors text-sm">
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

                                            <div className="relative">
                                                <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                                    <Palette className="w-3 h-3 text-purple-500" />
                                                </div>
                                                <Select
                                                    onValueChange={(value) => {
                                                        setSelections(prev => ({
                                                            ...prev,
                                                            [product.id]: { ...prev[product.id], boja: value }
                                                        }));
                                                    }}
                                                    value={selections[product.id]?.boja}
                                                >
                                                    <SelectTrigger className="w-full h-9 pl-8 border-2 border-purple-200 focus:border-purple-500 rounded-lg transition-colors text-sm">
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
                                </div> */}


                                {/* Price and Add to Cart - Fixed at Bottom */}
                                <div className="mt-auto pt-4 pb-2 border-t border-gray-100">
                                    <div className="flex justify-between items-center gap-3">
                                        <div className="flex-shrink-0">
                                            {hasDiscount && product.cijena ? (
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500 line-through">
                                                        {formatCurrency(Number(product.cijena))}
                                                    </span>
                                                    <span className="text-xl font-bold text-purple-600">
                                                        {formatCurrency(Number(calculateDiscountedPrice(product.cijena, product.popust)))}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xl font-bold text-purple-600">
                                                    {product.cijena && Number(product.cijena) > 0
                                                        ? formatCurrency(Number(product.cijena))
                                                        : 'Cijena na upit'}
                                                </span>
                                            )}
                                        </div>
                                        <motion.button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={!product.dostupnost}
                                            whileHover={product.dostupnost ? { scale: 1.05 } : {}}
                                            whileTap={product.dostupnost ? { scale: 0.95 } : {}}
                                            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all shadow-md ${
                                                product.dostupnost
                                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 hover:shadow-lg'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            <span>
                                                {cart.find(item => item.id === product.id)?.quantity || 'Dodaj'}
                                            </span>
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            <ImageModal
                imageUrl={selectedImage || ''}
                onClose={() => setSelectedImage(null)}
                isOpen={!!selectedImage}
            />
        </>
    )
}

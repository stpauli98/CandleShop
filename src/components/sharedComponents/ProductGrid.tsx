import { useEffect, useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Eye } from 'lucide-react'
import { useShoppingCart } from '../../hooks/useShoppingCart'
import { toast } from 'react-hot-toast'
import { formatCurrency } from '../../utilities/formatCurrency'
import { getDocs, CollectionReference, DocumentData } from 'firebase/firestore'
import { ImageModal } from './ImageModal'
import { error } from '../../lib/logger'
import type { Product } from '../../types/product'

interface ProductGridProps {
    category: string;
    bgColor?: string;
    collectionName: CollectionReference<DocumentData>;
    manualProducts?: Product[];
}

export default function ProductGrid({
    category,
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
        toast.success('Proizvod dodat u korpu', {
            style: {
                background: '#292524',
                color: '#fefcf3',
                borderRadius: '12px',
            },
            iconTheme: {
                primary: '#f59e0b',
                secondary: '#292524',
            },
        })
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
        <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-amber-200"></div>
                <div className="absolute inset-0 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
            </div>
            <span className="text-stone-500 text-sm">Učitavanje proizvoda...</span>
        </div>
    ), []);

    if (loading) {
        return loadingComponent;
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {products.map((product, index) => {
                    const hasDiscount = typeof product.popust === 'number' && product.popust > 0;
                    const isExpanded = expandedDescriptions[product.id];
                    const cartItem = cart.find(item => item.id === product.id);

                    return (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="group bg-white rounded-2xl shadow-warm border border-stone-100 overflow-hidden flex flex-col hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Image Section */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                                <img
                                    src={product.slika}
                                    alt={product.naziv || 'Proizvod'}
                                    loading="lazy"
                                    className={`w-full h-full object-cover transition-transform duration-500 ${
                                        !product.dostupnost ? 'grayscale' : 'group-hover:scale-105'
                                    }`}
                                />

                                {/* Overlay Actions */}
                                <div className={`absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/20 transition-colors duration-300 ${
                                    !product.dostupnost ? 'bg-charcoal-900/60' : ''
                                }`}>
                                    {product.dostupnost && (
                                        <button
                                            onClick={() => handleImageClick(product.slika)}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                                            aria-label="Pogledaj sliku"
                                        >
                                            <Eye className="w-5 h-5 text-charcoal-700" />
                                        </button>
                                    )}
                                </div>

                                {/* Badges */}
                                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                                    {/* Stock Badge */}
                                    {product.dostupnost && (
                                        <span className="badge badge-success">
                                            Na stanju
                                        </span>
                                    )}

                                    {/* Discount Badge */}
                                    {hasDiscount && (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -12 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            className="bg-gradient-to-br from-rose-500 to-rose-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg"
                                        >
                                            -{product.popust}%
                                        </motion.div>
                                    )}
                                </div>

                                {/* Out of Stock Overlay */}
                                {!product.dostupnost && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="bg-charcoal-900/80 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold">
                                            Nije dostupno
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-5 flex flex-col flex-grow">
                                {/* Title */}
                                <h3 className="font-display text-lg font-semibold text-charcoal-800 line-clamp-2 mb-2 group-hover:text-amber-700 transition-colors">
                                    {product.naziv}
                                </h3>

                                {/* Description */}
                                <div className="flex-grow mb-4">
                                    <p className={`text-stone-500 text-sm leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                                        {product.opis || 'Ručno izrađena svijeća vrhunskog kvaliteta.'}
                                    </p>
                                    {product.opis && product.opis.length > 100 && (
                                        <button
                                            onClick={() => toggleDescription(product.id)}
                                            className="text-amber-600 text-sm font-medium mt-2 hover:text-amber-700 transition-colors"
                                            aria-label={isExpanded ? `Prikaži manje opisa za ${product.naziv}` : `Saznaj više o ${product.naziv}`}
                                        >
                                            {isExpanded ? 'Prikaži manje' : 'Saznaj više'}
                                        </button>
                                    )}
                                </div>

                                {/* Price and Add to Cart */}
                                <div className="pt-4 border-t border-stone-100">
                                    <div className="flex justify-between items-center gap-3">
                                        {/* Price */}
                                        <div className="flex-shrink-0">
                                            {hasDiscount && product.cijena ? (
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-stone-400 line-through">
                                                        {formatCurrency(Number(product.cijena))}
                                                    </span>
                                                    <span className="text-xl font-bold text-amber-600">
                                                        {formatCurrency(Number(calculateDiscountedPrice(product.cijena, product.popust)))}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xl font-bold text-charcoal-800">
                                                    {product.cijena && Number(product.cijena) > 0
                                                        ? formatCurrency(Number(product.cijena))
                                                        : 'Cijena na upit'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Add to Cart Button */}
                                        <motion.button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={!product.dostupnost}
                                            whileHover={product.dostupnost ? { scale: 1.02 } : {}}
                                            whileTap={product.dostupnost ? { scale: 0.98 } : {}}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all ${
                                                product.dostupnost
                                                    ? 'bg-amber-500 hover:bg-amber-400 text-charcoal-900 shadow-warm hover:shadow-warm-lg'
                                                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                            }`}
                                            aria-label={`Dodaj ${product.naziv} u korpu`}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            <span>
                                                {cartItem?.quantity ? `${cartItem.quantity} u korpi` : 'Dodaj'}
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

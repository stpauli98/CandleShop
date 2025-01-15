import { Link } from 'react-router-dom'
import { candleCollection } from '../../lib/controller'
import { useEffect, useState } from 'react'
import { saveToCache, getFromCache } from '../../lib/cache'
import { useShoppingCart } from '../../hooks/useShoppingCart'
import { toast, Toaster } from 'react-hot-toast'
import { getDocs } from 'firebase/firestore'

interface Product {
    id: string;
    naziv?: string;
    cijena?: string;
    novaCijena?: string;
    slika?: string;
    opis?: string;
    popust?: number;
    dostupnost?: boolean;
    kategorija?: string;
}

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { addToCart } = useShoppingCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Prvo pokušaj dohvatiti iz cachea
                const cachedProducts = getFromCache<Product>();
                if (cachedProducts) {
                    setProducts(cachedProducts);
                    setIsLoading(false);
                    return;
                }

                // Ako nema u cacheu, dohvati iz Firestore
                const querySnapshot = await getDocs(candleCollection);
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[];

                setProducts(productsData);
                // Spremi u cache
                saveToCache<Product>(productsData);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Došlo je do greške prilikom učitavanja proizvoda.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (product.dostupnost === false) {
            toast.error('Proizvod trenutno nije dostupan');
            return;
        }

        addToCart(product);
    };

    if (error) {
        return (
            <div className="py-16 text-center text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <section className="py-16 bg-gray-50">
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 2000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 2000,
                        iconTheme: {
                            primary: '#4ade80',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 2000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Istaknuti proizvodi
                    {isLoading && (
                        <span className="text-sm text-gray-500 block mt-2">
                            Učitavanje...
                        </span>
                    )}
                </h2>
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                    </div>
                ) : products.length === 0 ? (
                    <p className="text-center text-gray-600">Nema dostupnih proizvoda</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div key={product.id} className="group relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                                <Link 
                                    to={`/proizvod/${product.id}`} 
                                    className="block h-full"
                                >
                                    <div className="aspect-w-1 aspect-h-1 w-full">
                                        {product.slika ? (
                                            <img
                                                src={product.slika}
                                                alt={product.naziv}
                                                className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                                onError={(e) => {
                                                    console.error("Greška pri učitavanju slike:", product.id);
                                                    e.currentTarget.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-72 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400 text-lg">Nema dostupne slike</span>
                                            </div>
                                        )}
                                        {product.popust && (
                                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                                -{product.popust}%
                                            </div>
                                        )}
                                        {product.dostupnost === false && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                <span className="text-white text-lg font-semibold">
                                                    Trenutno nedostupno
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                                                {product.naziv || 'Bez naziva'}
                                            </h3>
                                            {product.kategorija && (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                    {product.kategorija}
                                                </span>
                                            )}
                                        </div>
                                        {product.opis && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {product.opis}
                                            </p>
                                        )}
                                        <div className="mt-4 flex justify-between items-end">
                                            <div>
                                                {product.popust && product.cijena ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-2xl font-bold text-amber-600">
                                                            {(Number(product.cijena) * (1 - Number(product.popust) / 100)).toFixed(2)} KM
                                                        </span>
                                                        <span className="text-sm text-gray-500 line-through">
                                                            {product.cijena} KM
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-2xl font-bold text-amber-600">
                                                        {product.cijena ? `${product.cijena} KM` : 'Cijena nije definirana'}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 flex items-center gap-2
                                                    ${product.dostupnost === false 
                                                        ? 'bg-gray-400 cursor-not-allowed' 
                                                        : 'bg-amber-600 hover:bg-amber-700 active:scale-95'
                                                    }`}
                                                disabled={product.dostupnost === false}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                                </svg>
                                                {product.dostupnost === false ? 'Nije dostupno' : 'Dodaj u korpu'}
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
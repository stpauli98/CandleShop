import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../types/product';
import { error } from '../lib/logger';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        priceRange: [0, 1000],
        scent: '',
        size: '',
        color: '',
    });
    
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[];
                setProducts(productsData);
            } catch (loadError) {
                error('Error loading products', loadError, 'PRODUCTS');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        // Scroll to featured section if hash is present
        if (location.hash === '#featured') {
            const featuredSection = document.getElementById('featured');
            if (featuredSection) {
                featuredSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <div className="bg-black text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">Naša Kolekcija</h1>
                    <p className="text-gray-300">Pronađite savršenu svijeću za svaki trenutak</p>
                </div>
            </div>

            {/* Featured Section */}
            <section id="featured" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8">Izdvojeni Proizvodi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {loading ? (
                            // Skeleton loading
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))
                        ) : (
                            // Featured products
                            products
                                .filter(product => product.featured)
                                .map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                        )}
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8">Kategorije</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Mirisne Svijeće',
                                image: '/categories/scented.jpg',
                                description: 'Stvorite savršenu atmosferu uz naše mirisne svijeće',
                                link: '/kategorije/mirisne'
                            },
                            {
                                title: 'Dekorativne Svijeće',
                                image: '/categories/decorative.jpg',
                                description: 'Umjetnički oblikovane svijeće za poseban touch',
                                link: '/kategorije/dekorativne'
                            },
                            {
                                title: 'Poklon Paketi',
                                image: '/categories/gift.jpg',
                                description: 'Posebno upakirani setovi za savršen poklon',
                                link: '/kategorije/poklon'
                            }
                        ].map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative group overflow-hidden rounded-lg shadow-lg"
                            >
                                <img 
                                    src={category.image} 
                                    alt={category.title}
                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                                    <p className="text-gray-200 text-sm mb-4">{category.description}</p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium"
                                    >
                                        Istraži kategoriju
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filters and All Products */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <div className="lg:w-1/4">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-bold mb-4">Filteri</h3>
                                
                                {/* Price Range */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">Cijena</label>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="1000" 
                                            value={filters.priceRange[1]}
                                            onChange={(e) => setFilters({
                                                ...filters,
                                                priceRange: [0, parseInt(e.target.value)]
                                            })}
                                            className="w-full"
                                        />
                                        <span className="text-sm text-gray-600">
                                            Do {filters.priceRange[1]} KM
                                        </span>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">Kategorija</label>
                                    <select 
                                        value={filters.category}
                                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">Sve kategorije</option>
                                        <option value="mirisne">Mirisne svijeće</option>
                                        <option value="dekorativne">Dekorativne svijeće</option>
                                        <option value="poklon">Poklon paketi</option>
                                    </select>
                                </div>

                                {/* Scents */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">Miris</label>
                                    <select 
                                        value={filters.scent}
                                        onChange={(e) => setFilters({...filters, scent: e.target.value})}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">Svi mirisi</option>
                                        <option value="vanilla">Vanilija</option>
                                        <option value="lavender">Lavanda</option>
                                        <option value="citrus">Citrus</option>
                                        <option value="wood">Drvo</option>
                                    </select>
                                </div>

                                {/* Reset Filters */}
                                <button
                                    onClick={() => setFilters({
                                        category: '',
                                        priceRange: [0, 1000],
                                        scent: '',
                                        size: '',
                                        color: '',
                                    })}
                                    className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors"
                                >
                                    Resetuj filtere
                                </button>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="lg:w-3/4">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {loading ? (
                                    // Skeleton loading
                                    Array(6).fill(0).map((_, i) => (
                                        <div key={i} className="animate-pulse">
                                            <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    ))
                                ) : (
                                    // Filtered products
                                    products
                                        .filter(product => {
                                            return (
                                                (!filters.category || product.category === filters.category) &&
                                                (!filters.scent || product.scent === filters.scent) &&
                                                product.price <= filters.priceRange[1]
                                            );
                                        })
                                        .map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

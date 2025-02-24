import { motion } from 'framer-motion';
import { Product } from '../../types/product';
import { Link } from 'react-router-dom';
import { useShoppingCart } from '../../hooks/useShoppingCart';
import Button from './button';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useShoppingCart();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group"
        >
            <Link to={`/proizvod/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.featured && (
                        <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                            Izdvojeno
                        </div>
                    )}
                    {product.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            -{product.discount}%
                        </div>
                    )}
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">
                    {product.name}
                </h3>

                <div className="flex items-baseline gap-2">
                    {product.discount > 0 ? (
                        <>
                            <span className="text-lg font-bold text-gray-900">
                                {product.price * (1 - product.discount / 100)} KM
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                                {product.price} KM
                            </span>
                        </>
                    ) : (
                        <span className="text-lg font-bold text-gray-900">
                            {product.price} KM
                        </span>
                    )}
                </div>

                <div className="mt-2 flex items-center gap-2">
                    {product.scent && (
                        <span className="text-sm text-gray-500">
                            🌸 {product.scent}
                        </span>
                    )}
                    {product.size && (
                        <span className="text-sm text-gray-500">
                            📏 {product.size}
                        </span>
                    )}
                </div>
            </Link>
            <Button 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(product);
                }}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
            >
                Dodaj u košaricu
            </Button>
        </motion.div>
    );
}

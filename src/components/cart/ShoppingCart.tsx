import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useShoppingCart } from '../../hooks/useShoppingCart';

interface ShoppingCartProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
    const { cart, removeFromCart, updateQuantity, clearCart } = useShoppingCart();

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = item.novaCijena || item.cijena || '0';
            return total + (Number(price) * item.quantity);
        }, 0);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Vaša korpa</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {cart.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Vaša korpa je prazna</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-20 h-20 flex-shrink-0">
                                        {item.slika ? (
                                            <img
                                                src={item.slika}
                                                alt={item.naziv}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                                                <span className="text-gray-400 text-sm">No image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-medium">{item.naziv}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                        <span className="font-medium">
                                            {((Number(item.novaCijena || item.cijena) || 0) * item.quantity).toFixed(2)} KM
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-medium">Ukupno:</span>
                                <span className="text-xl font-bold">{calculateTotal().toFixed(2)} KM</span>
                            </div>
                            <button
                                onClick={() => {
                                    // TODO: Implementirati checkout funkcionalnost
                                    toast.success('Narudžba uspješno poslana!');
                                    clearCart();
                                    onClose();
                                }}
                                className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors"
                            >
                                Naruči
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

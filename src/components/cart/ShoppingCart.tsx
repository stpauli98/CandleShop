import { X } from 'lucide-react';
import { useShoppingCart } from '../../hooks/useShoppingCart';
import { formatCurrency } from '../../utilities/formatCurency';
import { calculateShippingCost, amountUntilFreeShipping, isFreeShipping } from '../../utilities/shipping';
import { Link } from 'react-router-dom';

interface ShoppingCartProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
    const { cart, removeFromCart, updateQuantity, calculateTotal } = useShoppingCart();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg p-4 sm:p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold">Vaša korpa</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Zatvori korpu"
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
                        <div className="space-y-3 sm:space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
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
                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-medium text-sm sm:text-base line-clamp-2">{item.naziv}</h3>
                                        {item.selectedMiris && (
                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                                Miris: {item.selectedMiris.charAt(0).toUpperCase() + item.selectedMiris.slice(1)}
                                            </p>
                                        )}
                                        {item.selectedBoja && (
                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                                Boja: {item.selectedBoja.charAt(0).toUpperCase() + item.selectedBoja.slice(1)}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedMiris, item.selectedBoja)}
                                                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors text-lg"
                                                aria-label="Smanji količinu"
                                            >
                                                -
                                            </button>
                                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedMiris, item.selectedBoja)}
                                                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors text-lg"
                                                aria-label="Povećaj količinu"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                                        <button
                                            onClick={() => removeFromCart(item.id, item.selectedMiris, item.selectedBoja)}
                                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                                            aria-label="Ukloni iz korpe"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                        <span className="font-medium text-sm sm:text-base whitespace-nowrap">
                                            {formatCurrency((Number(item.novaCijena || item.cijena) || 0) * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 sm:mt-6 border-t pt-4">
                            <div className="flex justify-between items-center mb-3 sm:mb-4">
                                <span className="text-base sm:text-lg font-medium">Ukupno:</span>
                                <span className="text-lg sm:text-xl font-bold">{formatCurrency(calculateTotal())}</span>
                            </div>
                            {!isFreeShipping(calculateTotal()) ? (
                                <div className="mb-3 sm:mb-4 p-3 bg-amber-50 rounded-lg text-amber-800 text-xs sm:text-sm">
                                    Dodajte još {formatCurrency(amountUntilFreeShipping(calculateTotal()))} za besplatnu dostavu!
                                </div>
                            ) : (
                                <div className="mb-3 sm:mb-4 p-3 bg-green-50 rounded-lg text-green-800 text-xs sm:text-sm">
                                    Čestitamo! Ostvarili ste besplatnu dostavu! 🎉
                                </div>
                            )}
                            <Link
                                to="/placanje"
                                onClick={onClose}
                                className="block w-full bg-amber-600 text-white py-3 sm:py-3.5 text-center rounded-lg hover:bg-amber-700 transition-colors font-medium text-base sm:text-lg"
                            >
                                Naruči
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

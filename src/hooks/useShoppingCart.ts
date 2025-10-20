import { useEffect, useRef, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useLocalStorage } from './useLocalStorage';

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

interface CartItem extends Product {
    quantity: number;
    selectedMiris?: string;
    selectedBoja?: string;
}

export function useShoppingCart() {
    const [cart, setCart] = useLocalStorage<CartItem[]>('shopping-cart', []);
    const isInitialMount = useRef(true);

    // Sync cart across tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'shopping-cart' && e.newValue) {
                try {
                    const newCart = JSON.parse(e.newValue);
                    setCart(newCart);
                } catch (error) {
                    console.error('Error parsing cart from storage:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [setCart]);

    // Notify when cart changes (except on initial mount)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
    }, [cart]);

    const addToCart = useCallback((product: Product, selectedMiris?: string, selectedBoja?: string) => {
        setCart(currentCart => {
            const existingItemIndex = currentCart.findIndex(
                item => item.id === product.id && item.selectedMiris === selectedMiris && item.selectedBoja === selectedBoja
            );

            if (existingItemIndex > -1) {
                const newCart = [...currentCart];
                newCart[existingItemIndex] = {
                    ...newCart[existingItemIndex],
                    quantity: newCart[existingItemIndex].quantity + 1,
                };
                return newCart;
            }

            return [...currentCart, { ...product, quantity: 1, selectedMiris, selectedBoja }];
        });

        toast.success('Proizvod je dodan u korpu!', {
            duration: 2000,
            position: 'top-right',
        });
    }, [setCart]);

    const removeFromCart = useCallback((id: string, selectedMiris?: string, selectedBoja?: string) => {
        setCart(currentCart => currentCart.filter(
            item => !(item.id === id && item.selectedMiris === selectedMiris && item.selectedBoja === selectedBoja)
        ));
        toast.success('Proizvod je uklonjen iz korpe');
    }, [setCart]);

    const updateQuantity = useCallback((id: string, quantity: number, selectedMiris?: string, selectedBoja?: string) => {
        if (quantity <= 0) {
            removeFromCart(id, selectedMiris, selectedBoja);
            return;
        }

        setCart(currentCart =>
            currentCart.map(item =>
                item.id === id && item.selectedMiris === selectedMiris && item.selectedBoja === selectedBoja
                    ? { ...item, quantity }
                    : item
            )
        );
    }, [setCart, removeFromCart]);

    const clearCart = useCallback(() => {
        setCart([]);
        toast.success('Korpa je ispražnjena');
    }, [setCart]);

    const cartItemCount = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    const calculateTotal = useCallback(() => {
        return cart.reduce((total, item) => {
            const price = item.novaCijena || item.cijena || '0';
            return total + (Number(price) * item.quantity);
        }, 0);
    }, [cart]);

    return {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartItemCount,
        calculateTotal,
    };
}

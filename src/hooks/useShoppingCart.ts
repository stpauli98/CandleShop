import { useEffect, useState, useRef } from 'react';
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
    selectedMiris?: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export function useShoppingCart() {
    const [cart, setCart] = useLocalStorage<CartItem[]>('shopping-cart', []);
    const [cartItemCount, setCartItemCount] = useState(0);
    const isUpdating = useRef(false);

    // Ažuriraj cartItemCount kad se cart promijeni
    useEffect(() => {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(count);
    }, [cart]);

    // Slušaj localStorage promjene
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'shopping-cart' && !isUpdating.current) {
                setCart(JSON.parse(e.newValue ?? ''));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [setCart]);

    const addToCart = (product: Product) => {
        if (isUpdating.current) return;
        isUpdating.current = true;

        setCart(currentCart => {
            // Proizvod je isti ako ima isti ID i isti miris
            const existingItem = currentCart.find(item => 
                item.id === product.id && item.selectedMiris === product.selectedMiris
            );
            
            if (existingItem) {
                toast.success('Količina proizvoda povećana');
                return currentCart.map(item =>
                    (item.id === product.id && item.selectedMiris === product.selectedMiris)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            
            return [...currentCart, { ...product, quantity: 1 }];
        });

        isUpdating.current = false;
    };

    const removeFromCart = (productId: string, selectedMiris?: string) => {
        if (isUpdating.current) return;
        isUpdating.current = true;

        setCart(currentCart => {
            toast.success('Proizvod uklonjen iz korpe');
            return currentCart.filter(item => 
                !(item.id === productId && item.selectedMiris === selectedMiris)
            );
        });

        isUpdating.current = false;
    };

    const updateQuantity = (productId: string, newQuantity: number, selectedMiris?: string) => {
        if (newQuantity < 1 || isUpdating.current) return;
        isUpdating.current = true;

        setCart(currentCart =>
            currentCart.map(item =>
                (item.id === productId && item.selectedMiris === selectedMiris)
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );

        isUpdating.current = false;
    };

    const clearCart = () => {
        if (isUpdating.current) return;
        isUpdating.current = true;
        setCart([]);
        isUpdating.current = false;
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = item.novaCijena || item.cijena || '0';
            return total + (Number(price) * item.quantity);
        }, 0);
    };

    return {
        cart,
        cartItemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateTotal
    };
}

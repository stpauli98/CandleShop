import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useCookieStorage } from './useCookieStorage';

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

export interface CartItem extends Product {
    quantity: number;
}

export function useShoppingCart() {
    const [cart, setCart] = useCookieStorage<CartItem[]>('shopping-cart', []);
    const [cartItemCount, setCartItemCount] = useState(0);
    const isUpdating = useRef(false);

    // Ažuriraj cartItemCount kad se cart promijeni
    useEffect(() => {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(count);
    }, [cart]);

    // Slušaj cookie promjene
    useEffect(() => {
        const handleStorageChange = (e: CustomEvent<CartItem[]>) => {
            const newCart = e.detail;
            if (!isUpdating.current) {
                setCart(newCart);
            }
        };

        window.addEventListener('cookie-storage', handleStorageChange as EventListener);
        return () => window.removeEventListener('cookie-storage', handleStorageChange as EventListener);
    }, [setCart]);

    const addToCart = (product: Product) => {
        if (isUpdating.current) return;
        isUpdating.current = true;

        setCart(currentCart => {
            const existingItem = currentCart.find(item => item.id === product.id);
            
            if (existingItem) {
                toast.success('Količina proizvoda povećana');
                return currentCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            
            toast.success('Proizvod dodan u korpu');
            return [...currentCart, { ...product, quantity: 1 }];
        });

        isUpdating.current = false;
    };

    const removeFromCart = (productId: string) => {
        if (isUpdating.current) return;
        isUpdating.current = true;

        setCart(currentCart => {
            toast.success('Proizvod uklonjen iz korpe');
            return currentCart.filter(item => item.id !== productId);
        });

        isUpdating.current = false;
    };

    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1 || isUpdating.current) return;
        isUpdating.current = true;

        setCart(currentCart =>
            currentCart.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
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

    return {
        cart,
        cartItemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };
}

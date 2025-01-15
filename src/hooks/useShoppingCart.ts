import { useLocalStorage } from './useLocalStorage';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';

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
    const [cart, setCart] = useLocalStorage<CartItem[]>('shopping-cart', []);
    const [cartItemCount, setCartItemCount] = useState(0);

    // Ažuriraj cartItemCount kad se cart promijeni
    useEffect(() => {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(count);
    }, [cart]);

    // Slušaj storage promjene
    useEffect(() => {
        const handleStorageChange = () => {
            const storedCart = localStorage.getItem('shopping-cart');
            if (storedCart) {
                const parsedCart = JSON.parse(storedCart) as CartItem[];
                const count = parsedCart.reduce((total, item) => total + item.quantity, 0);
                setCartItemCount(count);
            }
        };

        window.addEventListener('local-storage', handleStorageChange);
        return () => window.removeEventListener('local-storage', handleStorageChange);
    }, []);

    const addToCart = (product: Product) => {
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
    };

    const removeFromCart = (productId: string) => {
        setCart(currentCart => {
            toast.success('Proizvod uklonjen iz korpe');
            return currentCart.filter(item => item.id !== productId);
        });
    };

    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setCart(currentCart =>
            currentCart.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    return {
        cart,
        cartItemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setCart
    };
}

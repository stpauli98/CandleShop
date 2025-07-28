import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
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
    selectedBoja?: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export function useShoppingCart() {
    const [cart, setCart] = useLocalStorage<CartItem[]>('shopping-cart', []);
    const isUpdating = useRef(false);

    // Optimized cart count calculation with useMemo
    const cartItemCount = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
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

    const addToCart = useCallback((product: Product) => {
        if (isUpdating.current) return;
        isUpdating.current = true;

        setCart(currentCart => {
            // Proizvod je isti ako ima isti ID, miris i boju
            const existingItem = currentCart.find(item => 
                item.id === product.id && 
                item.selectedMiris === product.selectedMiris &&
                item.selectedBoja === product.selectedBoja
            );
            
            if (existingItem) {
                toast.success('Količina proizvoda povećana');
                return currentCart.map(item =>
                    (item.id === product.id && 
                     item.selectedMiris === product.selectedMiris &&
                     item.selectedBoja === product.selectedBoja)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            
            return [...currentCart, { ...product, quantity: 1 }];
        });

        isUpdating.current = false;
    }, [setCart]);

    const removeFromCart = useCallback((productId: string, selectedMiris?: string, selectedBoja?: string) => {
        if (isUpdating.current) return;
        isUpdating.current = true;

        setCart(currentCart => {
            toast.success('Proizvod uklonjen iz korpe');
            return currentCart.filter(item => 
                !(item.id === productId && 
                  item.selectedMiris === selectedMiris &&
                  item.selectedBoja === selectedBoja)
            );
        });

        isUpdating.current = false;
    }, [setCart]);

    const updateQuantity = useCallback((productId: string, newQuantity: number, selectedMiris?: string, selectedBoja?: string) => {
        if (newQuantity < 1 || isUpdating.current) return;
        isUpdating.current = true;

        setCart(currentCart =>
            currentCart.map(item =>
                (item.id === productId && 
                 item.selectedMiris === selectedMiris &&
                 item.selectedBoja === selectedBoja)
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );

        isUpdating.current = false;
    }, [setCart]);

    const clearCart = useCallback(() => {
        if (isUpdating.current) return;
        isUpdating.current = true;
        setCart([]);
        isUpdating.current = false;
    }, [setCart]);

    const calculateTotal = useMemo(() => {
        return cart.reduce((total, item) => {
            const price = item.novaCijena || item.cijena || '0';
            return total + (Number(price) * item.quantity);
        }, 0);
    }, [cart]);

    return {
        cart,
        cartItemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateTotal: () => calculateTotal
    };
}

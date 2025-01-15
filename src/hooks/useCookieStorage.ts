import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

export function useCookieStorage<T>(key: string, initialValue: T) {
    // State za praćenje vrijednosti
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const cookieValue = Cookies.get(key);
            return cookieValue ? JSON.parse(cookieValue) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const isUpdating = useRef(false);

    // Funkcija za postavljanje nove vrijednosti
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            if (isUpdating.current) return;
            isUpdating.current = true;

            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            
            // Postavi cookie s rokom trajanja od 7 dana
            Cookies.set(key, JSON.stringify(valueToStore), {
                expires: 7, // broj dana
                sameSite: 'strict',
                secure: true
            });
            
            // Dispatchaj custom event za sinkronizaciju između komponenti
            window.dispatchEvent(new CustomEvent('cookie-storage', { detail: valueToStore }));

            isUpdating.current = false;
        } catch (error) {
            console.error(error);
            isUpdating.current = false;
        }
    };

    // Event listener za cookie promjene
    useEffect(() => {
        const handleStorageChange = (e: CustomEvent<T>) => {
            if (!isUpdating.current) {
                setStoredValue(e.detail);
            }
        };

        window.addEventListener('cookie-storage', handleStorageChange as EventListener);
        return () => window.removeEventListener('cookie-storage', handleStorageChange as EventListener);
    }, []);

    return [storedValue, setValue] as const;
}

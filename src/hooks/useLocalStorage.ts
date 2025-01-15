import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    // State za praćenje vrijednosti u memoriji
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    // Event listener za storage promjene
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key) {
                try {
                    const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
                    setStoredValue(newValue);
                } catch (error) {
                    console.error(error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, initialValue]);

    // Funkcija za postavljanje nove vrijednosti
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            // Dispatchaj custom event za sinkronizaciju između komponenti
            window.dispatchEvent(new Event('local-storage'));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue] as const;
}

import { useState, useEffect, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const isUpdating = useRef(false);

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            if (isUpdating.current) return;
            isUpdating.current = true;

            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            
            // Spremi u localStorage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            
            // Dispatchaj custom event za sinkronizaciju između tabova
            window.dispatchEvent(new StorageEvent('storage', {
                key,
                newValue: JSON.stringify(valueToStore)
            }));

            isUpdating.current = false;
        } catch (error) {
            console.error(error);
            isUpdating.current = false;
        }
    };

    // Event listener za promjene u drugim tabovima
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue && !isUpdating.current) {
                setStoredValue(JSON.parse(e.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue] as const;
}

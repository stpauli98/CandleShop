import { useState, useEffect, useRef } from 'react';
import { error } from '../lib/logger';

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (storageError) {
            error('Error reading from localStorage', storageError, 'STORAGE');
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
        } catch (storageError) {
            error('Error saving to localStorage', storageError, 'STORAGE');
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

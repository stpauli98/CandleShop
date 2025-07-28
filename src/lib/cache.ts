import { DocumentData } from 'firebase/firestore';
import { error } from './logger';

const CACHE_KEY = 'candleShop_products';
const CACHE_DURATION = 1000 * 60 * 5; // 5 minuta

interface CacheItem<T> {
    data: T[];
    timestamp: number;
}

export const saveToCache = <T>(data: T[]) => {
    const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheItem));
};

export const getFromCache = <T>(): T[] | null => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const cacheItem = JSON.parse(cached) as CacheItem<T>;
        const now = Date.now();

        // Provjeri je li cache istekao
        if (now - cacheItem.timestamp > CACHE_DURATION) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }

        return cacheItem.data;
    } catch (cacheError) {
        error('Error reading from cache', cacheError, 'CACHE');
        return null;
    }
};

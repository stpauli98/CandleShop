import { error } from './logger';

const CACHE_KEY = 'candleShop_products';
const CACHE_DURATION = 1000 * 60 * 5; // 5 minuta

interface CacheItem<T> {
    data: T[];
    timestamp: number;
}

export function getCachedData<T>(key: string = CACHE_KEY): T[] | null {
    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { data, timestamp }: CacheItem<T> = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;

        if (isExpired) {
            localStorage.removeItem(key);
            return null;
        }

        return data;
    } catch (err) {
        error('Error getting cached data', err, 'CACHE');
        return null;
    }
}

export function setCachedData<T>(data: T[], key: string = CACHE_KEY): void {
    try {
        const cacheItem: CacheItem<T> = {
            data,
            timestamp: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (err) {
        error('Error setting cached data', err, 'CACHE');
    }
}

export function clearCache(key: string = CACHE_KEY): void {
    try {
        localStorage.removeItem(key);
    } catch (err) {
        error('Error clearing cache', err, 'CACHE');
    }
}

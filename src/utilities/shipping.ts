/**
 * Centralized shipping configuration and utilities
 */

export const FREE_SHIPPING_THRESHOLD = 50;
export const STANDARD_SHIPPING_COST = 5;

/**
 * Calculate shipping cost based on order total
 * @param total - Order total amount
 * @returns Shipping cost (0 if free shipping applies)
 */
export const calculateShippingCost = (total: number): number => {
    return total >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
};

/**
 * Check if order qualifies for free shipping
 * @param total - Order total amount
 * @returns True if free shipping applies
 */
export const isFreeShipping = (total: number): boolean => {
    return total >= FREE_SHIPPING_THRESHOLD;
};

/**
 * Calculate amount needed to reach free shipping threshold
 * @param total - Current order total
 * @returns Amount needed for free shipping (0 if already qualified)
 */
export const amountUntilFreeShipping = (total: number): number => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - total);
};

/**
 * Product interface - Unified type for all product-related operations
 * Uses Croatian field names to match Firebase schema
 */
export interface Product {
    id: string;
    naziv?: string;        // name
    cijena?: string;       // price (stored as string for flexibility)
    slika?: string;        // image URL
    opis?: string;         // description
    popust?: number;       // discount percentage (0-100)
    dostupnost?: boolean;  // availability
    kategorija?: string;   // category
    selectedMiris?: string;  // selected scent variant
    selectedBoja?: string;   // selected color variant
}

/**
 * CartItem extends Product with quantity tracking
 * Used for shopping cart operations
 */
export interface CartItem extends Product {
    quantity: number;
    novaCijena?: string;  // discounted price (calculated)
}

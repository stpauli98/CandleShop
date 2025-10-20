/**
 * Admin Panel Product Interface
 * Unified type for all product operations in Admin Panel
 */
export interface Product {
  id: string
  naziv: string           // Product name
  cijena: string          // Price (kept as string for Firebase compatibility and form inputs)
  slika?: string          // Image URL
  opis?: string           // Description
  popust: number          // Discount percentage (0-100)
  dostupnost: boolean     // Availability status
  kategorija: string      // Category ID

  // Extended fields for enhanced functionality
  rating?: number         // Average rating (0-5)
  reviews?: number        // Number of reviews
  createdAt?: Date        // Creation timestamp
  updatedAt?: Date        // Last update timestamp
}

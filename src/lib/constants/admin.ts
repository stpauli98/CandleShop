/**
 * Centralne konstante za Admin Panel
 * Jedinstveni izvor istine za kategorije i statuse narudžbi
 */

// ============================================================================
// KATEGORIJE PROIZVODA
// ============================================================================

export const CATEGORIES = {
  omiljeniProizvodi: { id: 'omiljeniProizvodi', name: 'Omiljeni proizvodi' },
  svijece: { id: 'svijece', name: 'Svijeće' },
  mirisneSvijece: { id: 'mirisneSvijece', name: 'Mirisne svijeće' },
  mirisniVoskovi: { id: 'mirisniVoskovi', name: 'Mirisni voskovi' },
  dekoracije: { id: 'dekoracije', name: 'Dekoracije' },
} as const;

export type CategoryId = keyof typeof CATEGORIES;

export const CATEGORIES_ARRAY = Object.values(CATEGORIES);

export const getCategoryName = (id: CategoryId): string => CATEGORIES[id].name;

// ============================================================================
// STATUSI NARUDŽBI
// ============================================================================

export const ORDER_STATUSES = {
  pending: {
    value: 'pending' as const,
    label: 'Na čekanju',
    color: 'bg-yellow-100 text-yellow-800'
  },
  processing: {
    value: 'processing' as const,
    label: 'U obradi',
    color: 'bg-blue-100 text-blue-800'
  },
  shipped: {
    value: 'shipped' as const,
    label: 'Poslato',
    color: 'bg-purple-100 text-purple-800'
  },
  delivered: {
    value: 'delivered' as const,
    label: 'Dostavljeno',
    color: 'bg-green-100 text-green-800'
  },
  cancelled: {
    value: 'cancelled' as const,
    label: 'Otkazano',
    color: 'bg-red-100 text-red-800'
  },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUSES;

export const ORDER_STATUSES_ARRAY = Object.values(ORDER_STATUSES);

export const getStatusConfig = (status: OrderStatus) => ORDER_STATUSES[status];

// ============================================================================
// ADMIN PANEL NAVIGACIJA
// ============================================================================

export type ActiveTab = 'dashboard' | 'list' | 'form' | 'orders' | 'customers';

export type FormMode = 'create' | 'edit';

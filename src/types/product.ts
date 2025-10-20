export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: 'mirisne' | 'dekorativne' | 'poklon';
    scent?: string;
    size?: string;
    color?: string;
    featured: boolean;
    discount: number;
    stock: number;
    rating: number;
    reviews: number;
    createdAt: Date;
    updatedAt: Date;
}

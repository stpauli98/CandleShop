import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface Order {
    orderNumber: string;
    items: Array<{
        id: string;
        naziv?: string;
        cijena?: string;
        kolicina: number;
        selectedMiris?: string;
    }>;
    total: number;
    shippingCost: number;
    paymentMethod: string;
    shippingInfo: {
        firstName: string;
        lastName: string;
        street: string;
        houseNumber: string;
        city: string;
        postalCode: string;
        phone: string;
        additionalInfo?: string;
    };
    customerEmail: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

export const createOrder = async (orderData: Omit<Order, 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
        const ordersRef = collection(db, 'orders');
        const orderWithTimestamps = {
            ...orderData,
            status: 'pending' as const,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        
        const docRef = await addDoc(ordersRef, orderWithTimestamps);
        return docRef.id;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

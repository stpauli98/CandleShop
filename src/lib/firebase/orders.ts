import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface Order {
    id?: string;
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

export class FirebaseError extends Error {
    constructor(message: string, public originalError: any) {
        super(message);
        this.name = 'FirebaseError';
    }
}

export const createOrder = async (orderData: Omit<Order, 'createdAt' | 'updatedAt' | 'status' | 'id'>) => {
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
    } catch (error: any) {
        console.error('Error creating order:', error);
        
        // Detektiraj specifične greške
        if (error.code === 'permission-denied' || error.message?.includes('permission_denied')) {
            throw new FirebaseError(
                'Pristup Firebase bazi je blokiran. Molimo isključite ad blocker za ovu stranicu i pokušajte ponovno.',
                error
            );
        }
        
        if (error.name === 'FirebaseError' && error.code === 'unavailable') {
            throw new FirebaseError(
                'Trenutno ne možemo pristupiti bazi podataka. Molimo provjerite vašu internet vezu.',
                error
            );
        }

        // Generička greška
        throw new FirebaseError(
            'Došlo je do greške prilikom spremanja narudžbe. Molimo pokušajte ponovno.',
            error
        );
    }
};

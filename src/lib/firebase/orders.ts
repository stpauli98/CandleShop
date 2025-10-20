import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { firebaseError, info } from '../logger';

export interface CustomerInfo {
    customerEmail: string;
    phone: string;
    firstName: string;
    lastName: string;
    orders: Order[];
    totalOrders: number;
    totalSpent: number;
}

export interface Order {
    id?: string;
    orderNumber: string;
    items: Array<{
        id: string;
        naziv?: string;
        cijena?: string;
        kolicina: number;
        selectedMiris?: string;
        selectedBoja?: string;
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
    constructor(message: string, public originalError: unknown) {
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
        info(`Order created successfully with ID: ${docRef.id}`, { orderNumber: orderData.orderNumber });
        return docRef.id;
    } catch (err: unknown) {
        firebaseError('Creating order', err);

        // Detektiraj specifične greške
        const error = err as { code?: string; message?: string; name?: string };
        if (error.code === 'permission-denied' || error.message?.includes('permission_denied')) {
            throw new FirebaseError(
                'Pristup Firebase bazi je blokiran. Molimo isključite ad blocker za ovu stranicu i pokušajte ponovno.',
                err
            );
        }

        if (error.name === 'FirebaseError' && error.code === 'unavailable') {
            throw new FirebaseError(
                'Trenutno ne možemo pristupiti bazi podataka. Molimo provjerite vašu internet vezu.',
                err
            );
        }

        // Generička greška
        throw new FirebaseError(
            'Došlo je do greške prilikom spremanja narudžbe. Molimo pokušajte ponovno.',
            err
        );
    }
};

export const getOrders = async (): Promise<Order[]> => {
    try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
                updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
            } as Order;
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes('permission')) {
            throw new FirebaseError(
                'Pristup Firebase bazi je blokiran. Molimo isključite ad blocker za ovu stranicu i pokušajte ponovno.',
                error
            );
        }
        throw new FirebaseError('Error fetching orders', error);
    }
};

export const getCustomerGroups = async (): Promise<CustomerInfo[]> => {
    try {
        const orders = await getOrders();
        const customerMap = new Map<string, CustomerInfo>();

        orders.forEach(order => {
            // Create a unique key combining email and phone
            const key = `${order.customerEmail.toLowerCase()}_${order.shippingInfo.phone}`;

            if (!customerMap.has(key)) {
                customerMap.set(key, {
                    customerEmail: order.customerEmail,
                    phone: order.shippingInfo.phone,
                    firstName: order.shippingInfo.firstName,
                    lastName: order.shippingInfo.lastName,
                    orders: [],
                    totalOrders: 0,
                    totalSpent: 0
                });
            }

            const customerInfo = customerMap.get(key)!;
            customerInfo.orders.push(order);
            customerInfo.totalOrders += 1;
            customerInfo.totalSpent += order.total;
        });

        // Convert Map to array and sort by total orders
        return Array.from(customerMap.values())
            .sort((a, b) => b.totalOrders - a.totalOrders);
    } catch (error) {
        throw new FirebaseError('Error fetching customer groups', error);
    }
};

import { collection, addDoc, serverTimestamp, getDocs, getDoc, doc, query, orderBy, where, updateDoc, Timestamp } from 'firebase/firestore';
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

export const createOrder = async (
    orderData: Omit<Order, 'createdAt' | 'updatedAt' | 'status' | 'id'>,
    retries = 3
): Promise<string> => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const ordersRef = collection(db, 'orders');
            const orderWithTimestamps = {
                ...orderData,
                status: 'pending' as const,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const docRef = await addDoc(ordersRef, orderWithTimestamps);
            info(`Order created successfully with ID: ${docRef.id} (attempt ${attempt}/${retries})`, {
                orderNumber: orderData.orderNumber
            });
            return docRef.id;
        } catch (err: unknown) {
            lastError = err;
            firebaseError(`Creating order (attempt ${attempt}/${retries})`, err);

            // Detektiraj specifične greške koje ne treba retry-ati
            const error = err as { code?: string; message?: string; name?: string };
            if (error.code === 'permission-denied' || error.message?.includes('permission_denied')) {
                throw new FirebaseError(
                    'Pristup Firebase bazi je blokiran. Molimo isključite ad blocker za ovu stranicu i pokušajte ponovno.',
                    err
                );
            }

            // Retry samo za network i unavailable greške
            if (attempt < retries && (error.code === 'unavailable' || error.code === 'network-request-failed')) {
                const delay = 1000 * attempt; // Exponential backoff: 1s, 2s, 3s
                info(`Retrying order creation after ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            // Ako je zadnji retry ili greška nije retry-able
            if (attempt === retries) {
                break;
            }
        }
    }

    // Ako smo stigli ovdje, svi retry-i su failali
    const error = lastError as { code?: string; message?: string; name?: string };
    if (error.name === 'FirebaseError' && error.code === 'unavailable') {
        throw new FirebaseError(
            'Trenutno ne možemo pristupiti bazi podataka. Molimo provjerite vašu internet vezu.',
            lastError
        );
    }

    // Generička greška
    throw new FirebaseError(
        'Došlo je do greške prilikom spremanja narudžbe. Molimo pokušajte ponovno.',
        lastError
    );
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
    try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            info(`Order not found: ${orderId}`);
            return null;
        }

        const data = orderSnap.data();
        return {
            id: orderSnap.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
        } as Order;
    } catch (error) {
        firebaseError(`Fetching order ${orderId}`, error);
        if (error instanceof Error && error.message.includes('permission')) {
            throw new FirebaseError(
                'Pristup Firebase bazi je blokiran. Molimo isključite ad blocker za ovu stranicu i pokušajte ponovno.',
                error
            );
        }
        throw new FirebaseError(`Error fetching order ${orderId}`, error);
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

/**
 * Update order status with optional email notification
 */
export const updateOrderStatus = async (
    orderId: string,
    newStatus: Order['status'],
    sendEmailNotification: boolean = true
): Promise<Order> => {
    try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            throw new FirebaseError('Order not found', { orderId });
        }

        const currentOrder = {
            id: orderSnap.id,
            ...orderSnap.data(),
            createdAt: orderSnap.data().createdAt instanceof Timestamp
                ? orderSnap.data().createdAt.toDate()
                : new Date(),
            updatedAt: orderSnap.data().updatedAt instanceof Timestamp
                ? orderSnap.data().updatedAt.toDate()
                : new Date()
        } as Order;

        const oldStatus = currentOrder.status;

        // Update status and timestamp
        await updateDoc(orderRef, {
            status: newStatus,
            updatedAt: serverTimestamp()
        });

        const updatedOrder = {
            ...currentOrder,
            status: newStatus,
            updatedAt: new Date()
        };

        info(`Order status updated: ${orderId}`, {
            oldStatus,
            newStatus,
            orderNumber: currentOrder.orderNumber
        });

        // Send email notification if requested
        if (sendEmailNotification) {
            const { sendOrderStatusUpdateEmail } = await import('../email/emailService');
            await sendOrderStatusUpdateEmail(updatedOrder, oldStatus, newStatus);
        }

        return updatedOrder;
    } catch (error) {
        firebaseError(`Updating order status for ${orderId}`, error);
        throw new FirebaseError(`Error updating order status`, error);
    }
};

/**
 * Get orders filtered by status
 */
export const getOrdersByStatus = async (status: Order['status']): Promise<Order[]> => {
    try {
        const ordersRef = collection(db, 'orders');
        const q = query(
            ordersRef,
            where('status', '==', status),
            orderBy('createdAt', 'desc')
        );
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
        firebaseError(`Fetching orders by status: ${status}`, error);
        throw new FirebaseError(`Error fetching orders by status`, error);
    }
};

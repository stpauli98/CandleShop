import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export interface Item {
    id: string;
    name: string;
    type: 'color' | 'fragrance';
}

// Dohvati sve mirise
export const getFragrances = async (): Promise<string[]> => {
    const querySnapshot = await getDocs(collection(db, 'fragrancesAndColors'));
    return querySnapshot.docs
        .filter(doc => doc.data().type === 'fragrance')
        .map(doc => doc.data().name);
};

// Dohvati sve boje
export const getColors = async (): Promise<string[]> => {
    const querySnapshot = await getDocs(collection(db, 'fragrancesAndColors'));
    return querySnapshot.docs
        .filter(doc => doc.data().type === 'color')
        .map(doc => doc.data().name);
};

// Dodaj novu stavku
export const addItem = async (item: Omit<Item, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'fragrancesAndColors'), item);
    return docRef.id;
};

// Obriši stavku
export const deleteItem = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'fragrancesAndColors', id));
};

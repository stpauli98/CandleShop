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
    return Array.from(new Set(
        querySnapshot.docs
            .filter(doc => doc.data().type === 'fragrance')
            .map(doc => doc.data().name)
    ));
};

// Dohvati sve boje
export const getColors = async (): Promise<string[]> => {
    const querySnapshot = await getDocs(collection(db, 'fragrancesAndColors'));
    return Array.from(new Set(
        querySnapshot.docs
            .filter(doc => doc.data().type === 'color')
            .map(doc => doc.data().name)
    ));
};

// Dohvati sve stavke sa pravim Firestore ID-jevima
export const getAllItems = async (): Promise<Item[]> => {
    const querySnapshot = await getDocs(collection(db, 'fragrancesAndColors'));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,  // Pravi Firestore document ID
        name: doc.data().name,
        type: doc.data().type
    }));
};

// Provjeri postoji li već stavka s istim imenom i tipom
export const checkItemExists = async (name: string, type: 'color' | 'fragrance'): Promise<boolean> => {
    const querySnapshot = await getDocs(collection(db, 'fragrancesAndColors'));
    return querySnapshot.docs.some(doc => {
        const data = doc.data();
        return data.type === type && data.name.toLowerCase() === name.toLowerCase();
    });
};

// Dodaj novu stavku
export const addItem = async (item: Omit<Item, 'id'>): Promise<string> => {
    const exists = await checkItemExists(item.name, item.type);
    if (exists) {
        throw new Error(`${item.type === 'color' ? 'Boja' : 'Miris'} s nazivom '${item.name}' već postoji.`);
    }
    const docRef = await addDoc(collection(db, 'fragrancesAndColors'), item);
    return docRef.id;
};

// Obriši stavku
export const deleteItem = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'fragrancesAndColors', id));
};

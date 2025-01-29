import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "./firebase";

export const firestore = getFirestore(app);

export const omiljeniProizvodi = collection(firestore, "omiljeniProizvodi");
export const svijece = collection(firestore, "svijece");
export const mirisneSvijece = collection(firestore, "mirisneSvijece");
export const mirisniVoskovi = collection(firestore, "mirisniVoskovi");
export const dekoracije = collection(firestore, "dekoracije");

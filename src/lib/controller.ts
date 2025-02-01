import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "./firebase";

export const firestore = getFirestore(app);

export const favoriteProducts = collection(firestore, "omiljeniProizvodi");
export const candles = collection(firestore, "svijece");
export const scentedCandles = collection(firestore, "mirisneSvijece");
export const scentedWaxes = collection(firestore, "mirisniVoskovi");
export const decorations = collection(firestore, "dekoracije");

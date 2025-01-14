import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "./firebase";

export const firestore = getFirestore(app);

export const candleCollection = collection(firestore, "svijece");

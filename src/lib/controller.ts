import { getFirestore, collection } from "firebase/firestore";
import { app } from "./firebase";

export const firestore = getFirestore(app);

export const getCollection = (name: string) => collection(firestore, name);

export const collections = {
  omiljeniProizvodi: () => getCollection("omiljeniProizvodi"),
  svijece: () => getCollection("svijece"),
  mirisneSvijece: () => getCollection("mirisneSvijece"),
  mirisniVoskovi: () => getCollection("mirisniVoskovi"),
  dekoracije: () => getCollection("dekoracije"),
} as const;

export type CollectionName = keyof typeof collections;

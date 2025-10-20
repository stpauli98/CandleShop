// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
// Firebase SDKs imported: Firestore, Auth, Storage
// Documentation: https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD7gHxyj7AW1pAv159ksET5DSq9VJkQxXA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "candleshop-865e9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "candleshop-865e9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "candleshop-865e9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "278123606394",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:278123606394:web:3a98c1c5c3e5f63fdd9207"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

// Enable CORS for development
if (import.meta.env.DEV) {
  try {
    connectStorageEmulator(storage, "localhost", 9199);
  } catch (error) {
    console.warn("Storage emulator not available:", error);
  }
}

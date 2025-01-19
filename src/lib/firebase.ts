// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7gHxyj7AW1pAv159ksET5DSq9VJkQxXA",
  authDomain: "candleshop-865e9.firebaseapp.com",
  projectId: "candleshop-865e9",
  storageBucket: "candleshop-865e9.firebasestorage.app",
  messagingSenderId: "278123606394",
  appId: "1:278123606394:web:fc665a664b9a881ae4e6c3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
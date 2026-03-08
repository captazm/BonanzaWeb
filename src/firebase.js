import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBVO_Jm2yHBk1zuZttHRfAHJF6N6At3JjU",
    authDomain: "bonanza-website-95e08.firebaseapp.com",
    projectId: "bonanza-website-95e08",
    storageBucket: "bonanza-website-95e08.firebasestorage.app",
    messagingSenderId: "691069923017",
    appId: "1:691069923017:web:407090415920be68476718"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

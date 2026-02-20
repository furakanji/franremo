import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAlpzt4pwN1U_WYX-_PSJMLULueUH2xLJc",
    authDomain: "franremo-7333c.firebaseapp.com",
    projectId: "franremo-7333c",
    storageBucket: "franremo-7333c.firebasestorage.app",
    messagingSenderId: "791102322727",
    appId: "1:791102322727:web:f27e5ba8490d60bb1a7602"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

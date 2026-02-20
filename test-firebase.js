import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAlpzt4pwN1U_WYX-_PSJMLULueUH2xLJc",
    authDomain: "franremo-7333c.firebaseapp.com",
    projectId: "franremo-7333c",
    storageBucket: "franremo-7333c.firebasestorage.app",
    messagingSenderId: "791102322727",
    appId: "1:791102322727:web:f27e5ba8490d60bb1a7602"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
    console.log("Connecting to Firestore...");
    try {
        const docRef = doc(db, "artisti", "test-connection");
        await setDoc(docRef, { ok: true });
        console.log("WRITE SUCCESSFUL!");
    } catch (e) {
        console.error("WRITE ERROR:", e);
    }
    process.exit(0);
}

run();

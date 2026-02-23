import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

async function check() {
    const snap = await getDocs(collection(db, 'artisti'));
    snap.forEach(doc => {
        const data = doc.data();
        if (doc.id.includes('luch')) {
            console.log(`FOUND: ${doc.id} - ${data.nome} | is_published: ${data.is_published} | voto: ${data.voto_admin}`);
        }
    });
    console.log("Done checking.");
    process.exit(0);
}

check();

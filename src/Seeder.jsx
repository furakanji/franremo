import { useState } from 'react';
import { db } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { initialArtists } from './seedData';

export default function Seeder() {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const runSeed = async () => {
        setLoading(true);
        setMsg('Seeding in progress...');
        try {
            const artistiRef = collection(db, 'artisti');
            for (const artist of initialArtists) {
                await setDoc(doc(artistiRef, artist.id), artist);
            }
            setMsg('Seeding completed successfully!');
        } catch (e) {
            console.error(e);
            setMsg(`Error: ${e.message}`);
        }
        setLoading(false);
    };

    return (
        <div className="p-8 text-white">
            <h1 className="text-2xl mb-4 text-primary-gold">Database Seeder</h1>
            <button
                onClick={runSeed}
                disabled={loading}
                className="px-4 py-2 bg-primary-gold text-bg-dark rounded font-bold"
            >
                {loading ? 'Seeding...' : 'Seed Data'}
            </button>
            {msg && <p className="mt-4">{msg}</p>}
        </div>
    );
}

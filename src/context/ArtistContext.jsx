import { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';

const ArtistContext = createContext();

export const useArtists = () => useContext(ArtistContext);

export const ArtistProvider = ({ children }) => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'artisti'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setArtists(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <ArtistContext.Provider value={{ artists, loading }}>
            {children}
        </ArtistContext.Provider>
    );
};

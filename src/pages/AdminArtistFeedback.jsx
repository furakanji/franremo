import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function AdminArtistFeedback() {
    const { artistId } = useParams();
    const navigate = useNavigate();

    const [artistNome, setArtistNome] = useState('Caricamento...');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Auth protection
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (!user) navigate('/admin/login');
        });
        return () => unsub();
    }, [navigate]);

    // Loda artist info
    useEffect(() => {
        if (!artistId) return;

        const fetchArtist = async () => {
            try {
                const docRef = doc(db, 'artisti', artistId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setArtistNome(docSnap.data().nome);
                } else {
                    setArtistNome('Artista non trovato');
                }
            } catch (err) {
                console.error(err);
                setArtistNome('Errore caricamento');
            }
        };

        fetchArtist();
    }, [artistId]);

    // Load messages for this artist
    useEffect(() => {
        if (!artistId) return;

        const q = query(
            collection(db, 'messaggi'),
            where('artist_id', '==', artistId),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setMessages(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [artistId]);

    const deleteMessage = async (id) => {
        if (confirm('Sicuro di voler nascondere questo messaggio per sempre?')) {
            await deleteDoc(doc(db, 'messaggi', id));
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex-shrink-0 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-lg transition-colors"
                >
                    ← Indietro
                </button>
                <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-black text-primary-gold">
                        Feedback
                    </h1>
                    <p className="text-white/60 font-bold uppercase tracking-widest text-sm mt-1">
                        {artistNome}
                    </p>
                </div>
                <div className="text-sm border border-primary-gold/30 bg-primary-gold/10 text-primary-gold px-4 py-2 rounded-full font-bold">
                    Totale: {messages.length}
                </div>
            </div>

            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 min-h-[400px]">
                {loading ? (
                    <div className="text-white/50 text-center py-10 font-bold">Ricerca feedback...</div>
                ) : messages.length === 0 ? (
                    <div className="text-white/50 text-center py-20">
                        <div className="text-4xl mb-4">📭</div>
                        <h2 className="text-xl font-bold mb-2">Nessun feedback</h2>
                        <p className="text-sm">Il popolo non ha ancora detto nulla su di loro.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {messages.map(msg => (
                            <div key={msg.id} className="bg-black/40 border border-white/5 rounded-2xl p-5 group relative flex flex-col hover:border-white/10 transition-colors">
                                <button onClick={() => deleteMessage(msg.id)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-full w-8 h-8 flex items-center justify-center font-black">
                                    ✕
                                </button>

                                <span className="text-xs text-white/40 font-semibold tracking-wider mb-3">
                                    {msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleString('it-IT') : 'Adesso'}
                                </span>

                                {msg.type === 'audio' ? (
                                    <div className="bg-white/10 p-4 rounded-xl border border-white/20 flex flex-col gap-3 mt-auto">
                                        <div className="font-bold text-sm text-purple-400 flex items-center gap-2">
                                            <span className="animate-pulse">🎙️</span> Nota vocale dal pubblico
                                        </div>
                                        <audio controls className="w-full h-10 outline-none rounded-full">
                                            <source src={msg.audio_url} type="video/webm" />
                                            Il tuo browser non supporta l'audio.
                                        </audio>
                                        <a href={msg.audio_url} target="_blank" rel="noreferrer" className="text-xs text-white/50 hover:text-white mt-1 border border-white/10 self-start px-3 py-1 rounded-full text-center inline-block transition-colors">Scarica / Apri</a>
                                    </div>
                                ) : (
                                    <p className="text-white/90 italic leading-relaxed text-lg pb-4">"{msg.messaggio}"</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

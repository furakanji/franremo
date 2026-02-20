import { useState, useEffect } from 'react';
import { useArtists } from '../context/ArtistContext';
import { db, auth } from '../firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function AdminDashboard() {
    const { artists, loading: artistsLoading } = useArtists();
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(true);

    const [selectedArtistId, setSelectedArtistId] = useState('');
    const [review, setReview] = useState('');
    const [vote, setVote] = useState(0);
    const [keyword, setKeyword] = useState('');

    const [isPublishing, setIsPublishing] = useState(false);
    const navigate = useNavigate();

    // Auth protection
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (!user) navigate('/admin/login');
        });
        return () => unsub();
    }, [navigate]);

    // Load messages
    useEffect(() => {
        const q = query(collection(db, 'messaggi'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(data);
            setLoadingMessages(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!selectedArtistId) return;

        setIsPublishing(true);
        try {
            const ref = doc(db, 'artisti', selectedArtistId);
            await updateDoc(ref, {
                recensione_admin: review,
                voto_admin: Number(vote),
                parola_chiave: keyword,
                is_published: true,
                published_at: new Date()
            });
            alert('Artista pubblicato con successo!');
            setSelectedArtistId('');
            setReview('');
            setVote(0);
            setKeyword('');
        } catch (e) {
            console.error(e);
            alert('Errore pubblicazione.');
        }
        setIsPublishing(false);
    };

    const deleteMessage = async (id) => {
        if (confirm('Sicuro di voler nascondere questo messaggio per sempre?')) {
            await deleteDoc(doc(db, 'messaggi', id));
        }
    };

    if (artistsLoading) return <div className="p-8 text-center text-white/50">Caricamento...</div>;

    const selectedArtist = artists.find(a => a.id === selectedArtistId);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                <h1 className="text-3xl font-black text-primary-gold">Centro di Controllo Franremo</h1>
                <button onClick={handleLogout} className="text-sm font-bold bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20">
                    Esci
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Colonna Sinistra: Pubblica */}
                <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6">Pubblica Sentenza</h2>
                    <form onSubmit={handlePublish} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-bold text-white/60 mb-2">Seleziona Artista</label>
                            <select
                                value={selectedArtistId}
                                onChange={(e) => {
                                    setSelectedArtistId(e.target.value);
                                    const a = artists.find(ar => ar.id === e.target.value);
                                    if (a) {
                                        setReview(a.recensione_admin || '');
                                        setVote(a.voto_admin || 0);
                                        setKeyword(a.parola_chiave || '');
                                    }
                                }}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-gold"
                                required
                            >
                                <option value="">-- Seleziona --</option>
                                <optgroup label="Da valutare">
                                    {artists.filter(a => !a.is_published).map(a => (
                                        <option key={a.id} value={a.id}>{a.nome}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="Già Pubblicati (Modifica)">
                                    {artists.filter(a => a.is_published).map(a => (
                                        <option key={a.id} value={a.id}>{a.nome}</option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>

                        {selectedArtist && (
                            <>
                                <div>
                                    <label className="block text-sm font-bold text-white/60 mb-2">Recensione di {selectedArtist.nome}</label>
                                    <textarea
                                        value={review}
                                        onChange={e => setReview(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-gold h-32 resize-none"
                                        required
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-white/60 mb-2">Voto (1-10)</label>
                                        <input
                                            type="number" min="0" max="10" step="0.5"
                                            value={vote}
                                            onChange={e => setVote(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-gold text-2xl font-black transition-colors"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-white/60 mb-2">Parola Chiave</label>
                                        <input
                                            type="text"
                                            value={keyword}
                                            onChange={e => setKeyword(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-gold uppercase font-bold"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isPublishing}
                                    className="bg-primary-gold text-bg-dark font-black text-lg py-4 rounded-xl hover:scale-[1.02] transition-transform mt-4 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {isPublishing ? 'IN SALVATAGGIO...' : 'PUBBLICA ORA'}
                                </button>
                            </>
                        )}
                    </form>

                    {/* Lista Artisti Pubblicati e Reset */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                            <span>Artisti Pubblicati</span>
                            <span className="text-sm bg-primary-gold/20 text-primary-gold px-3 py-1 rounded-full">{artists.filter(a => a.is_published).length}</span>
                        </h3>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {artists.filter(a => a.is_published).length === 0 ? (
                                <p className="text-white/50 text-sm">Nessun artista pubblicato.</p>
                            ) : (
                                artists.filter(a => a.is_published).map(artist => (
                                    <div key={artist.id} className="bg-black/40 border border-white/5 p-3 rounded-xl flex items-center justify-between group">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white group-hover:text-primary-gold transition-colors">{artist.nome}</span>
                                            <span className="text-xs text-white/50">Voto: {artist.voto_admin} • {artist.parola_chiave}</span>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                if (confirm(`Sei sicuro di voler resettare e RITIRARE la pubblicazione per ${artist.nome}?`)) {
                                                    try {
                                                        await updateDoc(doc(db, 'artisti', artist.id), {
                                                            is_published: false,
                                                            recensione_admin: "",
                                                            voto_admin: 0,
                                                            parola_chiave: ""
                                                        });
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert("Errore durante il reset.");
                                                    }
                                                }
                                            }}
                                            className="text-xs font-bold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg transition-colors border border-red-500/20"
                                        >
                                            Ritira
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Colonna Destra: Feedback e Audio */}
                <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col max-h-[800px]">
                    <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
                        <span>Feedback dal Popolo</span>
                        <span className="text-sm bg-white/10 px-3 py-1 rounded-full">{messages.length}</span>
                    </h2>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {loadingMessages ? (
                            <div className="text-white/50 text-center py-10">Caricamento messaggi...</div>
                        ) : messages.length === 0 ? (
                            <div className="text-white/50 text-center py-10 text-lg">Nessun feedback ricevuto.</div>
                        ) : (
                            messages.map(msg => (
                                <div key={msg.id} className="bg-black/40 border border-white/5 rounded-2xl p-4 group relative">
                                    <button onClick={() => deleteMessage(msg.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300">
                                        ✕
                                    </button>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-primary-gold uppercase bg-primary-gold/10 px-2 py-1 rounded-md">
                                            Su {msg.artist_nome}
                                        </span>
                                        <span className="text-[10px] text-white/40">
                                            {msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleString('it-IT') : 'Adesso'}
                                        </span>
                                    </div>

                                    {msg.type === 'audio' ? (
                                        <div className="mt-4 bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col gap-3">
                                            <div className="font-bold text-sm text-purple-400 flex items-center gap-2">
                                                <span>🎙️</span> Nuova performance vocale (10s)
                                            </div>
                                            <audio controls className="w-full h-10 outline-none rounded-full">
                                                <source src={msg.audio_url} type="video/webm" />
                                                Il tuo browser non supporta l'audio.
                                            </audio>
                                            <a href={msg.audio_url} target="_blank" rel="noreferrer" className="text-xs text-white/50 underline hover:text-white">Apri link originale</a>
                                        </div>
                                    ) : (
                                        <p className="text-white/90 italic leading-relaxed text-sm mt-3">"{msg.messaggio}"</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

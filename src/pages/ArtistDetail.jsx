import { useState, useRef } from 'react';
import { useArtists } from '../context/ArtistContext';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function ArtistDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { artists, loading } = useArtists();
    const artist = artists.find(a => a.id === id);

    const [vote, setVote] = useState(5);
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const [isSubmittingVote, setIsSubmittingVote] = useState(false);
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [feedbackSent, setFeedbackSent] = useState(false);

    // Audio Recording states
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    if (loading) return <div className="p-8 text-center text-white/50">Caricamento...</div>;
    if (!artist) return <div className="p-8 text-center text-white/50">Artista non trovato.</div>;

    const handleVote = async () => {
        if (localStorage.getItem(`voted_${id}`)) {
            alert("Hai già votato per questo artista!");
            return;
        }

        setIsSubmittingVote(true);
        try {
            const docRef = doc(db, 'artisti', id);
            await updateDoc(docRef, {
                user_votes: arrayUnion(vote)
            });
            localStorage.setItem(`voted_${id}`, 'true');
            alert(`Hai votato ${vote}! Grazie per il tuo contributo.`);
        } catch (e) {
            console.error(e);
            alert("Errore durante il voto.");
        }
        setIsSubmittingVote(false);
    };

    const handleFeedback = async (e) => {
        e.preventDefault();
        if (!feedbackMsg.trim()) return;

        setIsSubmittingFeedback(true);
        try {
            await addDoc(collection(db, 'messaggi'), {
                artist_id: id,
                artist_nome: artist.nome,
                messaggio: feedbackMsg,
                timestamp: serverTimestamp()
            });
            setFeedbackMsg('');
            setFeedbackSent(true);
        } catch (e) {
            console.error(e);
            alert("Errore nell'invio del feedback.");
        }
        setIsSubmittingFeedback(false);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                uploadAudioToCloudinary(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(10);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev <= 1) {
                        stopRecording();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (e) {
            console.error(e);
            alert("Impossibile accedere al microfono.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const uploadAudioToCloudinary = async (audioBlob) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', audioBlob);
        formData.append('upload_preset', 'franremo_audio');

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/dq18vdpum/video/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            const upUrl = data.secure_url;

            // Save it as anonymous message with audio type to admin
            await addDoc(collection(db, 'messaggi'), {
                artist_id: id,
                artist_nome: artist.nome,
                audio_url: upUrl,
                timestamp: serverTimestamp(),
                type: 'audio'
            });

            setAudioUrl(upUrl);
            alert("Performance vocale inviata!");
        } catch (e) {
            console.error(e);
            alert("Errore durante l'upload dell'audio.");
        }
        setIsUploading(false);
    };

    const hasVoted = localStorage.getItem(`voted_${id}`);

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="text-white/50 hover:text-white mb-6 flex items-center gap-2">
                ← Torna indietro
            </button>

            {/* Header Artista */}
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
                <div className="w-1/2 max-w-[200px] md:w-64 md:max-w-none shrink-0 aspect-square mx-auto md:mx-0 border-4 border-primary-gold p-1 md:p-2 bg-slate-900 rounded-2xl shadow-xl shadow-bg-dark/50 relative">
                    <img
                        src={`/assets/cantanti/${artist.immagine || artist.nome + '.png'}`}
                        alt={artist.nome}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(artist.nome) + '&background=fbbf24&color=0f172a'; }}
                    />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black mb-2 text-primary-gold">{artist.nome}</h1>
                    <h2 className="text-xl md:text-2xl font-bold text-white/80 mb-6">{artist.canzone}</h2>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative">
                        <span className="absolute -top-3 left-6 bg-primary-gold text-bg-dark px-3 py-1 text-xs font-black uppercase rounded-full shadow-lg">
                            La Sentenza di Fran
                        </span>
                        <p className="italic text-lg mb-4 text-white/90">
                            "
                            {artist.recensione_admin ? (
                                artist.recensione_admin.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                                    part.match(/https?:\/\/[^\s]+/) ? (
                                        <a key={i} href={part} target="_blank" rel="noreferrer" className="text-primary-gold underline hover:text-white transition-colors">
                                            {part}
                                        </a>
                                    ) : part
                                )
                            ) : "Nessuna recensione ancora."}
                            "
                        </p>
                        <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                            <div className="bg-primary-gold/20 border border-primary-gold/40 text-primary-gold px-4 py-2 rounded-xl text-center">
                                <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">Voto</div>
                                <div className="text-3xl font-black leading-none mt-1">{artist.voto_admin}</div>
                            </div>
                            {artist.parola_chiave && (
                                <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-center">
                                    <div className="text-[10px] uppercase font-bold tracking-wider text-white/50">Motivo</div>
                                    <div className="text-lg font-bold leading-none mt-1 uppercase text-white/90">{artist.parola_chiave}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Voto Utenti */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 mb-8 border border-white/10 shadow-2xl">
                <h3 className="text-2xl font-black text-center mb-6">Dai il tuo Voto</h3>
                {hasVoted ? (
                    <div className="text-center text-primary-gold font-bold bg-primary-gold/10 p-4 rounded-xl">
                        Hai già espresso il tuo voto! 🎉
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <input
                            type="range"
                            min="1" max="10" step="1"
                            value={vote}
                            onChange={(e) => setVote(e.target.value)}
                            className="w-full max-w-md accent-primary-gold"
                        />
                        <div className="text-5xl font-black text-primary-gold my-2">{vote}</div>
                        <button
                            onClick={handleVote}
                            disabled={isSubmittingVote}
                            className="bg-primary-gold text-bg-dark px-10 py-3 rounded-full font-black text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isSubmittingVote ? 'Voto...' : 'CONFERMA VOTO'}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Feedback form */}
                <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">Non sei d'accordo?</h3>
                    <p className="text-sm text-white/50 mb-6 flex gap-2">
                        <span>🤫</span> I commenti sono anonimi e li leggerò soltanto io chè magari imparo qualcosa!
                    </p>
                    {feedbackSent ? (
                        <div className="text-green-400 p-4 bg-green-400/10 rounded-xl text-center font-bold">
                            Messaggio inviato, grazie!
                        </div>
                    ) : (
                        <form onSubmit={handleFeedback} className="flex flex-col gap-4">
                            <textarea
                                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary-gold transition-colors outline-none resize-none"
                                rows="4"
                                placeholder="Scrivi qui la tua opinione..."
                                value={feedbackMsg}
                                onChange={(e) => setFeedbackMsg(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmittingFeedback || !feedbackMsg.trim()}
                                className="bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
                            >
                                {isSubmittingFeedback ? 'Invio...' : 'Invia Commento'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Audio Box */}
                <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-bold text-white mb-4">Allora cantala tu</h3>
                    <p className="text-sm text-white/60 mb-8">
                        Hai 10 secondi per dimostrare di essere meglio.
                    </p>

                    {isRecording ? (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4 relative animate-pulse">
                                <span className="text-3xl font-black text-red-500 z-10">{recordingTime}</span>
                                <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <button
                                onClick={stopRecording}
                                className="bg-red-500 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition-colors"
                            >
                                Ferma prima
                            </button>
                        </div>
                    ) : isUploading ? (
                        <div className="text-primary-gold animate-pulse text-lg font-bold flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-4 border-primary-gold border-t-transparent animate-spin rounded-full"></div>
                            Invio base a Pippo Baudo in corso...
                        </div>
                    ) : audioUrl ? (
                        <div className="text-green-400 font-bold flex flex-col items-center gap-4">
                            <span className="text-4xl">🎙️</span>
                            Performance ricevuta dal maestro!
                        </div>
                    ) : (
                        <button
                            onClick={startRecording}
                            className="bg-purple-600 text-white px-8 py-4 rounded-full font-black text-lg hover:scale-105 hover:bg-purple-500 transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20"
                        >
                            🎙️ REGISTRA (10s)
                        </button>
                    )}
                </div>
            </div>

            {/* Counter Voti */}
            <div className="mt-12 text-center bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
                <div className="text-sm font-bold text-white/50 uppercase tracking-wider mb-2">Popolarità</div>
                <div className="text-5xl font-black text-primary-gold mb-1">
                    {artist.user_votes ? artist.user_votes.length : 0}
                </div>
                <div className="text-lg font-bold text-white/70">
                    {artist.user_votes?.length === 1 ? 'voto ricevuto dal pubblico' : 'voti ricevuti dal pubblico'}
                </div>
            </div>
        </div>
    );
}

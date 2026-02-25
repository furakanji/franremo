import { useState } from 'react';
import { useArtists } from '../context/ArtistContext';
import { Coffee, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function SanremoAlCaffe() {
    const { artists } = useArtists();
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateSummary = async () => {
        const published = artists.filter(a => a.is_published);
        if (published.length < 3) {
            setError("Servono almeno 3 artisti pubblicati per un caffè coi fiocchi!");
            return;
        }

        setLoading(true);
        setError('');
        setSummary('');

        // Pick 3 random artists
        const shuffled = [...published].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        const prompt = `Agisci come un critico musicale contemporaneo simpatico e divertente. Scrivi un piccolo riassunto di massimo 50 parole complessive su questi 3 artisti a Sanremo, basandoti sulle loro recensioni:\n` +
            selected.map(a => `- ${a.nome}: "${a.recensione_admin || a.canzone}"`).join('\n');

        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            setSummary(response.text());
        } catch (e) {
            console.error(e);
            setError("Errore Gemini: " + (e.message || "Errore sconosciuto"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 mb-8 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl group-hover:blur-2xl transition-all pointer-events-none">
                <Coffee size={120} className="text-primary-gold" />
            </div>

            <div className="relative z-10">
                <h2 className="text-2xl font-black text-primary-gold mb-3 flex items-center justify-center gap-2">
                    <Coffee className="text-white" size={24} /> Sanremo al caffè
                </h2>
                <p className="text-white/80 mb-6 font-medium">
                    Non sai cosa dire su Sanremo in ufficio? clicca qui per un sintesi personalizzata
                </p>

                {!summary && !loading && (
                    <button
                        onClick={generateSummary}
                        className="bg-primary-gold text-bg-dark px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                    >
                        <Sparkles size={18} /> Escila
                    </button>
                )}

                {loading && (
                    <div className="text-primary-gold animate-pulse flex flex-col items-center gap-2 py-4">
                        <Coffee className="animate-bounce" size={24} />
                        <span className="font-semibold">Macinando recensioni...</span>
                    </div>
                )}

                {error && (
                    <div className="text-red-400 mt-4 bg-red-400/10 p-3 rounded-lg text-sm font-semibold">
                        {error}
                    </div>
                )}

                {summary && !loading && (
                    <div className="mt-6 bg-bg-dark/50 border border-primary-gold/30 rounded-2xl p-6 text-left">
                        <p className="text-white/90 text-lg md:text-xl leading-relaxed font-serif italic mb-4">
                            "{summary.replace(/"/g, '').trim()}"
                        </p>
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={generateSummary}
                                className="text-sm text-primary-gold hover:text-white transition-colors underline decoration-primary-gold/50 underline-offset-4"
                            >
                                Un altro giro?
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

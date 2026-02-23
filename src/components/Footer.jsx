import { useArtists } from '../context/ArtistContext';

export default function Footer() {
    const { artists, loading } = useArtists();

    if (loading) return null;

    const published = artists.filter(a => a.is_published);

    // Podio di Fran (voto admin)
    const podioFran = [...published].sort((a, b) => (b.voto_admin || 0) - (a.voto_admin || 0)).slice(0, 3);

    // Podio Popoloso (media voti utenti)
    const getAvg = (arr) => arr?.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    const podioPopoloso = [...published].sort((a, b) => getAvg(b.user_votes) - getAvg(a.user_votes)).slice(0, 3);

    return (
        <footer className="bg-slate-900 border-t border-white/5 p-8 mt-[10vh]">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-xl font-bold text-primary-gold mb-6 flex items-center gap-2">
                        👑 Podio di Fran
                    </h3>
                    <ul className="space-y-3">
                        {podioFran.map((artist, i) => (
                            <li key={artist.id} className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-lg">
                                <span className="font-semibold text-lg">{i + 1}. {artist.nome}</span>
                                <span className="font-bold text-primary-gold">{artist.voto_admin}/10</span>
                            </li>
                        ))}
                        {podioFran.length === 0 && <span className="text-white/50 italic">Ancora nessun voto.</span>}
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-primary-gold mb-6 flex items-center gap-2">
                        👥 Podio Popoloso
                    </h3>
                    <ul className="space-y-3">
                        {podioPopoloso.map((artist, i) => (
                            <li key={artist.id} className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-lg">
                                <span className="font-semibold text-lg">{i + 1}. {artist.nome}</span>
                                <span className="font-bold text-primary-gold">{getAvg(artist.user_votes).toFixed(1)}/10</span>
                            </li>
                        ))}
                        {podioPopoloso.length === 0 && <span className="text-white/50 italic">Ancora nessun voto.</span>}
                    </ul>
                </div>
            </div>
            <div className="max-w-4xl mx-auto mt-16 bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
                <h3 className="text-2xl font-black text-primary-gold mb-3">Hai commenti o suggerimenti?</h3>
                <p className="text-white/80 mb-6 text-lg">
                    Ma soprattutto... vuoi fare il bis la serata delle cover?
                </p>
                <a
                    href="mailto:ciao@sanremo.live?subject=FranRemo%20-%20Idee%20e%20Feedback"
                    className="inline-block bg-primary-gold text-bg-dark px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                >
                    Scrivimi Qui 📝
                </a>
            </div>

            <div className="max-w-4xl mx-auto text-center mt-12 text-white/30 text-sm font-medium">
                FranRemo - A Totally Unnecessary Productions {new Date().getFullYear()}
            </div>
        </footer>
    );
}

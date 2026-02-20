import { useArtists } from '../context/ArtistContext';
import { Link } from 'react-router-dom';

export default function ClassificaPage() {
    const { artists, loading } = useArtists();

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary-gold border-t-transparent rounded-full"></div>
        </div>
    );

    const getAvg = (arr) => arr?.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

    const publishedArtists = artists
        .filter(a => a.is_published)
        .sort((a, b) => getAvg(b.user_votes) - getAvg(a.user_votes));

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black mb-8 text-center text-primary-gold">Classifica Popolosa</h1>

            {publishedArtists.length === 0 ? (
                <p className="text-center text-white/50 py-10">Nessun artista ancora pubblicato.</p>
            ) : (
                <div className="space-y-4">
                    {publishedArtists.map((artist, index) => {
                        const avg = getAvg(artist.user_votes);
                        return (
                            <Link to={`/artista/${artist.id}`} key={artist.id} className="block group">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-primary-gold/50 transition-all flex items-center gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-bg-dark rounded-full font-black text-xl border border-white/10 text-white/80 group-hover:text-primary-gold transition-colors shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/20">
                                        <img
                                            src={`/assets/cantanti/${artist.nome}.png`}
                                            alt={artist.nome}
                                            className="w-full h-full object-cover rounded-full"
                                            onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(artist.nome) + '&background=fbbf24&color=0f172a'; }}
                                        />
                                    </div>
                                    <div className="flex-1 font-bold text-lg md:text-xl truncate group-hover:text-primary-gold transition-colors">{artist.nome}</div>
                                    <div className="font-black text-2xl text-primary-gold bg-primary-gold/10 px-4 py-2 rounded-xl border border-primary-gold/20 shrink-0">
                                        {avg > 0 ? avg.toFixed(1) : '-'}
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    );
}

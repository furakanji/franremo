import { useArtists } from '../context/ArtistContext';
import ArtistCard from '../components/ArtistCard';

export default function HomePage() {
    const { artists, loading } = useArtists();

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary-gold border-t-transparent rounded-full"></div>
        </div>
    );

    const publishedArtists = artists
        .filter(a => a.is_published)
        .sort((a, b) => {
            const voteDiff = (b.voto_admin || 0) - (a.voto_admin || 0);
            if (voteDiff !== 0) return voteDiff;

            const dateA = a.published_at?.toMillis ? a.published_at.toMillis() : 0;
            const dateB = b.published_at?.toMillis ? b.published_at.toMillis() : 0;
            return dateB - dateA; // Cronologico inverso a parità di voto
        });

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black mb-2">Ultime Pagelle di Fran</h1>
            <p className="text-white/70 mb-8 text-sm md:text-base leading-relaxed">
                Trovate tutte le pagelle cliccando sui cantanti e continuate a lasciare i vostri commenti e soprattutto le vostre interpretazioni dei pezzi.
            </p>
            {publishedArtists.length === 0 ? (
                <p className="text-center text-white/50 py-10 bg-white/5 rounded-2xl">Nessun artista ancora pubblicato.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {publishedArtists.map((artist, index) => (
                        <ArtistCard
                            key={artist.id}
                            artist={artist}
                            isLatest={index === 0}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

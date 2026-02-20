import { Link } from 'react-router-dom';

export default function ArtistCard({ artist, isLatest }) {
    return (
        <Link to={`/artista/${artist.id}`} className="block relative group">
            {isLatest && (
                <div className="absolute -top-3 -right-3 z-10">
                    <span className="relative flex h-8 w-16 justify-center items-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-6 w-14 bg-red-500 text-xs font-bold items-center justify-center shadow-lg">LIVE</span>
                    </span>
                </div>
            )}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-primary-gold/50 transition-all hover:bg-white/10 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-primary-gold p-0.5">
                    <img
                        src={`/assets/cantanti/${artist.nome}.png`}
                        alt={artist.nome}
                        className="w-full h-full object-cover rounded-full bg-bg-dark"
                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(artist.nome) + '&background=fbbf24&color=0f172a'; }}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold truncate group-hover:text-primary-gold transition-colors">{artist.nome}</h2>
                    <p className="text-sm text-white/60 truncate">{artist.canzone}</p>
                </div>
                <div className="shrink-0 flex flex-col items-center justify-center bg-primary-gold/10 rounded-xl p-2 min-w-[3.5rem] border border-primary-gold/20 group-hover:bg-primary-gold/20 transition-colors">
                    <span className="text-xs text-primary-gold uppercase font-bold text-[10px]">Voto</span>
                    <span className="text-xl font-black text-primary-gold">{artist.voto_admin}</span>
                </div>
            </div>
        </Link>
    );
}

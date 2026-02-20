import { Link } from 'react-router-dom';
import { Mic, Music } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-bg-dark/95 backdrop-blur-md border-b border-white/10 p-4">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-1 group">
                    <div className="flex items-center font-black tracking-tight text-white transition-colors">
                        <div className="relative inline-flex items-center justify-center mr-1 transform group-hover:-rotate-12 group-hover:scale-110 transition-all duration-300 z-10">
                            <span className="text-4xl text-primary-gold drop-shadow-lg">F</span>
                            <Mic className="absolute -top-3 -left-3 w-5 h-5 text-sky-400 animate-bounce group-hover:text-white drop-shadow-md" />
                        </div>
                        <span className="text-2xl mt-1">RAN</span>
                        <div className="relative inline-flex items-center justify-center ml-1 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 z-10">
                            <span className="text-4xl text-sky-300 drop-shadow-lg">R</span>
                            <Music className="absolute -bottom-2 -right-3 w-5 h-5 text-pink-500 animate-pulse group-hover:text-pink-300 drop-shadow-md" />
                        </div>
                        <span className="text-2xl mt-1 ml-1">EMO</span>
                        <span className="ml-3 text-2xl group-hover:scale-125 group-hover:-rotate-6 transition-transform duration-300 origin-bottom">🏆</span>
                    </div>
                </Link>
                <nav className="flex gap-4 items-center">
                    <Link to="/" className="text-sm font-semibold hover:text-primary-gold transition-colors">HOME</Link>
                    <Link to="/classifica" className="text-sm font-semibold hover:text-primary-gold transition-colors">CLASSIFICA</Link>
                </nav>
            </div>
        </header>
    );
}

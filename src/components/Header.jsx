```
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-bg-dark/95 backdrop-blur-md border-b border-white/10 p-4">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-black text-primary-gold flex items-center gap-1 tracking-tight">
                    <span className="text-3xl">F</span>RAN<span className="text-3xl">R</span>EMO
                    <span className="ml-2 text-xl">🏆</span>
                </Link>
                <nav className="flex gap-4 items-center">
                    <Link to="/" className="text-sm font-semibold hover:text-primary-gold transition-colors">HOME</Link>
                    <Link to="/classifica" className="text-sm font-semibold hover:text-primary-gold transition-colors">CLASSIFICA</Link>
                </nav>
            </div>
        </header>
    );
}
```

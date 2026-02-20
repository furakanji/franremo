import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            setError('Credenziali non valide. Sei sicuro di essere Fran?');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl">
                <h1 className="text-3xl font-black text-center text-primary-gold mb-8">Area Admin</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-bold text-white/60 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-gold"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-white/60 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-gold"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center font-bold">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-gold text-bg-dark font-black text-lg py-4 rounded-xl hover:bg-primary-gold-hover transition-colors mt-4 disabled:opacity-50"
                    >
                        {loading ? 'ACCESSO...' : 'ENTRA'}
                    </button>
                </form>
            </div>
        </div>
    );
}

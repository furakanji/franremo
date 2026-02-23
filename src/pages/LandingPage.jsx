import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    // Set to 20:30 today or tomorrow depending on the user's need.
    // For now, let's pick 20:30 of the CURRENT day.
    const [targetDate, setTargetDate] = useState(() => {
        const now = new Date();
        const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 30, 0);

        // If it's already past 20:30 today, maybe they mean tomorrow.
        // But let's just use today's 20:30.
        // If they want a specific date, they can change these values.
        return target;
    });

    const [timeLeft, setTimeLeft] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance <= 0) {
                clearInterval(interval);
                setTimeLeft(0);
                setIsOpen(true);
            } else {
                setTimeLeft(distance);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    // Format time
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'repeating-radial-gradient(circle at 0 0, transparent 0, #fbbf24 10px), repeating-linear-gradient(#fbbf2455, #fbbf24)' }}>
            </div>

            <div className="z-10 text-center w-full max-w-lg mx-auto flex flex-col items-center relative">

                <h1 className="text-4xl md:text-5xl font-black text-primary-gold mb-2 tracking-tighter uppercase">
                    FranRemo 2026
                </h1>
                <p className="text-white/60 mb-8 font-bold uppercase tracking-widest text-sm md:text-base">
                    La Prima Serata
                </p>

                {/* Retro TV Container */}
                <div className="w-full aspect-video bg-gray-800 p-3 md:p-5 rounded-3xl border-8 border-gray-700 shadow-2xl relative mb-8">
                    {/* TV Antenna/Details */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-4">
                        <div className="w-1 h-8 bg-gray-600 rotate-45 origin-bottom"></div>
                        <div className="w-1 h-8 bg-gray-600 -rotate-45 origin-bottom"></div>
                    </div>
                    {/* TV Screen */}
                    <div className="w-full h-full bg-black rounded-lg overflow-hidden border-4 border-gray-900 relative shadow-inner">
                        <iframe
                            className="w-full h-full absolute inset-0 scale-[1.02]"
                            src="https://www.youtube.com/embed/videoseries?list=PLCfn5VFZNxKzD1ieo2JSACEcC2Kd5QfVm&autoplay=1&mute=1&loop=1&controls=0&modestbranding=1"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                        {/* CRT Scanline Overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(translate(0,0),rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
                    </div>
                    {/* TV Dials */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4">
                        <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-gray-800 shadow-sm"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-gray-800 shadow-sm"></div>
                    </div>
                </div>

                {/* Countdown / Entry Button */}
                <div className="w-full bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-sm relative">
                    {isOpen ? (
                        <div className="transition-opacity duration-1000 ease-in opacity-100">
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-6">Ci Siamo! 💐</h2>
                            <button
                                onClick={() => navigate('/home')}
                                className="w-full bg-primary-gold text-bg-dark py-4 text-xl font-black rounded-full hover:scale-105 hover:shadow-lg hover:shadow-primary-gold/20 transition-all uppercase tracking-widest"
                            >
                                Entra in Platea
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Inizio Prima Serata in</div>
                            <div className="flex justify-center gap-4 md:gap-6 mb-8 text-white">
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl md:text-6xl font-black text-primary-gold">{hours.toString().padStart(2, '0')}</span>
                                    <span className="text-xs text-white/50 uppercase font-bold mt-1">Ore</span>
                                </div>
                                <span className="text-4xl md:text-6xl font-black text-white/20 pb-2">:</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl md:text-6xl font-black text-primary-gold">{minutes.toString().padStart(2, '0')}</span>
                                    <span className="text-xs text-white/50 uppercase font-bold mt-1">Min.</span>
                                </div>
                                <span className="text-4xl md:text-6xl font-black text-white/20 pb-2">:</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl md:text-6xl font-black text-primary-gold">{seconds.toString().padStart(2, '0')}</span>
                                    <span className="text-xs text-white/50 uppercase font-bold mt-1">Sec.</span>
                                </div>
                            </div>

                            <button className="w-full bg-white/5 border border-white/10 text-white/30 py-4 font-bold rounded-full cursor-not-allowed uppercase tracking-widest">
                                Porte Chiuse
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

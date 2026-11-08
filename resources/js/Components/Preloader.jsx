import { useState, useEffect } from 'react';

export default function Preloader({ onLoaded }) {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Durasi animasi menggambar garis sekitar 2.5 detik
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                onLoaded();
            }, 800); // Waktu transisi fade out yang halus
        }, 2500);

        return () => clearTimeout(timer);
    }, [onLoaded]);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-700 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="relative flex items-center justify-center w-64 h-64">
                {/* Teks ECHO di tengah */}
                <h1 className="absolute text-3xl font-bold tracking-[0.3em] text-white ml-2">
                    RKZ<span className="text-white">.</span>
                </h1>
                
                {/* SVG Garis Bergelombang Organik ala video */}
                <svg viewBox="0 0 200 200" className="absolute w-full h-full rotate-[-90deg]">
                    <style>
                        {`
                            .draw-line {
                                stroke-dasharray: 1000;
                                stroke-dashoffset: 1000;
                                animation: draw 2s ease-in-out forwards;
                            }
                            @keyframes draw {
                                to {
                                    stroke-dashoffset: 0;
                                }
                            }
                        `}
                    </style>
                    {/* Path melengkung tak beraturan */}
                    <path
                        className="draw-line"
                        d="M 100, 20 C 130, 15 160, 30 175, 60 C 190, 90 185, 130 160, 160 C 135, 185 90, 190 60, 175 C 30, 160 15, 120 20, 90 C 25, 60 50, 20 100, 20 Z"
                        fill="transparent"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        </div>
    );
}
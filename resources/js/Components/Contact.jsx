export default function Contact() {
    return (
        <section id="contact" className="w-full h-screen bg-[#0a0a0a] text-white flex flex-col justify-between py-10 overflow-hidden">
            
            {/* Bagian Kosong Atas */}
            <div className="px-4 sm:px-10"></div>

            {/* --- KONTEN UTAMA TENGAH (STEP-BY-STEP SLIDER) --- */}
            <div className="flex flex-col items-center justify-center w-full">
                
                {/* CSS Inline untuk Animasi Geser Berjeda (Word-by-word) */}
                <style>{`
                    /* 
                    Total Waktu Siklus: 7.5 detik (3 kata x 2.5 dtk)
                    - 2 detik diam (hold)
                    - 0.5 detik geser (slide)
                    
                    Perhitungan Persentase:
                    - 0% - 26.6%   : Kata 1 diam (2 detik)
                    - 33.3% - 60%  : Kata 2 diam (2 detik)
                    - 66.6% - 93.3%: Kata 3 diam (2 detik)
                    - 100%         : Kembali ke awal (0 detik)
                    */
                    @keyframes wordSlide {
                        0%, 26.66% { transform: translateX(0); }
                        33.33%, 60% { transform: translateX(-100%); }
                        66.66%, 93.33% { transform: translateX(-200%); }
                        100% { transform: translateX(-300%); }
                    }

                    .animate-word-slide {
                        display: flex;
                        width: 100%;
                        /* Menggunakan cubic-bezier agar geserannya melesat cepat namun berhenti dengan sangat empuk */
                        animation: wordSlide 7.5s cubic-bezier(0.83, 0, 0.17, 1) infinite;
                    }

                    .slide-item {
                        width: 100%;
                        flex-shrink: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                    }

                    .text-outline {
                        color: transparent;
                        -webkit-text-stroke: 2px #ffffff;
                    }
                    @media (min-width: 768px) {
                        .text-outline {
                            -webkit-text-stroke: 4px #ffffff;
                        }
                    }
                `}</style>

                {/* Wadah Teks Berjalan */}
                <div className="w-full relative overflow-hidden mb-12">
                    <div className="animate-word-slide cursor-default">
                        
                        {/* Kata 1 */}
                        <div className="slide-item">
                            <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter uppercase px-4">
                                LET'S TALK
                            </h1>
                        </div>

                        {/* Kata 2 */}
                        <div className="slide-item">
                            <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter uppercase px-4 text-outline">
                                START A PROJECT
                            </h1>
                        </div>

                        {/* Kata 3 */}
                        <div className="slide-item">
                            <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter uppercase px-4">
                                WORK TOGETHER
                            </h1>
                        </div>

                        {/* Kata 1 (Duplikat untuk ilusi putaran tak terbatas yang mulus) */}
                        <div className="slide-item">
                            <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter uppercase px-4">
                                LET'S TALK
                            </h1>
                        </div>

                    </div>
                </div>
                
                {/* Tombol Sosial Media */}
                <div className="flex flex-wrap justify-center gap-4 px-4">
                <div className="w-full max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center z-10 mb-6 md:mb-8 border-b border-white/20 pb-6 md:pb-8 gap-6 md:gap-0">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="text-xl md:text-2xl font-black tracking-tighter mb-1">M RIKZA WANGSA WIJAYA</div>
                        <div className="text-[10px] md:text-xs font-bold text-[#fbbf24] tracking-widest uppercase">Kab. Ciamis, Jawa Barat</div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[9px] md:text-[10px] font-bold tracking-widest uppercase">
                        <a href="https://www.instagram.com/mrwgswjy_?stkn=MTB2M28xajNhc2FzMw==" className="hover:text-[#fbbf24] transition-colors">INSTAGRAM</a>
                        <a href="https://github.com/sirikza" className="hover:text-[#fbbf24] transition-colors">GITHUB</a>
                        <a href="https://wa.me/6282319216241" className="hover:text-[#fbbf24] transition-colors">WHATSAPP</a>
                        <a href="https://www.linkedin.com/in/m-rikza-wangsa-wijaya-a771aa430?utm_source=share_via&utm_content=profile&utm_medium=member_android" className="hover:text-[#fbbf24] transition-colors">LINKEDIN</a>
                    </div>
                </div>
                    <a 
                        href="mailto:mrikza17@gmail.com" 
                        className="px-6 py-3 bg-white text-black border border-white rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-gray-200 hover:scale-105 transition-all duration-300"
                    >
                        Contact Me on Mail
                    </a>
                </div>
            </div>

            {/* Footer Bawah */}
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end text-[9px] font-mono tracking-widest text-gray-500 uppercase gap-4 px-4 sm:px-10">
                <p>© 2026 M. RIKZA. ALL RIGHTS RESERVED.</p>
                <p className="text-center sm:text-right">DEVELOPED BY M. RIKZA</p>
            </div>
            
        </section>
    );
}
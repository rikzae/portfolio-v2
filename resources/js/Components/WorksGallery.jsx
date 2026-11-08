import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Komponen 1 Kartu Proyek
function GalleryCard({ project, index, total, mode, activeIndex }) {
    const meshRef = useRef();
    
    // Fallback gambar jika kosong
    const imageUrl = project.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop';
    const texture = useTexture(imageUrl);

    // Mencegah warna pudar pada tekstur (Gamma Correction)
    useEffect(() => {
        if (texture) {
            texture.colorSpace = THREE.SRGBColorSpace;
        }
    }, [texture]);

    useFrame(() => {
        let targetPos = new THREE.Vector3();
        let targetRot = new THREE.Euler();

        if (mode === 'circle') {
            // MODE LINGKARAN (Menyebar seperti segi enam/lingkaran)
            const radius = 4.8;
            const angle = (index / total) * Math.PI * 2 - Math.PI / 2; // -PI/2 agar dimulai dari atas
            
            targetPos.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            
            // Putar kartu agar bagian bawahnya menghadap ke tengah lingkaran
            targetRot.set(0, 0, angle + Math.PI / 2); 
        } else {
            // MODE VERTIKAL (Menumpuk ke bawah seperti Drum)
            const offset = index - activeIndex;
            
            // Jarak Y = 3.8. Semakin jauh indeksnya, semakin didorong ke belakang (Z)
            targetPos.set(0, -offset * 3.8, -Math.abs(offset) * 2.5);
            
            // Rotasi sumbu X agar kartu miring sedikit memberi kesan memutar (Drum)
            targetRot.set(offset * 0.15, 0, 0); 
        }

        // Animasi transisi LERP - Kartu akan melayang mulus ke posisi targetnya
        meshRef.current.position.lerp(targetPos, 0.05);
        
        const targetQuat = new THREE.Quaternion().setFromEuler(targetRot);
        meshRef.current.quaternion.slerp(targetQuat, 0.05);
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[5.5, 3.2]} />
            <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
    );
}

// Hapus penerimaan prop `projects` agar tidak tercampur dengan data database
export default function WorksGallery() {
    const containerRef = useRef();
    const [mode, setMode] = useState('circle'); // 'circle' atau 'vertical'
    const [activeIndex, setActiveIndex] = useState(0);

    // Data di-hardcode secara eksklusif di sini
    const dataProjects = [
        { title: 'Polyphia Profile Web', image_url: '/images/pol.png' },
        { title: 'Gadis Manies 1995 Booking Web', image_url: '/images/gm95.png' },
        { title: 'Lita dan Kata (Canva)', image_url: '/images/l&k.png' },
        { title: 'Kobo Kanaeru Music (.dart)', image_url: '/images/kobo.png' },
        { title: 'Sistem Informasi Pembelajaran Interaktif (SIPI)', image_url: '/images/sipi.png' },
        { title: 'Sistem Informasi Near-Earth Objects (SINEO)', image_url: '/images/sineo.png' },
        { title: 'Kolam Ikan (Python)', image_url: '/images/kolam.png' },
        { title: 'Portofolio Web V1', image_url: '/images/webv1.png' },
        { title: 'Portofolio web V2', image_url: '/images/webv2.png' },
    ];

    // Logika Scroll khusus untuk mode vertikal
    useEffect(() => {
        const container = containerRef.current;
        let timeout;

        const handleWheel = (e) => {
            if (mode !== 'vertical') return;
            
            e.preventDefault(); // Mencegah halaman utama ikut terscroll

            if (timeout) return; // Jeda (throttle) agar tidak scroll terlalu cepat

            if (e.deltaY > 50 && activeIndex < dataProjects.length - 1) {
                setActiveIndex(prev => prev + 1);
                timeout = setTimeout(() => timeout = null, 500);
            } else if (e.deltaY < -50 && activeIndex > 0) {
                setActiveIndex(prev => prev - 1);
                timeout = setTimeout(() => timeout = null, 500);
            }
        };

        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (container) container.removeEventListener('wheel', handleWheel);
        };
    }, [mode, activeIndex, dataProjects.length]);

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-[#f8f9fa] overflow-hidden text-black font-sans">
            
            {/* Header Kiri Atas */}
            <div className="absolute top-10 left-10 z-10 pointer-events-none">
                <h2 className="text-3xl font-light tracking-widest text-gray-800 uppercase">
                FEATURED PROJECTS
                </h2>
            </div>

            {/* --- UI LINGKARAN TENGAH --- */}
            <div className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-700 ${mode === 'circle' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button 
                    onClick={() => setMode('vertical')}
                    className="text-2xl font-bold tracking-widest uppercase hover:scale-110 transition-transform duration-300"
                >
                    WORKS '25/26
                </button>
            </div>

            {/* --- UI KIRI: JUDUL AKTIF (Hanya di mode vertikal) --- */}
            <div className={`absolute left-20 top-1/2 -translate-y-1/2 z-10 transition-all duration-700 delay-300 ${mode === 'vertical' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
                <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-gray-800">
                    {dataProjects[activeIndex]?.title}
                </h3>
            </div>

            {/* --- UI KANAN: LIST PROYEK (Hanya di mode vertikal) --- */}
            <div className={`absolute right-20 top-1/2 -translate-y-1/2 z-10 text-right transition-all duration-700 delay-300 ${mode === 'vertical' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
                <ul className="space-y-2 text-xs font-mono tracking-widest uppercase">
                    {dataProjects.map((proj, i) => (
                        <li 
                            // Menggunakan kombinasi indeks dan judul agar key benar-benar unik
                            key={`list-${i}-${proj.title.replace(/\s+/g, '-')}`} 
                            onClick={() => setActiveIndex(i)}
                            className={`cursor-pointer transition-all duration-300 ${i === activeIndex ? 'text-black font-bold border-b border-black pb-1' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {proj.title}
                        </li>
                    ))}
                </ul>
            </div>

            {/* --- UI BAWAH: INSTRUKSI SCROLL --- */}
            <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-700 delay-500 flex flex-col items-center gap-4 ${mode === 'vertical' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <p className="text-xs font-mono tracking-widest text-gray-400 uppercase">
                    ↓ Scroll or Drag Drum To Cycle
                </p>
                <button 
                    onClick={() => setMode('circle')}
                    className="text-xs font-bold tracking-widest text-black hover:text-gray-500 uppercase transition-colors"
                >
                    ✕ Close
                </button>
            </div>

            {/* --- KANVAS 3D --- */}
            <div className="w-full h-full absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 11], fov: 45 }}>
                    <ambientLight intensity={1.5} />
                    <Suspense fallback={null}>
                        {dataProjects.map((proj, i) => (
                            <GalleryCard 
                                // Menggunakan kombinasi indeks dan judul agar key benar-benar unik
                                key={`card-${i}-${proj.title.replace(/\s+/g, '-')}`} 
                                project={proj} 
                                index={i} 
                                total={dataProjects.length} 
                                mode={mode} 
                                activeIndex={activeIndex} 
                            />
                        ))}
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
}
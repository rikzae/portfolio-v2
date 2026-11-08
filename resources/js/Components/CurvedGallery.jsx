import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';

// --- KONFIGURASI UKURAN ---
const CARD_WIDTH = 8.5;  // Lebar gambar
const CARD_HEIGHT = 4.8; // Tinggi gambar
const GAP = 1.2;         // Jarak antar gambar

// --- SHADER DENGAN LOGIKA "DEADZONE" (Tegap Lurus di Tengah) ---
// --- SHADER DENGAN LOGIKA "DEADZONE" (Tegap Lurus di Tengah) ---
const RibbonShader = {
    uniforms: {
        uTexture: { value: null },
        uUvScale: { value: new THREE.Vector2(1, 1) },
        uOpacity: { value: 1.0 },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            
            float dist = abs(worldPos.x);
            float bend = max(0.0, dist - 4.25);
            float direction = sign(worldPos.x);
            
            worldPos.y += direction * pow(bend, 2.0) * 0.15;
            worldPos.z -= pow(bend, 2.0) * 0.3;
            
            gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
    `,
    fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uUvScale;
        varying vec2 vUv;
        void main() {
            vec2 uv = (vUv - 0.5) * uUvScale + 0.5;
            vec4 texColor = texture2D(uTexture, uv);
            
            // PERBAIKAN: Mengaplikasikan Gamma Correction
            // Ini akan menghapus "filter pudar" dan mengembalikan warna gambar asli (sRGB)
            gl_FragColor = vec4(pow(texColor.rgb, vec3(1.0 / 2.2)), texColor.a);
        }
    `
};

function ProjectCard({ project, index, total }) {
    const groupRef = useRef();
    const t1 = useRef();
    const t2 = useRef();
    const t3 = useRef();
    
    // Fallback jika tidak ada gambar
    const imageUrl = project.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop';
    const texture = useTexture(imageUrl);

    // Hitung pemotongan gambar otomatis (Auto-Crop Widescreen)
    const uvScale = useMemo(() => {
        const imgAspect = texture.image.width / texture.image.height;
        const planeAspect = CARD_WIDTH / CARD_HEIGHT;
        let scaleX = 1, scaleY = 1;
        
        if (imgAspect > planeAspect) {
            scaleX = planeAspect / imgAspect;
        } else {
            scaleY = imgAspect / planeAspect;
        }
        return new THREE.Vector2(scaleX, scaleY);
    }, [texture]);

    const xPos = index * (CARD_WIDTH + GAP);

    const handleClick = () => {
        if (project.project_link) window.open(project.project_link, '_blank');
    };

    useFrame(() => {
        // Dapatkan posisi X absolut gambar di layar saat ini
        const worldX = groupRef.current.getWorldPosition(new THREE.Vector3()).x;
        
        // Logika Pudar Teks: Opasitas penuh (1) di tengah, pudar menghilang saat bergeser > 3 unit
        const opacity = Math.max(0, 1.0 - (Math.abs(worldX) / 3.0));
        
        if (t1.current) t1.current.fillOpacity = opacity;
        if (t2.current) t2.current.fillOpacity = opacity;
        if (t3.current) t3.current.fillOpacity = opacity;
    });

    return (
        <group position={[xPos, 0, 0]} ref={groupRef}>
            
            {/* --- KARTU GAMBAR --- */}
            <mesh onClick={handleClick} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
                {/* Segmen 64x64 agar hasil bengkokan Shader sangat mulus */}
                <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT, 64, 64]} />
                <shaderMaterial
                    vertexShader={RibbonShader.vertexShader}
                    fragmentShader={RibbonShader.fragmentShader}
                    uniforms={{
                        uTexture: { value: texture },
                        uUvScale: { value: uvScale }
                    }}
                    side={THREE.DoubleSide}
                    transparent={true}
                />
            </mesh>

            {/* --- KETERANGAN TEKS (Merespons Scroll) --- */}
            <group position={[0, -(CARD_HEIGHT / 2) - 0.4, 0]}>
                <Text ref={t1} fontSize={0.22} color="#1a1a1a" anchorY="top" fontWeight="bold">
                    {project.title}
                </Text>
                <Text ref={t2} position={[0, -0.35, 0]} fontSize={0.12} color="#666666" anchorY="top">
                    {project.description || 'Creative Agency & Brand Identity'}
                </Text>
                <Text ref={t3} position={[0, -0.6, 0]} fontSize={0.10} color="#a0a0a0" anchorY="top" letterSpacing={0.1}>
                    0{index + 1} / 0{total}
                </Text>
            </group>

        </group>
    );
}

function WavyRibbon({ projects }) {
    const groupRef = useRef();
    const scroll = useScroll();
    
    // Total pergeseran ke ujung
    const moveDistance = (projects.length - 1) * (CARD_WIDTH + GAP);

    useFrame(() => {
        const targetX = -scroll.offset * moveDistance;
        groupRef.current.position.x = THREE.MathUtils.lerp(
            groupRef.current.position.x,
            targetX,
            0.08
        );
    });

    return (
        <group ref={groupRef}>
            {projects.map((proj, i) => (
                <ProjectCard key={proj.id ? `proj-db-${proj.id}` : `proj-fallback-${i}-${proj.title}`} project={proj} index={i} total={projects.length} />
            ))}
        </group>
    );
}

export default function CurvedGallery({ projects }) {
    // KUNCI 2: Hapus array dummy. Gunakan data asli dari controller Laravel.
    // Pastikan fallback berupa array kosong [] agar React map() tidak error saat data terlambat dimuat.
    const dataProjects = projects || [];

    // Jika database kosong, tampilkan pesan elegan alih-alih layar blank atau dummy
    if (dataProjects.length === 0) {
        return (
            <div className="w-full h-[85vh] flex items-center justify-center bg-[#f8f9fa] text-gray-400 font-mono text-xs tracking-widest uppercase">
                NO DATA AVAILABLE IN DATABASE
            </div>
        );
    }

    return (
        <div className="w-full h-[85vh] relative cursor-grab active:cursor-grabbing bg-[#f8f9fa]">
            <Canvas camera={{ position: [0, 0, 8.5], fov: 45 }}>
                <Suspense fallback={null}>
                    {/* Halaman scroll disesuaikan otomatis berdasarkan jumlah data di database Anda */}
                    <ScrollControls pages={Math.max(1, dataProjects.length * 0.8)} damping={0.15} horizontal={false}>
                        <WavyRibbon projects={dataProjects} />
                    </ScrollControls>
                </Suspense>
            </Canvas>
        </div>
    );
}
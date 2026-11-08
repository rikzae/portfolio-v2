import { useState, useEffect, useRef } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import Preloader from '@/Components/Preloader';
import ProjectManager from '@/Components/ProjectManager';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CurvedGallery from '@/Components/CurvedGallery';
import WorksGallery from '@/Components/WorksGallery';
import Services from '@/Components/Services'; // <-- Impor ini
import Contact from '@/Components/Contact';   // <-- Impor ini

gsap.registerPlugin(ScrollTrigger);

export default function Index({ projects }) {
    // Ambil data autentikasi dari Inertia
    const { auth } = usePage().props;
    
    // Kembali gunakan autentikasi asli
    const isAdmin = auth.user !== null;

    // TAMBAHKAN STATE INI DI SINI
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Fungsi untuk menggulir halaman ke bagian tertentu dengan mulus
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const [isLoading, setIsLoading] = useState(true);
    const [showManager, setShowManager] = useState(false); // State untuk membuka modal admin
    
    // Refs untuk Hero
    const heroContainerRef = useRef(null);
    const heroTextRef = useRef(null);
    
    // Refs untuk About Section
    const aboutContainerRef = useRef(null);
    const aboutBoxRef = useRef(null);
    const spotlightRef = useRef(null);
    const aboutTextRef = useRef(null);

    // Refs untuk experience
    const experienceContainerRef = useRef(null);
    const experienceWrapperRef = useRef(null);
    // 1. Tambahkan state ini di bagian atas komponen Index Anda
    const [activeTab, setActiveTab] = useState('learning');

    // Tambahkan ref untuk bagian proyek
    const projectsContainerRef = useRef(null);
    const projectsTextTopRef = useRef(null);
    const projectsTextBottomRef = useRef(null);
    const galleryWrapperRef = useRef(null);

    useEffect(() => {
        if (isLoading) return;

        const ctx = gsap.context(() => {
            // 1. Animasi Hero (Menyusut saat di-scroll)
            gsap.to(heroTextRef.current, {
                scale: 0.4,
                opacity: 0,
                y: -100,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: heroContainerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                }
            });

            // 2. Animasi About Section
            // --- ANIMASI ABOUT SECTION ---
            const aboutTl = gsap.timeline({
                scrollTrigger: {
                    trigger: aboutContainerRef.current,
                    start: "top top", 
                    end: "+=1500", // Durasi scroll
                    scrub: 1,
                    pin: true,        
                }
            });

            // 1. Kata "ABOUT" melipir ke kiri (x: -100vw) dan perlahan memudar
            aboutTl.to(".text-about", {
                x: "-100vw", 
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut"
            }, "start");

            // 2. Kata "ME" melipir ke kanan (x: 100vw) dan perlahan memudar
            aboutTl.to(".text-me", {
                x: "100vw",
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut"
            }, "start");

            // 3. Kotak Hitam di belakang ikut membesar memenuhi layar
            aboutTl.to(".black-container", {
                width: "95vw",
                height: "85vh",
                borderRadius: "32px",
                duration: 1.5,
                ease: "power2.inOut",
                marginTop: "50"
            }, "start");

            // 4. Latar belakang Starry Night memudar
            aboutTl.to(".starry-bg", {
                opacity: 0,
                duration: 1,
                ease: "none"
            }, "start");

            // 5. Siluet orang & lampu sorot mulai muncul
            aboutTl.fromTo(".spotlight-content", 
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 1 },
                "-=0.5"
            );

            // 6. Elemen detail di bawah meluncur muncul
            aboutTl.fromTo(".about-details",
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1 },
                "-=0.5"
            );

            // --- ANIMASI EXPERIENCE SECTION (HORIZONTAL SCROLL & PARALLAX BACKGROUND) ---
            const sections = gsap.utils.toArray('.experience-panel');
            
            const expTl = gsap.timeline({
                scrollTrigger: {
                    trigger: experienceContainerRef.current,
                    pin: true,
                    scrub: 1,
                    // Mempercepat animasi: kita gunakan nilai jarak scroll yang lebih pendek
                    // Misalnya 1500px, atau sekitar 1.5x lebar layar (semakin kecil, semakin cepat gesernya)
                    end: "+=" + (window.innerWidth * 1.5) 
                }
            });

            // 1. Menggeser Panel Konten Utama ke Kiri
            expTl.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: "none",
            }, 0); // Angka 0 di akhir berarti animasi ini dimulai persis di awal timeline (waktu 0)

            // 2. Animasi Parallax Teks Latar Belakang (Acak Kiri & Kanan)
            // Teks yang bergerak ke kanan
            expTl.to(".bg-parallax-right-fast", { x: "40vw", ease: "none" }, 0);
            expTl.to(".bg-parallax-right-slow", { x: "15vw", ease: "none" }, 0);
            
            // Teks yang bergerak ke kiri
            expTl.to(".bg-parallax-left-fast", { x: "-50vw", ease: "none" }, 0);
            expTl.to(".bg-parallax-left-slow", { x: "-20vw", ease: "none" }, 0);

            // --- ANIMASI KEMUNCULAN BAGIAN PROJECT ---
            // 1. Animasi Teks "FEATURED PROJECT" (Meluncur dari bawah)
            gsap.fromTo(projectsTextTopRef.current,
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: projectsContainerRef.current,
                        start: "top 75%", // Mulai animasi saat bagian project menyentuh 75% dari atas layar
                    }
                }
            );

            // 2. Animasi Kanvas Galeri 3D (Fade-in dan Scale-up halus)
            gsap.fromTo(galleryWrapperRef.current,
                { y: 150, opacity: 0, scale: 0.9 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: projectsContainerRef.current,
                        start: "top 60%", // Muncul sedikit setelah teks judul bergerak
                    }
                }
            );

            // 3. Animasi Teks "LANDING PAGES" di sudut (Meluncur kemudian)
            gsap.fromTo(projectsTextBottomRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: projectsContainerRef.current,
                        start: "top 40%",
                    }
                }
            );
        });

        return () => ctx.revert();
    }, [isLoading]);

    return (
        <>
            <Head title="Portfolio | Creative Technologist" />

            {/* Preloader */}
            {isLoading && <Preloader onLoaded={() => setIsLoading(false)} />}

            {/* --- Tombol Melayang (Floating Button) KHUSUS ADMIN --- */}
            {isAdmin && (
                <div className="fixed bottom-6 right-6 z-40">
                    <button 
                        onClick={() => setShowManager(true)}
                        className="px-4 py-3 bg-black text-white border border-gray-700 shadow-2xl rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-gray-800 hover:scale-105 transition-all"
                    >
                        ⚙ Manage Projects
                    </button>
                </div>
            )}

            {/* --- Modal Admin --- */}
            {showManager && (
                <ProjectManager 
                    projects={projects} 
                    onClose={() => setShowManager(false)} 
                />
            )}

            {/* --- HERO SECTION --- */}
            <div id="home" ref={heroContainerRef} className="relative w-full h-screen bg-[#f3f3f3] text-black overflow-hidden flex flex-col selection:bg-black selection:text-white">
            {/* --- NAVBAR --- */}
                <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 sm:px-8 py-6 z-50 bg-[#f3f3f3]/80 backdrop-blur-md transition-all duration-300 border-b border-gray-200/50">
                    
                    {/* Logo */}
                    <div className="text-xl font-bold tracking-widest z-50 relative">
                        RKZ<span className="text-black">.</span>
                    </div>
                    
                    {/* Menu Desktop (Sembunyi di Mobile) */}
                    <div className="hidden md:flex space-x-8 text-[11px] font-semibold text-gray-500 tracking-widest uppercase">
                        <span onClick={() => scrollToSection('home')} className="text-black bg-gray-200/50 px-4 py-1 rounded-full cursor-pointer hover:bg-gray-300 transition-colors">HOME</span>
                        <span onClick={() => scrollToSection('about')} className="hover:text-black cursor-pointer py-1 transition-colors">ABOUT ME</span>
                        <span onClick={() => scrollToSection('experience')} className="hover:text-black cursor-pointer py-1 transition-colors">EXPERIENCE</span>
                        <span onClick={() => scrollToSection('projects')} className="hover:text-black cursor-pointer py-1 transition-colors">PROJECTS</span>
                        <span onClick={() => scrollToSection('expertise')} className="hover:text-black cursor-pointer py-1 transition-colors">EXPERTISE</span>
                    </div>

                    {/* Tombol Kanan (Admin / Logout & Hamburger) */}
                    <div className="flex items-center space-x-6 text-gray-600 z-50 relative">
                        {isAdmin ? (
                            <Link href="/logout" method="post" as="button" className="text-[10px] font-bold tracking-widest uppercase hover:text-black transition-colors hidden sm:block">
                                LOGOUT
                            </Link>
                        ) : (
                            <a href="/login" className="text-[10px] font-bold tracking-widest uppercase hover:text-black transition-colors hidden sm:block">
                                ADMIN
                            </a>
                        )}

                        {/* Ikon Hamburger (Hanya tampil di Mobile) */}
                        <button 
                            className="md:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1.5 focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className={`block w-6 h-0.5 bg-black transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                            <span className={`block w-6 h-0.5 bg-black transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                            <span className={`block w-6 h-0.5 bg-black transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                        </button>
                    </div>
                </nav>

                {/* --- MENU MOBILE OVERLAY (Layar Penuh) --- */}
                <div 
                    className={`fixed inset-0 bg-[#f3f3f3] z-40 flex flex-col items-center justify-center space-y-8 transform transition-all duration-500 ease-in-out md:hidden ${
                        isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
                    }`}
                >
                    <span onClick={() => { scrollToSection('home'); setIsMobileMenuOpen(false); }} className="text-2xl font-black tracking-widest uppercase cursor-pointer hover:text-gray-500">HOME</span>
                    <span onClick={() => { scrollToSection('about'); setIsMobileMenuOpen(false); }} className="text-2xl font-black tracking-widest uppercase cursor-pointer hover:text-gray-500">ABOUT ME</span>
                    <span onClick={() => { scrollToSection('experience'); setIsMobileMenuOpen(false); }} className="text-2xl font-black tracking-widest uppercase cursor-pointer hover:text-gray-500">EXPERIENCE</span>
                    <span onClick={() => { scrollToSection('projects'); setIsMobileMenuOpen(false); }} className="text-2xl font-black tracking-widest uppercase cursor-pointer hover:text-gray-500">PROJECTS</span>
                    <span onClick={() => { scrollToSection('expertise'); setIsMobileMenuOpen(false); }} className="text-2xl font-black tracking-widest uppercase cursor-pointer hover:text-gray-500">EXPERTISE</span>
                    
                    {/* Tombol Admin/Logout khusus di menu mobile */}
                    <div className="pt-8 mt-8 border-t border-gray-300 w-1/2 text-center">
                        {isAdmin ? (
                            <Link href="/logout" method="post" as="button" className="text-sm font-bold tracking-widest uppercase text-gray-500 hover:text-black">LOGOUT</Link>
                        ) : (
                            <a href="/login" className="text-sm font-bold tracking-widest uppercase text-gray-500 hover:text-black">ADMIN LOGIN</a>
                        )}
                    </div>
                </div>

                {/* --- GAMBAR SILUET (z-10, Ukuran Diperbesar) --- */}
                {/* max-w ditingkatkan dari 480px menjadi 750px untuk layar besar */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[450px] sm:max-w-[600px] md:max-w-[650px] flex items-end justify-center pointer-events-none z-10">
                    <img 
                        src="/images/siluet (2).png" 
                        alt="Silhouette" 
                        className="w-full h-auto object-contain object-bottom drop-shadow-2xl"
                    />
                </div>

                {/* --- TEKS HERO (z-20, Efek Blend Mode) --- */}
                {/* Tambahkan 'mix-blend-difference' pada pembungkusnya */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 mix-blend-difference">
                    {/* Ubah warna teks menjadi 'text-white' agar blend-mode bekerja optimal */}
                    <h1 ref={heroTextRef} className="text-[12vw] leading-[0.85] font-black tracking-tighter text-center uppercase origin-center text-white">
                        EXPLORE MY <br /> PORTFOLIO
                    </h1>
                </div>

                <div className="absolute bottom-10 left-10 z-30 hidden md:flex flex-col items-start text-[11px] font-semibold tracking-widest text-gray-600">
                    <p>SINCE 2026</p>
                    {/* Pasang onClick untuk panah ke bawah agar menggulir ke seksi About */}
                    <div 
                        onClick={() => scrollToSection('about')} 
                        className="mt-4 w-10 h-10 border border-gray-400 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                        ↓
                    </div>
                </div>

                <div className="absolute bottom-10 right-10 z-30 hidden md:flex flex-col items-end text-right">
                    <p className="text-[11px] font-semibold tracking-widest text-gray-500 max-w-[200px] mb-6">
                        RESEARCH <br /> ACADEMIC <br /> FRESH GRADUATE
                    </p>
                    <div className="flex flex-col items-end space-y-1 text-[10px] font-bold tracking-widest text-gray-400">
                        <span className="hover:text-black cursor-pointer">UI/UX</span>
                        <span className="hover:text-black cursor-pointer">WEB DESIGN</span>
                        <span className="hover:text-black cursor-pointer">WEB DEVELOPER</span>
                    </div>
                </div>
            </div>
            
            {/* --- ABOUT SECTION (Dipin oleh GSAP) --- */}
            <div id="about" ref={aboutContainerRef} className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
                
                {/* 1. LAYER BAWAH: Latar Belakang Starry Night */}
                <div className="starry-bg absolute inset-0 z-0">
                    <img src="/images/theStaryNight.png" alt="Starry Background" className="w-full h-full object-fill opacity-60" />
                </div>

                {/* 2. LAYER TENGAH: Kotak Hitam (Berada di belakang teks) */}
                <div className="black-container absolute z-10 w-[280px] h-[350px] md:w-[350px] md:h-[450px] bg-[#050505] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.9)] flex items-center justify-center border border-white/10">
                    
                    {/* Pendaran cahaya (glow) di dalam kotak */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        <div className="w-[150px] h-[150px] bg-white opacity-20 blur-[45px] rounded-full"></div>
                    </div>

                    {/* Konten Tersembunyi (Siluet & Lampu Sorot) */}
                    <div className="spotlight-content absolute inset-0 z-10 flex flex-col items-center justify-center opacity-0">
                        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[200%] h-[150%] bg-[conic-gradient(at_top_center,transparent_150deg,rgba(255,255,255,0.9)_180deg,transparent_210deg)] origin-top blur-xl opacity-80 pointer-events-none"></div>
                        <img src="/images/siluet (2).png" alt="Silhouette" className="relative filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                        <div className="absolute top-8 right-10 md:top-12 md:right-16 text-[9px] md:text-[10px] text-white font-bold tracking-widest uppercase">
                            BASED IN INDONESIA • BEST GRADUATE OF STUDY PROGRAM FROM GALUH UNIVERSITY • 2026
                        </div>
                    </div>

                    {/* Teks & Tombol Detail (Masuk ke dalam kotak agar ter-masking rapi) */}
                    <div className="about-details absolute inset-0 z-30 pointer-events-none flex flex-col justify-between px-8 py-10 md:px-16 md:py-16 opacity-0">
                        <h3 className="text-white text-xl md:text-3xl font-bold max-w-xl uppercase tracking-tighter mt-4">
                            TURNING VISIONARY IDEAS INTO FAST, DISTINCTIVE DIGITAL EXPERIENCES
                        </h3>
                        <div className="w-full flex flex-col md:flex-row justify-between items-end border-t border-white/20 pt-6">
                            <div className="max-w-2xl">
                                <h4 className="text-[10px] text-gray-400 font-mono tracking-widest mb-3 uppercase">
                                    DISCIPLINE & CRAFT &mdash; UI/UX • WEB DESIGN • PHP • LARAVEL • REACT
                                </h4>
                                <p className="text-gray-300 text-xs md:text-sm font-medium leading-relaxed uppercase">
                                    I SPECIALIZE IN BUILDING BESPOKE DIGITAL PRODUCTS WHERE PURPOSEFUL EDITORIAL DESIGN MEETS ROBUST ENGINEERING. CREATING EXPERIENCES WITH INTENTIONAL MOTION, SYSTEMATIC RIGOR, AND MEASURABLE IMPACT.
                                </p>
                            </div>
                            <div className="flex space-x-4 mt-6 md:mt-0 pointer-events-auto">
    
                                {/* Mengarah ke bagian id="contact" (Let's Talk) */}
                                <button 
                                    onClick={() => scrollToSection('contact')}
                                    className="px-6 py-2 border border-white text-white text-[10px] font-bold tracking-widest rounded-full hover:bg-white hover:text-black transition-colors"
                                >
                                    GET IN TOUCH ↗
                                </button>
                                
                                {/* Mengarah ke bagian id="expertise" (Services / Accordion) */}
                                <button 
                                    onClick={() => scrollToSection('expertise')}
                                    className="px-6 py-2 border border-white text-white text-[10px] font-bold tracking-widest rounded-full hover:bg-white hover:text-black transition-colors"
                                >
                                    SERVICES
                                </button>
                                
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. LAYER ATAS: Teks "ABOUT ME" (Teks dipisah untuk animasi split) */}
                <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none w-full h-full overflow-hidden">
                    <h2 className="text-about text-[5.5rem] md:text-[8rem] font-black text-white leading-[0.85] tracking-tighter">
                        ABOUT
                    </h2>
                    <h2 className="text-me text-[5.5rem] md:text-[8rem] font-black text-white leading-[0.85] tracking-tighter ml-[10%]">
                        ME
                    </h2>
                </div>
            </div>

            {/* --- EXPERIENCE SECTION (Horizontal Scroll) --- */}
            <div id="experience" ref={experienceContainerRef} className="relative w-full h-screen bg-[#050505] text-white overflow-hidden flex items-center">
                
                {/* --- BACKGROUND WATERMARK TEXTS (PARALLAX LAYER) --- */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.03]">
                    {/* Ukuran divariasikan dan posisi disebar agar layar tidak penuh */}
                    
                    {/* Teks Atas - Ukuran Sedang */}
                    <h2 className="bg-parallax-left-fast absolute top-[10%] right-[-5%] text-[12vw] font-black whitespace-nowrap">
                        CREATIVE TECHNOLOGIST
                    </h2>
                    
                    {/* Teks Tengah Atas - Ukuran Kecil */}
                    <h2 className="bg-parallax-right-slow absolute top-[35%] left-[5%] text-[6vw] font-black whitespace-nowrap">
                        2022 &mdash; 2026
                    </h2>
                    
                    {/* Teks Tengah Bawah - Ukuran Paling Besar */}
                    <h2 className="bg-parallax-left-slow absolute top-[55%] right-[-15%] text-[15vw] font-black whitespace-nowrap">
                        SELF-DIRECTED
                    </h2>
                    
                    {/* Teks Bawah - Ukuran Sedang */}
                    <h2 className="bg-parallax-right-fast absolute bottom-[15%] left-[-10%] text-[9vw] font-black whitespace-nowrap">
                        FORNT END WEB DEVELOPER
                    </h2>
                    
                    {/* Teks Ekstra di Sudut - Ukuran Paling Kecil */}
                    <h2 className="bg-parallax-left-fast absolute bottom-[5%] right-[10%] text-[5vw] font-black whitespace-nowrap">
                        PRESENT
                    </h2>
                </div>

                {/* Garis batas atas (Top border with text) */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-center border-b border-gray-800 pb-4 z-30">
                    <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">ORIGIN & FOUNDATIONS</span>
                    <div className="w-16 h-[1px] bg-gray-500"></div>
                </div>

                {/* Kontainer Lebar yang akan digeser (Wrapper) */}
                <div ref={experienceWrapperRef} className="relative z-10 flex h-full w-[300vw]"> 
                    
                    {/* PANEL 1: Judul Utama (Where I've Been) */}
                    <div className="experience-panel w-screen h-full flex flex-col justify-center px-10 md:px-20 relative">
                        <div className="relative max-w-xl">
                            <div className="inline-block border border-gray-600 rounded-full px-4 py-1 mb-6 text-[10px] tracking-widest text-gray-300">
                                FOUNDATION & JOURNEY
                            </div>
                            <h2 className="text-6xl md:text-[8rem] font-black leading-[0.85] tracking-tighter mb-8 text-white drop-shadow-lg">
                                WHERE<br/>I'VE BEEN
                            </h2>
                            <p className="text-sm md:text-base font-medium text-gray-300">
                                My professional journey through different roles and environments.
                            </p>
                        </div>
                    </div>

                    {/* PANEL 2: Creative Technologist (Self-Directed Learning) */}
                    <div className="experience-panel w-screen h-full flex flex-col justify-center px-10 md:px-20 relative">
                        <div className="relative w-full">
                            <div className="flex items-center space-x-4 mb-6">
                                <span className="text-sm font-bold text-gray-400">2022 &mdash; 2026</span>
                                <span className="text-[10px] tracking-widest border-b border-gray-600 pb-1">SELF-DIRECTED LEARNING</span>
                            </div>
                            
                            <h2 className="text-5xl md:text-[7.5rem] font-black leading-[0.9] tracking-tighter mb-6 relative">
                                <span className="absolute -left-1 opacity-40 blur-[3px]">CREATIVE<br/>TECHNOLOGIST</span>
                                <span className="relative text-white drop-shadow-xl">CREATIVE<br/>TECHNOLOGIST</span>
                            </h2>
                            
                            <p className="text-sm md:text-lg text-gray-400 font-medium max-w-2xl">
                                Intensive self-education period exploring web technologies, coding, and modern development practices.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-800">
                                <div>
                                    <h4 className="text-[10px] text-gray-500 font-mono mb-2 uppercase tracking-widest">MILESTONE 01</h4>
                                    <p className="text-xs font-bold text-gray-300">Actively involved as a Research Team Member for the 2025 BIMA (Research and Community Service Management Information System) program under the Ministry of Education, Culture, Research, and Technology.</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] text-gray-500 font-mono mb-2 uppercase tracking-widest">MILESTONE 02</h4>
                                    <p className="text-xs font-bold text-gray-300">Served as a Teaching Assistant for the practical component of a course. Experienced in team collaboration and handling multiple tasks simultaneously.</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] text-gray-500 font-mono mb-2 uppercase tracking-widest">MILESTONE 03</h4>
                                    <p className="text-xs font-bold text-gray-300">Building a portfolio that includes projects such as an interactive learning information system, a monitoring and prediction information system for near-Earth objects, and various web profile templates for individuals, groups, or companies.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PANEL 3: Full Stack Developer (Freelance/Independent) */}
                    <div className="experience-panel w-screen h-full flex flex-col justify-center px-10 md:px-20 relative">
                        <div className="relative w-full">
                            <div className="flex items-center space-x-4 mb-6">
                                <span className="text-sm font-bold text-gray-400">2026 &mdash; PRESENT</span>
                                <span className="text-[10px] tracking-widest text-gray-400">FREELANCE / INDEPENDENT</span>
                                <span className="text-[9px] border border-gray-600 rounded-full px-2 py-1">COMMERCIAL</span>
                            </div>
                            
                            <h2 className="text-5xl md:text-[7.5rem] font-black leading-[0.9] tracking-tighter mb-6 relative">
                                <span className="absolute -left-1 opacity-40 blur-[3px]">FRONT END<br/>WEB DEVELOPER</span>
                                <span className="relative text-white drop-shadow-xl">FRONT END<br/> WEB DEVELOPER</span>
                            </h2>
                            
                            <p className="text-sm md:text-lg text-gray-400 font-medium max-w-2xl">
                                Building premium web experiences for clients worldwide. Specializing in interactive frontends, scalable backends, and AI-powered.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-800">
                                <div>
                                    <h4 className="text-[10px] text-gray-500 font-mono mb-2 uppercase tracking-widest">DELIVERY</h4>
                                    <p className="text-xs font-bold text-gray-300">Delivered 5+ projects across diverse clients</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] text-gray-500 font-mono mb-2 uppercase tracking-widest">INFRASTRUCTURE</h4>
                                    <p className="text-xs font-bold text-gray-300">Implemented scrum development and recurrent neural network architecture</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] text-gray-500 font-mono mb-2 uppercase tracking-widest">MOTION SYSTEM</h4>
                                    <p className="text-xs font-bold text-gray-300">Created custom animation systems with GSAP and Three.js</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="absolute bottom-8 left-8 z-30 flex space-x-2 pointer-events-auto">
                    <button 
                        onClick={() => setActiveTab('learning')}
                        className={`px-6 py-2 text-[10px] font-bold tracking-widest rounded-md uppercase transition-colors ${
                            activeTab === 'learning' 
                            ? 'bg-gray-800 border border-gray-600 text-white' 
                            : 'bg-transparent text-gray-500 hover:text-white'
                        }`}
                    >
                        LEARNING
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('freelance')}
                        className={`px-6 py-2 text-[10px] font-bold tracking-widest rounded-md uppercase transition-colors ${
                            activeTab === 'freelance' 
                            ? 'bg-gray-800 border border-gray-600 text-white' 
                            : 'bg-transparent text-gray-500 hover:text-white'
                        }`}
                    >
                        FREELANCE
                    </button>
                </div>
            </div>

            {/* --- SEKSI PROYEK TERPILIH (FEATURED PROJECTS / LANDING PAGES) --- */}
            {/* Tambahkan projectsContainerRef di sini */}
            <div id="projects" ref={projectsContainerRef} className="relative w-full h-screen bg-[#f8f9fa] text-black overflow-hidden flex flex-col justify-center">
                
                <div className="absolute top-10 left-10 z-10 pointer-events-none overflow-hidden">
                    {/* Tambahkan projectsTextTopRef di sini */}
                    <h2 ref={projectsTextTopRef} className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-800">
                        LANDING PAGE
                    </h2>
                </div>

                {/* Tambahkan galleryWrapperRef pada wadah Canvas */}
                <div ref={galleryWrapperRef} className="w-full h-full mt-10">
                    <CurvedGallery projects={projects} />
                </div>
                
            </div>

            {/* --- WORKS SECTION (CIRCLE TO VERTICAL DRUM) --- */}
            <WorksGallery projects={projects} />
            
            {/* --- SERVICES SECTION (ACCORDION) --- */}
            <div id="expertise">
                <Services />
            </div>

            {/* --- CONTACT / FOOTER SECTION --- */}
            <Contact />
        </>
    );
}
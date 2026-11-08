import { useState } from 'react';

export default function Services() {
    // State untuk melacak akordeon mana yang sedang terbuka (default: 2 / indeks ke-2)
    const [openIndex, setOpenIndex] = useState(2);

    const servicesData = [
        {
            title: "UI/UX",
            description: "Crafting intuitive and engaging user interfaces with a focus on seamless user experiences. We conduct deep research to understand your audience and design wireframes and prototypes that convert.",
            deliverables: "USER RESEARCH, WIREFRAMING, PROTOTYPING, FIGMA, ADOBE XD, CANVA"
        },
        {
            title: "WEB DESIGN",
            description: "Designing aesthetically pleasing and highly functional websites that align with your brand identity. Every pixel is placed with purpose to ensure visual harmony and usability across all devices.",
            deliverables: "VISUAL IDENTITY, RESPONSIVE DESIGN, DESIGN SYSTEMS, LARAVEL, REACT"
        },
        {
            title: "EXPERTISE AND ABILITIES",
            description: "Possesses expertise across various fields and a good personality. Eager to develop a career in their chosen field, a quick learner, and capable of working under pressure.",
            deliverables: "DATA ENTRY, MICROSOFT OFFICE, GOOGLE WORKSPACE, ADOBE PHOTOSHOP, TIME MANAGEMENT, COMMUNICATION, PROBLEM SOLVING, TEAMWORK, ADAPTABILITY, CREATIVITY, CRITICAL THINKING, ATTENTION TO DETAIL, PROJECT MANAGEMENT, ANALYTICAL SKILLS, RELIGUOUS, DISCIPLINED, FAST LEARNER, SELF-MOTIVATED, INDEPENDENT, COLLABORATIVE, FLEXIBLE, MULTITASKING"
        }
    ];

    return (
        <section className="w-full min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center py-24 px-4 sm:px-10 font-sans text-black">
            
            {/* Header Services */}
            <div className="text-center mb-16 max-w-3xl">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">
                    The Skills We Posses
                </h2>
                <p className="text-xs text-gray-400 tracking-[0.2em] uppercase leading-relaxed">
                    Creating visually appealing and functional websites tailored to the client's needs and goals. 
                    Providing a consistent user experience across platforms.
                    Possessing expertise in a wide range of areas.
                </p>
            </div>

            {/* Accordion List */}
            <div className="w-full max-w-4xl space-y-4">
                {servicesData.map((service, index) => {
                    const isOpen = openIndex === index;

                    return (
                        <div 
                            key={index}
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className={`cursor-pointer overflow-hidden transition-all duration-500 ease-in-out border ${
                                isOpen 
                                ? 'bg-[#0f0f0f] text-white border-transparent rounded-[2rem]' // Tampilan saat terbuka (Hitam)
                                : 'bg-transparent text-gray-500 border-gray-300 hover:border-gray-500 rounded-full' // Tampilan saat tertutup (Garis luar)
                            }`}
                        >
                            {/* Bagian Header Pil (Selalu Terlihat) */}
                            <div className="flex items-center justify-between px-8 py-5">
                                <span className={`text-xs font-mono ${isOpen ? 'text-white' : 'text-gray-400'}`}>
                                    {index + 1}
                                </span>
                                <h3 className={`text-sm font-bold tracking-widest uppercase ${isOpen ? 'text-white' : 'text-black'}`}>
                                    {service.title}
                                </h3>
                                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </span>
                            </div>

                            {/* Bagian Konten (Terbuka/Tertutup) */}
                            <div 
                                className={`transition-all duration-500 ease-in-out px-8 ${
                                    isOpen ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 pb-0 opacity-0'
                                }`}
                            >
                                <p className="text-sm text-gray-300 mb-8 max-w-3xl leading-relaxed">
                                    {service.description}
                                </p>
                                
                                <div className="flex justify-between items-end">
                                    <div className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                                        <span className="text-gray-600 mr-2">DELIVERABLES:</span> 
                                        {service.deliverables}
                                    </div>
                                    <a href="#contact" className="text-xs font-bold tracking-widest uppercase hover:text-gray-400 transition-colors">
                                        INQUIRE /
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
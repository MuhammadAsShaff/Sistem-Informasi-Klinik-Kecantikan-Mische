import React from 'react';
import TeamMische from '@/assets/images/TeamMische.png';
import Logo_Mische from '@/assets/images/Logo_Mische.png';

/**
 * =========================================================================
 * SPANDUK SAMBUTAN GERBANG UTAMA MURNI (HeroSection)
 * =========================================================================
 * Ibarat panggung ucapan selamat datang megah berwarna hijau asri yang
 * mengibarkan semboyan "The First Acne Expert In Town" dengan potret ramah
 * seluruh tim dokter di sisinya.
 */
const HeroSection = () => {
    return (
        // Beranda panggung utama berselimut permadani gradasi hijau asri yang menyegarkan mata tamu
        <div className="w-full bg-gradient-to-r from-[#56bc36] from-[30%] to-[#C6FFD1] relative overflow-hidden">
            
            {/* --- ORNAMEN BAYANGAN LOGO (Background Watermark) --- */}
            {/* Pantulan ukiran lambang Mische raksasa di latar belakang sisi kanan panggung */}
            <img 
                src={Logo_Mische} 
                alt="Background Watermark" 
                className="absolute top-1/2 right-0 -translate-y-1/2 h-[75%] md:h-full w-auto max-w-none pointer-events-none z-0 opacity-65"
            />

            {/* ========================================================================= */}
            {/* 1. SERAMBI LAYAR LEBAR (DESKTOP VERSION)                                  */}
            {/* Tampilan megah tak terhingga bagi tamu yang menengok dari layar besar     */}
            {/* ========================================================================= */}
            <div className="hidden md:flex container mx-auto px-10 flex-row items-center justify-between relative z-10 gap-10 py-24">
                
                {/* Meja Sisi Kiri: Memajang foto seluruh barisan dokter Mische yang tersenyum ramah */}
                <div className="w-1/2 flex justify-start">
                    <img 
                        src={TeamMische} 
                        alt="Dokter Mische" 
                        className="w-full max-w-[600px] h-auto object-cover rounded-3xl shadow-l"
                    />
                </div>
                
                {/* Meja Sisi Kanan: Plakat ucapan penyambutan dengan tulisan putih menyala */}
                <div className="w-1/2 flex flex-col justify-center text-white relative py-10 text-left items-start">
                    <div className="relative z-10 w-full">
                        {/* Tulisan pembuka yang menyapa tamu dengan hangat */}
                        <h2 className="text-6xl lg:text-7xl font-bold mb-2 text-left">Selamat Datang</h2>
                        {/* Semboyan kebanggaan klinik sebagai pakar jerawat terdepan di kota */}
                        <h1 className="text-2xl lg:text-3xl font-extrabold leading-tight text-left mt-2">
                            # THE FIRST ACNE EXPERT IN TOWN
                        </h1>
                    </div>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* 2. SERAMBI LAYAR GENGGAM (MOBILE VERSION)                                 */}
            {/* Tampilan lipat padat yang rapi untuk tamu yang berkunjung via handphone   */}
            {/* ========================================================================= */}
            <div className="flex md:hidden container mx-auto px-4 flex-row items-center justify-between relative z-10 gap-3 py-12">
                
                {/* Potret barisan dokter di layar HP (menyesuaikan ukuran genggam) */}
                <div className="w-[50%] flex justify-start">
                    <img 
                        src={TeamMische} 
                        alt="Dokter Mische" 
                        className="w-[115%] scale-100 h-auto object-cover rounded-2xl shadow-md"
                    />
                </div>
                
                {/* Sapaan dan semboyan kebanggaan klinik dengan ukuran huruf yang pas di handphone */}
                <div className="w-[55%] flex flex-col justify-center text-white relative py-4 text-left items-start">
                    <div className="relative z-10 w-full pl-2">
                        <h2 className="text-[15px] sm:text-3xl font-bold mb-1 text-left">Selamat Datang</h2>
                        <h1 className="text-[10px] sm:text-sm font-extrabold leading-tight text-left">
                            # THE FIRST ACNE EXPERT IN TOWN
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;

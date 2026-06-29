import React from 'react';

/**
 * =========================================================================
 * SPANDUK BERKIBAR BALAI PROFIL (ProfileBanner)
 * =========================================================================
 * Ibarat spanduk sutra hijau bermotif siluet asri di dinding lobi profil yang
 * menyambut tamu dan mengingatkan pentingnya menjaga keakuratan informasi akun.
 */
const ProfileBanner = () => {
    return (
        <div className="w-full bg-gradient-to-r from-[#74b35e] to-[#a3e69a] rounded-3xl p-8 relative overflow-hidden shadow-md flex flex-col justify-center min-h-[160px]">
            {/* Background Decoration (Matching the image's silhouette inspired design) */}
            <div className="absolute right-[-20px] top-[-20px] h-[120%] w-[35%] opacity-20 pointer-events-none">
                 <svg viewBox="0 0 200 200" fill="white" className="h-full w-full object-cover">
                    <path d="M100,20 C120,20 140,40 140,80 C140,120 120,160 100,160 C80,160 60,120 60,80 C60,40 80,20 100,20" />
                </svg>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 relative z-10">Profil Saya</h1>
            <p className="text-white/90 text-sm md:text-base max-w-xl font-medium relative z-10">
                Kelola Informasi Profil Anda Untuk Mengontrol, Melindungi Dan Mengamankan Akun
            </p>
        </div>
    );
};

export default ProfileBanner;

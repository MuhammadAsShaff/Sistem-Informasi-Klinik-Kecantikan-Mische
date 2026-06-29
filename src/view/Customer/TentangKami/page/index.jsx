import React from 'react';
// Mengimpor teras penyambutan dengan sapaan hangat dan potret tim dokter
import HeroSection from './HeroSection';
// Mengimpor balai prasasti tempat memajang sejarah klinik, visi, misi, dan jam operasional
import AboutInfoSection from './AboutInfoSection';
// Mengimpor ruang bioskop mini tempat memutar album foto kegiatan harian klinik
import GallerySection from './GallerySection';

/**
 * =========================================================================
 * GEDUNG PAVILIUN TENTANG KAMI (TentangKamiPage)
 * =========================================================================
 * Ibarat kompleks gedung induk yang merangkum seluruh cerita klinik. Mulai dari
 * teras sambutan (HeroSection), ruang prasasti sejarah (AboutInfoSection),
 * hingga bioskop kegiatan harian (GallerySection).
 */
export default function TentangKamiPage() {
    return (
        // Membungkus ketiga bangunan pameran menjadi satu jalur rute tur yang indah dari atas ke bawah
        <div className="w-full flex flex-col font-sans">
            {/* 1. Teras Gerbang Depan: Menyambut tamu dengan tulisan Selamat Datang & Foto Dokter */}
            <HeroSection />
            {/* 2. Ruang Tengah Prasasti: Menyuguhkan cerita sejarah, visi, misi, dan maket gedung */}
            <AboutInfoSection />
            {/* 3. Bioskop Ujung Lorong: Menayangkan sorotan album foto harian Mische */}
            <GallerySection />
        </div>
    );
}

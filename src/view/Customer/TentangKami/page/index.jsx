import React from 'react';
import HeroSection from './HeroSection';
import AboutInfoSection from './AboutInfoSection';
import GallerySection from './GallerySection';

export default function TentangKamiPage() {
    return (
        <div className="w-full flex flex-col font-sans">
            <HeroSection />
            <AboutInfoSection />
            <GallerySection />
        </div>
    );
}

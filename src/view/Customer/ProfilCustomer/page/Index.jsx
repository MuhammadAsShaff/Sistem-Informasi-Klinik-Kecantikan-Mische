import React from 'react';
import ProfileBanner from './ProfileBanner';
import HistoryTabs from './HistoryTabs';
import ProfileForm from './ProfileForm';

/**
 * =========================================================================
 * BALAI PAVILIUN MEJA KELOLA PROFIL (ProfilCustomerPage)
 * =========================================================================
 * Ibarat balai paviliun luas tempat tamu mengatur identitasnya. Di bagian atas
 * terbentang spanduk ucapan selamat datang (ProfileBanner), diikuti gapura arsip (HistoryTabs),
 * dan di tengah terdapat meja utama pengisian data (ProfileForm).
 */
export default function ProfilCustomerPage() {
    return (
        <div className="w-full min-h-screen bg-[#FAF8F5] py-8 md:py-12 px-4 md:px-10">
            <div className="max-w-6xl mx-auto flex flex-col gap-8 md:gap-10">
                {/* Section 1: Banner Header */}
                <ProfileBanner />

                {/* Section 2: History Tabs */}
                <HistoryTabs />

                {/* Section 3: Profile Form & Picture */}
                <ProfileForm />
            </div>
        </div>
    );
}

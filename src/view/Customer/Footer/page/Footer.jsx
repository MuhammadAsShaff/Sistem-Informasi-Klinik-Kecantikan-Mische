import React from 'react';
import Logo from '@/assets/images/LogoMische.png';
import FooterLogo from './FooterLogo';
import FooterAddress from './FooterAddress';
import FooterHours from './FooterHours';
import FooterSocial from './FooterSocial';
import FooterBottom from './FooterBottom';


/**
 * =========================================================================
 * ALAS FONDASI GEDUNG KLINIK (Footer)
 * =========================================================================
 * Ibarat fondasi dasar di bagian paling bawah gedung klinik Mische.
 * Fondasi ini menyangga seluruh struktur bangunan dan menampung plang informasi
 * penting seperti lambang klinik, alamat kantor, jam buka, kontak sosial media,
 * serta stempel hak cipta di lantai terbawah.
 */
export default function Footer() {
  return (
    <footer className="w-full bg-[#2B8F41] pt-24 pb-0">
      {/* GRID KONTEN UTAMA */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-16 border-b/10 pb-20 mb-8">
      {/* versi mobile
       grid-cols-2 berguna untuk membagi tampilan menjadi 2 bagian
       gap-6 berguna untuk mengatur jarak antar kolom
       px-6 berguna untuk mengatur jarak kiri dan kanan
       pb-20 berguna untuk mengatur jarak bawah
       mb-8 berguna untuk mengatur jarak bawah
       */}

      {/* versi desktop
       md:grid-cols-4 berguna untuk membagi tampilan menjadi 4 bagian
       md:gap-16 berguna untuk mengatur jarak antar kolom
       md:px-6 berguna untuk mengatur jarak kiri dan kanan
       md:pb-20 berguna untuk mengatur jarak bawah
       md:mb-8 berguna untuk mengatur jarak bawah
       */}

        <FooterLogo logo={Logo} />
        <FooterAddress />
        <FooterHours />
        <FooterSocial />
      </div>

      {/* BARISAN HAK CIPTA */}
      <FooterBottom />
    </footer>
  );
}

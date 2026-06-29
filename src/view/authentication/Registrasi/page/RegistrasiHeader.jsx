import React from 'react';
import Logo from '@/assets/images/LogoMische.png';

/**
 * =========================================================================
 * PAPAN PLANG SAMBUTAN KEMAH PENDAFTARAN (RegistrasiHeader)
 * =========================================================================
 * Ibarat plang megah berukir emas lambang klinik yang didirikan tepat di depan
 * pintu masuk kemah pendaftaran, beserta ukiran titah kepada para calon tamu
 * untuk menuliskan data diri dengan sebenar-benarnya.
 */
const RegistrasiHeader = () => {
    return (
        <>
            {/* ─── UKIRAN LAMBANG KLINIK ────────────────────────────────────────── */}
            {/* Membungkus potret lambang Mische agar posisinya kokoh di tengah mimbar */}
            <div className="flex justify-center mb-8 md:mb-10">
                <img src={Logo} alt="Mische Aesthetic Clinic" className="h-14 w-auto object-contain" />
            </div>

            {/* ─── PAPAN TEKS TITAH PENDAFTARAN ─────────────────────────────────── */}
            {/* Menampilkan ukiran judul besar 'Registrasi' dan pesan untuk mengisi biodata sah */}
            <div className="mb-8">
                <h1 className="text-[32px] font-extrabold text-black mb-1">Registrasi</h1>
                <p className="text-[14px] text-black font-medium">
                    Daftar Akun Dengan Data Diri Anda Yang Benar
                </p>
            </div>
        </>
    );
};

export default RegistrasiHeader;


import React from 'react';
import { Loader2 } from 'lucide-react';

/* 
 * KOMPONEN: CustomerLoading
 * FUNGSI: Menampilkan layar "Memuat/Loading" (animasi putar dan kedap-kedip) saat aplikasi 
 *         sedang sibuk mengambil data dari server, agar layar tidak terlihat kosong/blank.
 */
export default function CustomerLoading({ text = "Memuat data..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 w-full h-full min-h-[300px]">
      {/* flex flex col (column) ini berguna agar tulisan dan ikon jadi atas bawah tidak sejajar*/}
      <div className="relative">

        {/* Lingkaran hijau bercahaya (glow) di belakang ikon yang berkedip (animate-pulse) */}
        <div className="absolute inset-0 bg-[#56BC36] rounded-full blur-xl opacity-20 animate-pulse"></div>

        {/* Ikon lingkaran yang berputar (Spinner) dari library Lucide React */}
        <Loader2 className="w-12 h-12 text-[#56BC36] animate-spin relative z-10" />
      </div>

      {/* Teks informasi di bawah spinner, berkedip pelan (animate-pulse) */}
      <p className="mt-6 text-gray-500 font-medium text-lg tracking-wide animate-pulse text-center">
        {text}
      </p>
    </div>
  );
}

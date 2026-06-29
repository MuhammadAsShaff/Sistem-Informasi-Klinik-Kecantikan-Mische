import React from 'react';

/**
 * =========================================================================
 * PAPAN PLANG PENGUMUMAN MADING (Header Kelola Event)
 * =========================================================================
 * Ibarat sebuah plang pengumuman besar berukir emas yang dipaku kuat di atas
 * mading utama ruangan manajer event. Papan ini bertugas menyambut staf admin
 * dan menjelaskan secara singkat apa saja fungsi ruangan ini (menambah,
 * memperbarui, atau menghapus kegiatan).
 */
export default function Header() {
  return (
    // ─── BINGKAI PAPAN PLANG UTAMA ───────────────────────────────────────────
    // Wadah kayu berjarak bawah (mb-6 atau sekitar 24px) untuk memisahkan plang dari meja pencarian di bawahnya
    <div className="mb-6">
      
      {/* ─── UKIRAN JUDUL TEBAL MADING ──────────────────────────────────────── */}
      {/* Ukiran teks hitam tebal setinggi 28 piksel (text-[28px]) bernuansa gagah (font-medium) */}
      <h1 className="text-[28px] font-medium text-black mb-1">
        Event Yang Terdaftar Pada Sistem
      </h1>
      
      {/* ─── KALIMAT PENJELAS FUNGSI BALAI ──────────────────────────────────── */}
      {/* Catatan kaki berhuruf kecil 12 piksel (text-[12px]) berwarna abu-abu sejuk (text-gray-500) */}
      <p className="text-[12px] text-gray-500 font-medium">
        Halaman Ini Menampilkan Informasi mengenai Event yang diselenggarakan dan Anda Dapat Menambah, Memperbarui, Atau Menghapus Event Melalui Halaman Ini.
      </p>
      
    </div>
  );
}

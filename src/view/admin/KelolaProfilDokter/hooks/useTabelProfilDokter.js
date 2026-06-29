import { useState } from "react";

/**
 * PENGATUR KELENTURAN BARIS TABEL (useTabelProfilDokter)
 * Ibarat penolong kecil di lemari etalase yang bertugas:
 * 1. Mengingat tulisan deskripsi mana yang sedang dibentangkan (ekspansi) agar kalimat panjang bisa terbaca semua.
 * 2. Mengantar perintah pergantian status kehadiran (Tersedia/Tidak Tersedia) ke mandor utama.
 */
export const useTabelProfilDokter = (onStatusChange) => {
  // Mengingat ID dokter mana yang kotak ceritanya sedang dibuka penuh (dibentangkan)
  const [expandedDescId, setExpandedDescId] = useState(null);

  // Fungsi pengantar pesanan saat status kehadiran diubah
  const handleStatusSelect = (id, newStatus) => {
    onStatusChange(id, newStatus);
  };

  // Saklar lipat/bentang tulisan: Jika ditekan, buka penuh; jika ditekan lagi, lipat kembali
  const toggleExpand = (id) => {
    setExpandedDescId((prev) => (prev === id ? null : id));
  };

  // Bagikan penolong kecil ini ke komponen tabel
  return {
    expandedDescId,
    handleStatusSelect,
    toggleExpand,
  };
};

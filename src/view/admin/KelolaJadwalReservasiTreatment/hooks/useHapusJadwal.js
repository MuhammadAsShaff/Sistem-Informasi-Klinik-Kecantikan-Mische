import { useState } from "react";
// Mengimpor pengantar perintah ke server pusat
import axiosClient from "@/core/api/axiosClient";
// Mengimpor daftar alamat tujuan di server
import { endpoints } from "@/core/api/endpoints";

/**
 * =========================================================================
 * PENGATUR HAPUS JADWAL (Ibarat Petugas Penghapus Jadwal di Toko)
 * =========================================================================
 * File ini ibarat "Petugas Penghapus Jadwal" di kantor admin Mische.
 * Tugas utamanya: Menunggu perintah dari admin. Begitu admin memilih 
 * satu jadwal dan menekan tombol konfirmasi hapus, petugas ini mengirimkan perintah 
 * ke komputer server pusat untuk menghapus data jadwal tersebut secara permanen.
 *
 * @param {Object|null} jadwalData - Data jadwal yang dipilih admin untuk dihapus
 * @param {Function}    onSuccess  - Perintah penutup pop-up jika penghapusan berhasil
 * @param {Function}    showToast  - Perintah pemuncul notifikasi jika terjadi masalah
 */
export function useHapusJadwal(jadwalData, onSuccess, showToast) {
  // Penanda proses loading saat sistem sedang menghubungi server untuk menghapus data
  const [isLoading, setIsLoading] = useState(false);

  // =========================================================================
  // PROSES KONFIRMASI PENGHAPUSAN JADWAL (confirmDelete)
  // =========================================================================
  const confirmDelete = async () => {
    // Tombol Pengaman: Jika admin belum memilih jadwal apa pun, batalkan proses
    if (!jadwalData) return;
    
    try {
      setIsLoading(true); // Nyalakan status loading
      
      // Mengambil nomor identitas / ID dari jadwal yang ingin dihapus (idJadwal atau id)
      const idJadwal = jadwalData.idJadwal || jadwalData.id;
      
      // Mengirimkan permintaan hapus (DELETE) ke komputer server pusat
      await axiosClient.delete(`${endpoints.admin.schedules}/${idJadwal}`);
      
      // Jika server mengonfirmasi berhasil dihapus, jalankan perintah sukses (onSuccess)
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Gagal menghapus jadwal:", error);
      
      // Jika penghapusan ditolak server (misal: jadwal sudah telanjur dipesan pasien!), tangkap alasannya
      const msg = error.response?.data?.message || "Gagal menghapus jadwal.";
      
      // MUNCULKAN KOTAK NOTIFIKASI PERINGATAN (showToast)
      // Tampilkan notifikasi warna merah ('error') di pojok layar agar admin tahu alasan kegagalannya
      if (showToast) {
        showToast(msg, "error");
      }
    } finally {
      setIsLoading(false); // Matikan status loading setelah proses selesai
    }
  };

  // =========================================================================
  // MEMBERIKAN STATUS DAN FUNGSI KE KOTAK KONFIRMASI HAPUS
  // =========================================================================
  return {
    isLoading,
    confirmDelete,
  };
}

// Mengimpor 'axiosClient', ibarat kurir pengirim surat perintah eksekusi ke server backend
import axiosClient from '@/core/api/axiosClient';
// Mengimpor 'endpoints', yaitu daftar alamat di server backend
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * ASISTEN PENGHAPUS DATA EVENT (useHapusEvent)
 * =========================================================================
 * Bayangkan file ini sebagai "Asisten Kebersihan". Tugasnya sangat tegas dan 
 * spesifik: menerima nomor KTP (ID) dari event yang mau dibuang, pergi ke server, 
 * dan memusnahkan event tersebut dari database secara permanen.
 * 
 * Asisten ini dibekali 1 titipan alat:
 * - refetch: Tombol penyegar halaman. Begitu data berhasil dihapus di server, 
 *            asisten menekan tombol ini agar event yang dihapus langsung lenyap dari layar.
 */
export function useHapusEvent(refetch) {
  
  /**
   * --- TUGAS MEMUSNAHKAN EVENT (DELETE EVENT) ---
   * Fungsi ini mengetuk pintu server khusus untuk menghapus data berdasarkan nomor ID.
   * 
   * @param {number|string} id - Nomor KTP (ID) event yang akan dibuang.
   */
  const hapusEvent = async (id) => {
    try {
      // Asisten mendobrak pintu server menggunakan metode khusus penghancuran (metode DELETE)
      const res = await axiosClient.delete(`${endpoints.admin.event}/${id}`);
      
      // Jika server mengangguk setuju dan memberi konfirmasi sukses (success = true)
      if (res.data?.success) {
        // Tekan tombol penyegar 'refetch' agar tabel di web langsung bersih dari event tersebut
        refetch();

        // Berikan surat ucapan berhasil ke kotak jendela peringatan hapus
        return { success: true, message: res.data.message || "Hore! Event berhasil dihapus!" };
      }
      
      // Jika server tidak setuju, laporkan gagal
      return { success: false, message: "Yaaah, gagal menghapus event." };
    } catch (error) {
      // Jika asisten tersandung masalah di jalan (misal internet putus atau event sudah hilang duluan)
      console.error("Gagal menghapus event:", error);
      
      // Tangkap keluhan dari server untuk dilaporkan ke admin
      return { success: false, message: error.response?.data?.message || "Yaaah, gagal menghapus event." };
    }
  };

  // Serahkan alat pembersih 'hapusEvent' ini ke Jendela Peringatan Hapus (ModalHapusEvent)
  return { hapusEvent };
}

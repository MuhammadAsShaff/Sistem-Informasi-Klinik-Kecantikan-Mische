// Mengimpor 'axiosClient', ibarat kurir khusus pembawa paket pendaftaran ke server backend
import axiosClient from '@/core/api/axiosClient';
// Mengimpor 'endpoints', yaitu daftar alamat di server backend
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * ASISTEN KURIR PENDAFTARAN EVENT BARU (useTambahEvent)
 * =========================================================================
 * Bayangkan file ini bertugas khusus sebagai "Kurir Pendaftaran". Tugas utamanya 
 * adalah membawa berkas pendaftaran event baru (yang sudah dikemas rapi oleh 
 * asisten formulir) untuk diserahkan secara resmi ke alamat server backend.
 * 
 * Asisten ini dibekali 1 titipan alat:
 * - refetch: Tombol ajaib penyegar tabel utama. Begitu server menerima pendaftaran, 
 *            asisten menekan tombol ini agar event baru langsung muncul di layar.
 */
export function useTambahEvent(refetch) {
  
  /**
   * --- TUGAS MENYETORKAN BERKAS PENDAFTARAN ---
   * Fungsi ini bertugas mengantar bungkusan formulir (termasuk foto) ke alamat server.
   * 
   * @param {FormData} formData - Bungkusan kotak berisi tulisan dan file foto event baru.
   */
  const tambahEvent = async (formData) => {
    try {
      // Kurir mengetuk pintu server menggunakan metode pengiriman baru (metode POST)
      const res = await axiosClient.post(endpoints.admin.event, formData);
      
      // Jika server tersenyum puas dan memberi persetujuan sukses (success = true)
      if (res.data?.success) {
        // Tekan tombol ajaib 'refetch' agar tabel di web langsung menampilkan event baru tersebut
        refetch();

        // Berikan surat ucapan berhasil ke jendela formulir pendaftaran
        return { success: true, message: res.data.message || "Hore! Event baru berhasil ditambahkan!" };
      }
      
      // Jika server tidak setuju padahal tidak ada error, laporkan gagal
      return { success: false, message: "Yaaah, gagal menambahkan event." };
    } catch (error) {
      // Jika kurir tersandung masalah di jalan (misal format tanggal salah, kolom wajib kosong, atau server mati)
      console.error("Gagal menambah event:", error);
      
      // 1. Menangkap keluhan umum dari server
      const errMsg = error.response?.data?.message || "Gagal menambahkan event.";
      
      // 2. Membongkar rincian keluhan server (Misal server protes: "Judul belum diisi!" atau "Format salah!").
      // Kita kumpulkan semua protes tersebut dan menggabungkannya jadi satu kalimat penjelasan yang rapi.
      const errorDetails = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(", ") 
        : "";
      
      // Kembalikan pesan error lengkap agar admin tahu persis apa yang harus diperbaiki
      return { success: false, message: errorDetails ? `${errMsg} (${errorDetails})` : errMsg };
    }
  };

  // Serahkan kemampuan 'tambahEvent' ini ke Jendela Modal Tambah agar bisa dipakai saat tombol ditekan
  return { tambahEvent };
}

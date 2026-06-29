// Mengimpor 'axiosClient', ibarat kurir khusus pembawa paket pesan ke server backend
import axiosClient from '@/core/api/axiosClient';
// Mengimpor 'endpoints', yaitu daftar alamat tujuan di server backend
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * ASISTEN PERBAIKAN DATA EVENT (useEditEvent)
 * =========================================================================
 * Bayangkan file ini sebagai "Asisten Tukang Reparasi/Perbarui Data". 
 * Tugas utamanya sangat jelas: membawa berkas formulir perubahan (nama baru, 
 * lokasi baru, atau foto baru) ke server untuk menggantikan data event yang lama.
 * 
 * Asisten ini dibekali 1 titipan alat:
 * - refetch: Tombol ajaib untuk menyegarkan mading/tabel utama di layar agar 
 *            perubahan baru langsung kelihatan tanpa perlu mereload web.
 */
export function useEditEvent(refetch) {
  
  /**
   * --- TUGAS MENGIRIM BERKAS PERUBAHAN ---
   * Fungsi ini bertugas mengantar bungkusan formulir (termasuk file foto) ke alamat server.
   * 
   * Menerima 2 bekal dari jendela edit:
   * 1. id       : Nomor KTP (ID) dari event yang mau diperbaiki.
   * 2. formData : Bungkusan kotak berisi ketikan baru dan file foto baru.
   */
  const editEvent = async (id, formData) => {
    try {
      /* 
        ====================================================================
        TRIK RAHASIA MENGIRIM FOTO KE SERVER LARAVEL
        ====================================================================
        Dalam aturan dunia web, kalau mau mengubah data lama, kita harus pakai 
        metode pengiriman bernama 'PUT'. 
        
        TAPI, server backend kita (Laravel) punya kebiasaan unik: dia bingung dan 
        menolak menerima bungkusan berisi file foto kalau dikirim pakai metode PUT langsung.
        
        Solusi cerdiknya:
        Kita tetap mengirim kurir menggunakan jalur standar 'POST', TAPI di dalam 
        bungkusan kita selipkan pesan rahasia bertuliskan `_method = PUT`. 
        Nanti server Laravel akan membaca pesan rahasia ini dan langsung mengerti 
        bahwa maksud kita adalah ingin memperbarui data lama. Sangat mulus!
      */
      formData.append('_method', 'PUT'); 

      // Asisten kurir berangkat mengetuk pintu server di alamat event beserta nomor ID tujuannya
      const res = await axiosClient.post(`${endpoints.admin.event}/${id}`, formData);
      
      // Jika server tersenyum dan memberi tanda jempol (success = true)
      if (res.data?.success) {
        // Tekan tombol ajaib 'refetch' agar tabel di halaman utama langsung menampilkan ketikan yang baru
        refetch();

        // Berikan surat ucapan berhasil ke jendela formulir edit
        return { success: true, message: res.data.message || "Hore! Event berhasil diperbarui!" };
      }
      
      // Jika server tidak setuju padahal tidak ada error, laporkan gagal
      return { success: false, message: "Yaaah, gagal memperbarui event." };
    } catch (error) {
      // Jika kurir tersandung masalah di jalan (misal foto terlalu besar, koneksi putus, atau isian wajib kosong)
      console.error("Gagal memperbarui event:", error);
      
      // 1. Menangkap keluhan umum dari server
      const errMsg = error.response?.data?.message || "Gagal memperbarui event.";
      
      // 2. Membongkar rincian keluhan server (Misal server protes: "Judul kepanjangan!" atau "File bukan JPG!").
      // Kita kumpulkan semua protes tersebut dan menggabungkannya jadi satu kalimat penjelasan yang rapi.
      const errorDetails = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(", ") 
        : "";
      
      // Kembalikan pesan error lengkap agar admin tahu persis apa yang harus diperbaiki
      return { success: false, message: errorDetails ? `${errMsg} (${errorDetails})` : errMsg };
    }
  };

  // Serahkan kemampuan 'editEvent' ini ke Jendela Modal Perbarui agar bisa dipakai saat tombol Simpan ditekan
  return { editEvent };
}

import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * FUNGSI PENAMBAH KATEGORI BARU (Ibarat Petugas Penginput Rak Baru di Toko)
 * =========================================================================
 * File ini ibarat "Petugas Penginput Kategori Baru" di gudang toko.
 * Tugasnya adalah mengirim tulisan nama dan deskripsi kategori baru yang diketik admin
 * (`payload`) untuk disimpan ke server pusat.
 *
 * @param {Function} refetch - Fungsi untuk menyegarkan tampilan tabel setelah ditambahkan.
 */
export function useTambahKategori(refetch) {
  
  /*
    FUNGSI UTAMA: MENAMBAHKAN DATA (tambahKategori)
    Menerima data tulisan baru (payload berisi nama dan deskripsi).
  */
  const tambahKategori = async (payload) => {
    try {
      // 1. Mengirim data tulisan baru ke server pusat
      const res = await axiosClient.post(endpoints.admin.kategori, payload);
      
      // 2. Jika server menyatakan berhasil disimpan (status = success)
      if (res.data?.status === 'success') {
        // Segarkan tabel daftar kategori agar kategori baru langsung muncul di layar
        if (refetch) refetch();
        return { success: true, message: res.data.message };
      }
      // Jika gagal disimpan
      return { success: false, message: 'Gagal menambahkan kategori' };
    } catch (error) {
      // 3. Jika ditolak oleh server (misal nama kategori sudah pernah didaftarkan)
      console.error("Gagal tambah kategori:", error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menambahkan kategori';
      return { 
        success: false, 
        message: typeof errorMessage === 'string' ? errorMessage : 'Validasi gagal', 
        errors: error.response?.data?.message 
      };
    }
  };

  // Mengirimkan fungsi penambah ini ke kotak pop-up tambah kategori
  return { tambahKategori };
}

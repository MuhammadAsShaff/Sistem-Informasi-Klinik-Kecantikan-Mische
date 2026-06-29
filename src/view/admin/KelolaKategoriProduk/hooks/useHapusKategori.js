import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * FUNGSI PENGHAPUS KATEGORI (Ibarat Petugas Pencabut Label Rak Toko)
 * =========================================================================
 * File ini ibarat "Petugas Pencabut Label" di gudang toko.
 * Tugasnya adalah mengirim permintaan hapus ke server pusat agar kategori
 * yang dipilih dihapus dari sistem.
 *
 * @param {Function} refetch - Fungsi untuk menyegarkan tampilan tabel setelah dihapus.
 */
export function useHapusKategori(refetch) {
  
  /*
    FUNGSI UTAMA: MENGHAPUS DATA (hapusKategori)
    Menerima ID kategori (id) yang ingin dihapus.
  */
  const hapusKategori = async (id) => {
    try {
      // 1. Mengirim perintah hapus ke server pusat
      const res = await axiosClient.delete(`${endpoints.admin.kategori}/${id}`);
      
      // 2. Jika server menyatakan berhasil (status = success)
      if (res.data?.status === 'success') {
        // Segarkan tabel daftar kategori agar kategori yang dihapus hilang dari layar
        if (refetch) refetch();
        return { success: true, message: res.data.message };
      }
      // Jika gagal menghapus
      return { success: false, message: 'Gagal menghapus kategori' };
    } catch (error) {
      // 3. Jika ditolak oleh server (misal kategori masih dipakai oleh suatu produk)
      console.error("Gagal hapus kategori:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Terjadi kesalahan saat menghapus kategori' 
      };
    }
  };

  // Mengirimkan fungsi hapus ini ke kotak pop-up konfirmasi hapus
  return { hapusKategori };
}

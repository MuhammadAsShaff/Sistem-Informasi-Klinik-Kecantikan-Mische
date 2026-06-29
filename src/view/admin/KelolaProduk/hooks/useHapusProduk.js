import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * ASISTEN PENGHAPUS PRODUK (useHapusProduk)
 * Ibarat petugas eksekutor yang bertugas mengirim surat permohonan penghapusan 
 * suatu barang dari sistem pembukuan gudang pusat.
 */
export function useHapusProduk(refetch) {
  // Fungsi untuk memerintahkan penghapusan produk berdasarkan kode (ID) barang
  const hapusProduk = async (id) => {
    try {
      // Mengirim surat perintah hapus ke gudang pusat
      const res = await axiosClient.delete(`${endpoints.admin.products}/${id}`);
      
      // Jika gudang pusat mengonfirmasi barang telah dihapus, suruh etalase mencatat ulang daftar terbaru
      if (res.data?.status === 'success' || res.data?.success) {
        if (refetch) refetch(); // Segarkan tampilan tabel
        return { success: true, message: res.data.message || 'Berhasil menghapus produk' };
      }
      return { success: false, message: 'Gagal menghapus produk' };
    } catch (error) {
      console.error("Gagal hapus produk:", error);
      // Mencatat alasan jika gudang pusat menolak penghapusan (misal: barang masih tersangkut transaksi)
      return { success: false, message: error.response?.data?.message || 'Terjadi kesalahan saat menghapus produk' };
    }
  };

  return { hapusProduk };
}

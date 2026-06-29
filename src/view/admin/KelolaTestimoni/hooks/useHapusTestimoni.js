import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * PETUGAS PEMBERSIH & PENCOPOT TESTIMONI (useHapusTestimoni)
 * =========================================================================
 * Ibarat petugas kebersihan klinik yang bersiap di depan etalase mading.
 * Ketika pimpinan menunjuk salah satu ulasan yang sudah tidak relevan dan menekan tombol hapus,
 * petugas ini langsung mencopot lembar pujian tersebut dan merobeknya dari arsip permanen.
 */
export function useHapusTestimoni(refetch) {
  /**
   * TUGAS PENCOPOTAN LEMBAR PUJIAN (hapusTestimoni)
   * Petugas mencari nomor berkas (id) di loket pusat, merobeknya, dan menyuruh asisten menyegarkan etalase.
   */
  const hapusTestimoni = async (id) => {
    try {
      const res = await axiosClient.delete(`${endpoints.admin.testimonials}/${id}`);
      if (res.data?.success) {
        if (refetch) await refetch(); // Minta asisten penjaga menyegarkan etalase
        return { success: true, message: res.data.message || 'Testimoni berhasil dihapus' };
      }
      return { success: false, message: 'Gagal menghapus testimoni' };
    } catch (error) {
      console.error("Gagal hapus testimoni:", error);
      return { success: false, message: error.response?.data?.message || 'Terjadi kesalahan saat menghapus testimoni' };
    }
  };

  // Petugas menyerahkan keahlian mencopot kepada plang peringatan (ModalHapus)
  return { hapusTestimoni };
}

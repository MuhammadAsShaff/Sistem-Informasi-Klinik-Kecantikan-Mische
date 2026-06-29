import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * ASISTEN KURIR REPARASI STEMPEL KATEGORI (useEditKategori)
 * =========================================================================
 * Bayangkan hook ini sebagai "Kurir Pengantar Proposal Revisi".
 * Tugas khususnya adalah membawa dokumen perbaikan nama dan deskripsi kategori 
 * (`payload`) menuju kantor pusat backend (`axiosClient.put`).
 *
 * @param {Function} refetch - Rantai lonceng milik Mandor Gudang untuk menyegarkan rak lemari.
 */
export function useEditKategori(refetch) {
  
  /*
    FUNGSI UTAMA: PERBARUI DOKUMEN (editKategori)
    Menerima nomor dokumen (id) dan isian baru (payload).
  */
  const editKategori = async (id, payload) => {
    try {
      // 1. Kurir meluncur membawa proposal revisi ke alamat gedung pusat
      const res = await axiosClient.put(`${endpoints.admin.kategori}/${id}`, payload);
      
      // 2. JIKA cap jempol kesepakatan (success) diberikan oleh petugas server
      if (res.data?.status === 'success') {
        // Tarik lonceng Mandor Gudang agar buku katalog segera disegarkan!
        if (refetch) refetch();
        return { success: true, message: res.data.message };
      }
      // JIKA ditolak namun tidak marah-marah
      return { success: false, message: 'Gagal memperbarui kategori' };
    } catch (error) {
      // 3. JIKA terjadi keributan di jalan (error dari server, misal nama kategori sudah dipakai)
      console.error("Gagal edit kategori:", error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui kategori';
      return { 
        success: false, 
        message: typeof errorMessage === 'string' ? errorMessage : 'Validasi gagal', 
        errors: error.response?.data?.message 
      };
    }
  };

  // Menyerahkan jasa kurir ini kepada perawat meja bedah
  return { editKategori };
}

import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * ASISTEN JURU TULIS PERBAIKAN LEMBAR TESTIMONI (useEditTestimoni)
 * =========================================================================
 * Ibarat asisten juru tulis terlatih yang khusus mengantarkan berkas perbaikan ulasan pelanggan.
 * Ketika pimpinan mengoreksi ejaan ulasan atau menempel foto pelanggan yang baru, 
 * asisten ini menyiasatinya dengan cap khusus ('_method: PUT') agar diterima oleh loket pusat (Laravel).
 */
export function useEditTestimoni(refetch) {
  /**
   * TUGAS MENGIRIM KOREKSI TESTIMONI (editTestimoni)
   * Asisten membawa bungkusan berkas (formData) dan nomor urut ulasan (id) menuju loket perbaikan.
   */
  const editTestimoni = async (id, formData) => {
    try {
      formData.append('_method', 'PUT'); // Memberi stempel sakti agar loket Laravel mengerti ini adalah perbaikan
      const res = await axiosClient.post(`${endpoints.admin.testimonials}/${id}`, formData, {
        headers: {
          // Asisten menyiapkan saku surat khusus jika ada lampiran berkas
        },
      });

      if (res.data?.success) {
        if (refetch) await refetch(); // Minta asisten penjaga menyegarkan etalase ulasan
        return { success: true, message: res.data.message || 'Testimoni berhasil diperbarui' };
      }
      return { success: false, message: 'Gagal memperbarui testimoni' };
    } catch (error) {
      console.error("Gagal edit testimoni:", error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui testimoni';
      return { success: false, message: errorMessage, errors: error.response?.data?.errors };
    }
  };

  // Asisten menyerahkan kemampuan mengoreksi kepada meja perbaikan (ModalEdit)
  return { editTestimoni };
}

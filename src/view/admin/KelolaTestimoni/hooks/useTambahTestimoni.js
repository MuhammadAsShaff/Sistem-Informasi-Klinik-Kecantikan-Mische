import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * ASISTEN KURIR PENDAFTARAN TESTIMONI BARU (useTambahTestimoni)
 * =========================================================================
 * Ibarat asisten kurir cepat yang bersiap di samping meja pendaftaran ulasan.
 * Begitu formulir ulasan baru selesai ditulis dan dilampiri foto pelanggan, kurir ini langsung memasukkannya 
 * ke dalam tas dan berlari kencang menuju loket pendaftaran di kantor pusat.
 */
export function useTambahTestimoni(refetch) {
  /**
   * TUGAS PENGIRIMAN BERKAS PENDAFTARAN (tambahTestimoni)
   * Kurir mengantarkan bungkusan berkas (formData) ke loket pendaftaran pusat (POST).
   */
  const tambahTestimoni = async (formData) => {
    try {
      const res = await axiosClient.post(endpoints.admin.testimonials, formData, {
        headers: {
          // Kurir menyiapkan kantong kedap air jika membawa file foto besar
        },
      });

      if (res.data?.success) {
        if (refetch) await refetch(); // Minta asisten penjaga menyegarkan etalase mading
        return { success: true, message: res.data.message || 'Testimoni berhasil ditambahkan' };
      }
      return { success: false, message: 'Gagal menambahkan testimoni' };
    } catch (error) {
      console.error("Gagal tambah testimoni:", error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menambahkan testimoni';
      return { success: false, message: errorMessage, errors: error.response?.data?.errors };
    }
  };

  // Kurir menyerahkan sepedanya kepada meja pendaftaran (useModalTambah)
  return { tambahTestimoni };
}

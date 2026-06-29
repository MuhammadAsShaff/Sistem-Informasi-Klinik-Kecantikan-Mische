import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * UTUSAN PENDAFTARAN PRODUK BARU (useTambahProduk)
 * Ibarat kurir ekspres yang membawa map berisi formulir pendaftaran barang baru 
 * beserta fotonya untuk diserahkan ke sistem pencatatan gudang pusat (server).
 */
export function useTambahProduk(refetch) {
  // Fungsi untuk mengirimkan map pendaftaran ke gudang pusat
  const tambahProduk = async (formData) => {
    try {
      // Kurir berangkat mengantarkan berkas pendaftaran ke gudang pusat
      const res = await axiosClient.post(endpoints.admin.products, formData, {
        headers: {},
      });
      
      // Jika gudang pusat memberi stempel "Sukses", perintahkan etalase untuk mencatat ulang daftar barang
      if (res.data?.status === 'success' || res.data?.success) {
        if (refetch) refetch(); // Segarkan tampilan tabel etalase
        return { success: true, message: res.data.message || 'Berhasil menambahkan produk' };
      }
      return { success: false, message: 'Gagal menambahkan produk' };
    } catch (error) {
      console.error("Gagal tambah produk:", error);
      // Memeriksa alasan penolakan dari gudang pusat (misal: nama barang sudah pernah ada)
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menambahkan produk';
      return { success: false, message: typeof errorMessage === 'string' ? errorMessage : 'Validasi gagal', errors: error.response?.data?.errors || error.response?.data?.message };
    }
  };

  return { tambahProduk };
}

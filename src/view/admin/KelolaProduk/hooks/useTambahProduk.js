import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useTambahProduk(refetch) {
  const tambahProduk = async (formData) => {
    try {
      const res = await axiosClient.post(endpoints.admin.products, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data?.status === 'success' || res.data?.success) {
        if (refetch) refetch();
        return { success: true, message: res.data.message || 'Berhasil menambahkan produk' };
      }
      return { success: false, message: 'Gagal menambahkan produk' };
    } catch (error) {
      console.error("Gagal tambah produk:", error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menambahkan produk';
      return { success: false, message: typeof errorMessage === 'string' ? errorMessage : 'Validasi gagal', errors: error.response?.data?.errors || error.response?.data?.message };
    }
  };

  return { tambahProduk };
}

import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useEditProduk(refetch) {
  const editProduk = async (id, formData) => {
    try {
      formData.append('_method', 'PUT'); // Spoofing PUT for multipart/form-data
      const res = await axiosClient.post(`${endpoints.admin.products}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data?.status === 'success' || res.data?.success) {
        if (refetch) refetch();
        return { success: true, message: res.data.message || 'Berhasil memperbarui produk' };
      }
      return { success: false, message: 'Gagal memperbarui produk' };
    } catch (error) {
      console.error("Gagal edit produk:", error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui produk';
      return { success: false, message: typeof errorMessage === 'string' ? errorMessage : 'Validasi gagal', errors: error.response?.data?.errors || error.response?.data?.message };
    }
  };

  return { editProduk };
}

import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useUpdateStok(updateLocalStock) {
  const updateStok = async (id, stock) => {
    // Optimistic UI update
    if (updateLocalStock) updateLocalStock(id, stock);
    try {
      const res = await axiosClient.patch(`${endpoints.admin.products}/${id}`, { stock });
      if (res.data?.status === 'success' || res.data?.success) {
        return { success: true, message: res.data.message || 'Berhasil memperbarui stok' };
      }
      return { success: false, message: 'Gagal memperbarui stok' };
    } catch (error) {
      console.error("Gagal update stok:", error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui stok';
      return { success: false, message: typeof errorMessage === 'string' ? errorMessage : 'Validasi gagal', errors: error.response?.data?.errors || error.response?.data?.message };
    }
  };

  return { updateStok };
}

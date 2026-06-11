import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useHapusProduk(refetch) {
  const hapusProduk = async (id) => {
    try {
      const res = await axiosClient.delete(`${endpoints.admin.products}/${id}`);
      if (res.data?.status === 'success' || res.data?.success) {
        if (refetch) refetch();
        return { success: true, message: res.data.message || 'Berhasil menghapus produk' };
      }
      return { success: false, message: 'Gagal menghapus produk' };
    } catch (error) {
      console.error("Gagal hapus produk:", error);
      return { success: false, message: error.response?.data?.message || 'Terjadi kesalahan saat menghapus produk' };
    }
  };

  return { hapusProduk };
}

import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useHapusTestimoni(refetch) {
  const hapusTestimoni = async (id) => {
    try {
      const res = await axiosClient.delete(`${endpoints.admin.testimonials}/${id}`);
      if (res.data?.success) {
        if (refetch) await refetch();
        return { success: true, message: res.data.message || 'Testimoni berhasil dihapus' };
      }
      return { success: false, message: 'Gagal menghapus testimoni' };
    } catch (error) {
      console.error("Gagal hapus testimoni:", error);
      return { success: false, message: error.response?.data?.message || 'Terjadi kesalahan saat menghapus testimoni' };
    }
  };

  return { hapusTestimoni };
}

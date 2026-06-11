import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useHapusKategori(refetch) {
  const hapusKategori = async (id) => {
    try {
      const res = await axiosClient.delete(`${endpoints.admin.kategori}/${id}`);
      if (res.data?.status === 'success') {
        if (refetch) refetch();
        return { success: true, message: res.data.message };
      }
      return { success: false, message: 'Gagal menghapus kategori' };
    } catch (error) {
      console.error("Gagal hapus kategori:", error);
      return { success: false, message: error.response?.data?.message || 'Terjadi kesalahan saat menghapus kategori' };
    }
  };

  return { hapusKategori };
}

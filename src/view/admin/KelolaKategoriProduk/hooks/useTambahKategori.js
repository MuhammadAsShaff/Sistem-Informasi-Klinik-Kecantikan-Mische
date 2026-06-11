import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useTambahKategori(refetch) {
  const tambahKategori = async (payload) => {
    try {
      const res = await axiosClient.post(endpoints.admin.kategori, payload);
      if (res.data?.status === 'success') {
        if (refetch) refetch();
        return { success: true, message: res.data.message };
      }
      return { success: false, message: 'Gagal menambahkan kategori' };
    } catch (error) {
      console.error("Gagal tambah kategori:", error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menambahkan kategori';
      return { success: false, message: typeof errorMessage === 'string' ? errorMessage : 'Validasi gagal', errors: error.response?.data?.message };
    }
  };

  return { tambahKategori };
}

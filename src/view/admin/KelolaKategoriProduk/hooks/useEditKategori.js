import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useEditKategori(refetch) {
  const editKategori = async (id, payload) => {
    try {
      const res = await axiosClient.put(`${endpoints.admin.kategori}/${id}`, payload);
      if (res.data?.status === 'success') {
        if (refetch) refetch();
        return { success: true, message: res.data.message };
      }
      return { success: false, message: 'Gagal memperbarui kategori' };
    } catch (error) {
      console.error("Gagal edit kategori:", error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui kategori';
      return { success: false, message: typeof errorMessage === 'string' ? errorMessage : 'Validasi gagal', errors: error.response?.data?.message };
    }
  };

  return { editKategori };
}

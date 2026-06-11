import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useEditTestimoni(refetch) {
  const editTestimoni = async (id, formData) => {
    try {
      formData.append('_method', 'PUT'); // Spoofing for Laravel
      const res = await axiosClient.post(`${endpoints.admin.testimonials}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success) {
        if (refetch) refetch();
        return { success: true, message: res.data.message };
      }
      return { success: false, message: 'Gagal memperbarui testimoni' };
    } catch (error) {
      console.error("Gagal edit testimoni:", error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui testimoni';
      return { success: false, message: errorMessage, errors: error.response?.data?.errors };
    }
  };

  return { editTestimoni };
}

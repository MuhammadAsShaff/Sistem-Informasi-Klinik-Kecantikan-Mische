import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useTambahTestimoni(refetch) {
  const tambahTestimoni = async (formData) => {
    try {
      const res = await axiosClient.post(endpoints.admin.testimonials, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success) {
        if (refetch) refetch();
        return { success: true, message: res.data.message };
      }
      return { success: false, message: 'Gagal menambahkan testimoni' };
    } catch (error) {
      console.error("Gagal tambah testimoni:", error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menambahkan testimoni';
      return { success: false, message: errorMessage, errors: error.response?.data?.errors };
    }
  };

  return { tambahTestimoni };
}

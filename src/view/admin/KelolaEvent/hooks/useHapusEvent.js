import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useHapusEvent(refetch) {
  const hapusEvent = async (id) => {
    try {
      const res = await axiosClient.delete(`${endpoints.admin.event}/${id}`);
      if (res.data?.success) {
        refetch();
        return { success: true, message: res.data.message || "Event ini berhasil di hapus!" };
      }
      return { success: false, message: "Gagal menghapus event." };
    } catch (error) {
      console.error("Gagal menghapus event:", error);
      return { success: false, message: error.response?.data?.message || "Gagal menghapus event." };
    }
  };

  return { hapusEvent };
}

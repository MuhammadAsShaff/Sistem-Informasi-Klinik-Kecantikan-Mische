import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useEditEvent(refetch) {
  const editEvent = async (id, formData) => {
    try {
      formData.append('_method', 'PUT'); // Laravel requirement for multipart/form-data PUT
      const res = await axiosClient.post(`${endpoints.admin.event}/${id}`, formData);
      if (res.data?.success) {
        refetch();
        return { success: true, message: res.data.message || "Event ini berhasil diperbarui!" };
      }
      return { success: false, message: "Gagal memperbarui event." };
    } catch (error) {
      console.error("Gagal memperbarui event:", error);
      const errMsg = error.response?.data?.message || "Gagal memperbarui event.";
      const errorDetails = error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(", ") : "";
      return { success: false, message: errorDetails ? `${errMsg} (${errorDetails})` : errMsg };
    }
  };

  return { editEvent };
}

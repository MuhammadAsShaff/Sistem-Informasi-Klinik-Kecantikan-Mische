import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

export function useTambahEvent(refetch) {
  const tambahEvent = async (formData) => {
    try {
      const res = await axiosClient.post(endpoints.admin.event, formData);
      if (res.data?.success) {
        refetch();
        return { success: true, message: res.data.message || "Event ini berhasil ditambahkan!" };
      }
      return { success: false, message: "Gagal menambahkan event." };
    } catch (error) {
      console.error("Gagal menambah event:", error);
      const errMsg = error.response?.data?.message || "Gagal menambahkan event.";
      const errorDetails = error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(", ") : "";
      return { success: false, message: errorDetails ? `${errMsg} (${errorDetails})` : errMsg };
    }
  };

  return { tambahEvent };
}

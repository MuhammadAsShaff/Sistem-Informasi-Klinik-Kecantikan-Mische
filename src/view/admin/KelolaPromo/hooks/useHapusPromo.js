import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useHapusPromo(selectedPromo, onSuccess, showToast) {
  const confirmDelete = async (closeModal) => {
    if (!selectedPromo) return;
    const idPromo = selectedPromo.idPromo || selectedPromo.id;

    try {
      const res = await axiosClient.delete(`${endpoints.admin.promo}/${idPromo}`);
      if (res.data?.success) {
        showToast("Promo ini berhasil di hapus!", "success");
        if (closeModal) closeModal();
        if (onSuccess) onSuccess();
      } else {
        showToast("Gagal menghapus promo.", "error");
      }
    } catch (error) {
      console.error("Gagal menghapus promo:", error);
      showToast(error.response?.data?.message || "Gagal menghapus promo.", "error");
    }
  };

  const updateStatusPromo = async (id, newStatus) => {
    // Note: The API does not have a specific updateStatus endpoint for Promo,
    // so we would normally use the PUT endpoint for full update.
    // However, if the backend only has full update, we must send the full data.
    // For now, let's assume we can PUT the status or we might need to change it later.
    // Since we don't have the full data here, I will just call the updatePromo endpoint.
    try {
      // Assuming we need to send _method: PUT and status
      // We might need to adjust this if backend validation requires all fields for status update.
      // A common way is to submit FormData.
      const payload = new FormData();
      payload.append('_method', 'PUT');
      payload.append('status', newStatus ? 1 : 0);
      
      const res = await axiosClient.post(`${endpoints.admin.promo}/${id}`, payload, {
         headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        showToast(`Status promo berhasil diubah!`, "success");
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Gagal mengubah status promo:", error);
      showToast(error.response?.data?.message || "Gagal mengubah status promo.", "error");
    }
  };

  return {
    confirmDelete,
    updateStatusPromo,
  };
}

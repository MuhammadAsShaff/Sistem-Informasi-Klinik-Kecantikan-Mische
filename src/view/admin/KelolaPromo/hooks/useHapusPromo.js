import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useHapusPromo(selectedPromo, onSuccess, showToast) {
  const confirmDelete = async (closeModal) => {
    if (!selectedPromo) return;
    const idPromo = selectedPromo.idPromo || selectedPromo.id;

    try {
      const res = await axiosClient.delete(`${endpoints.admin.promo}/${idPromo}`);
      if (res.data?.success) {
        showToast("Berhasil menghapus promo", "success");
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
    try {
      const res = await axiosClient.patch(`${endpoints.admin.promo}/${id}/status`, {
        status: newStatus ? 1 : 0
      });
      if (res.data?.success) {
        showToast("Status promo berhasil diubah!", "success");
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

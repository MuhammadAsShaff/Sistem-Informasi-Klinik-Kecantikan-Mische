import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useHapusDokter(selectedDokter, onSuccess, showToast) {
  const confirmDelete = async (closeModal) => {
    if (!selectedDokter) return;

    try {
      const docId = selectedDokter.idDokter || selectedDokter.id;
      
      await axiosClient.delete(`${endpoints.admin.doctors}/${docId}`);
      
      showToast("Berhasil menghapus profil dokter!", "success");
      if (closeModal) closeModal();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Gagal menghapus dokter:", error);
      showToast("Gagal menghapus profil dokter.", "error");
    }
  };

  const updateStatusDokter = async (id, newStatus) => {
    try {
      await axiosClient.patch(`${endpoints.admin.doctors}/${id}/status`, { status: newStatus });
      showToast(`Status dokter berhasil diubah menjadi ${newStatus}!`, "success");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Gagal mengubah status dokter:", error);
      showToast(
        error.response?.data?.message || "Gagal mengubah status dokter.",
        "error"
      );
    }
  };

  return {
    confirmDelete,
    updateStatusDokter,
  };
}

import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * Hook untuk menghapus jadwal reservasi (DELETE).
 * @param {Object|null} jadwalData - Jadwal yang dipilih untuk dihapus
 * @param {Function}    onSuccess  - Callback setelah berhasil hapus
 * @param {Function}    showToast  - Fungsi untuk menampilkan notifikasi error
 */
export function useHapusJadwal(jadwalData, onSuccess, showToast) {
  const [isLoading, setIsLoading] = useState(false);

  const confirmDelete = async () => {
    if (!jadwalData) return;
    try {
      setIsLoading(true);
      const idJadwal = jadwalData.idJadwal || jadwalData.id;
      await axiosClient.delete(`${endpoints.admin.schedules}/${idJadwal}`);
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Gagal menghapus jadwal:", error);
      const msg = error.response?.data?.message || "Gagal menghapus jadwal.";
      // Gunakan toast jika tersedia
      if (showToast) {
        showToast(msg, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    confirmDelete,
  };
}

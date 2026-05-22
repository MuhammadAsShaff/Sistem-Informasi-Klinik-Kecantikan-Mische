import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useHapusReservasi(selectedReservasi, onSuccess, showToast) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedReservasi) return;

    setIsDeleting(true);
    try {
      const id = selectedReservasi.idReservasi || selectedReservasi.id;
      await axiosClient.delete(`${endpoints.admin.reservations}/${id}`);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Gagal menghapus reservasi:", err);
      let errMsg = "Terjadi kesalahan saat menghapus reservasi.";
      if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      }
      showToast(errMsg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleDelete,
    isDeleting,
  };
}

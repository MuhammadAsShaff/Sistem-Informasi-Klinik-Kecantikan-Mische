import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * Hook untuk menghapus kegiatan (DELETE).
 *
 * @param {string|number|null} id        - ID kegiatan yang dihapus
 * @param {Function}           onSuccess - Callback setelah berhasil hapus
 * @param {Function}           showToast - Fungsi untuk menampilkan notifikasi error
 */
export function useHapusKegiatan(id, onSuccess, showToast) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      await axiosClient.delete(`${endpoints.admin.kegiatan}/${id}`);
      // API mengembalikan 204 No Content → sukses jika tidak throw
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Gagal menghapus kegiatan:", error);
      const msg = error.response?.data?.message || "Gagal menghapus kegiatan.";
      if (showToast) {
        showToast(msg, "error");
      } else {
        alert(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleDelete };
}

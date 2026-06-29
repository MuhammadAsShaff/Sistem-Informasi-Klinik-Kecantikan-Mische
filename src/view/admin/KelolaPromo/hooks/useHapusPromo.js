import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * =========================================================================
 * PETUGAS PEMBERSIH & SAKLAR AKTIF PROMO (useHapusPromo)
 * =========================================================================
 * Ibarat dua orang petugas handal di dalam balai pengelolaan promo:
 * 1. Petugas Pemusnah (confirmDelete): Bertugas merobek dan membakar lembar promo permanen dari buku arsip.
 * 2. Petugas Saklar (updateStatusPromo): Bertugas mematikan atau menyalakan saklar listrik (Aktif/Tidak Aktif)
 *    pada promo tertentu tanpa harus membuang berkasnya.
 */
export function useHapusPromo(selectedPromo, onSuccess, showToast) {
  
  /**
   * TUGAS PEMUSNAHAN LEMBAR PROMO (confirmDelete)
   * Petugas mengambil lembar promo yang ditunjuk (selectedPromo), merobeknya, dan memberi tahu 
   * TOA pengumuman (showToast) bahwa lembar tersebut sudah tiada.
   */
  const confirmDelete = async (closeModal) => {
    if (!selectedPromo) return; // Jika tidak ada lembar yang ditunjuk, petugas diam saja
    const idPromo = selectedPromo.idPromo || selectedPromo.id;

    try {
      const res = await axiosClient.delete(`${endpoints.admin.promo}/${idPromo}`);
      if (res.data?.success) {
        showToast("Berhasil menghapus promo", "success"); // Umumkan keberhasilan
        if (closeModal) closeModal(); // Tutup plang peringatan
        if (onSuccess) onSuccess(); // Beri tahu pimpinan agar menyegarkan tabel
      } else {
        showToast("Gagal menghapus promo.", "error");
      }
    } catch (error) {
      console.error("Gagal menghapus promo:", error);
      showToast(error.response?.data?.message || "Gagal menghapus promo.", "error");
    }
  };

  /**
   * TUGAS MENGGESER SAKLAR AKTIF PROMO (updateStatusPromo)
   * Petugas berlari ke kotak listrik promo, mengubah statusnya menjadi Aktif (1) atau Tidak Aktif (0).
   */
  const updateStatusPromo = async (id, newStatus) => {
    try {
      const res = await axiosClient.patch(`${endpoints.admin.promo}/${id}/status`, {
        status: newStatus ? 1 : 0
      });
      if (res.data?.success) {
        showToast("Status promo berhasil diubah!", "success"); // Umumkan pergantian saklar
        if (onSuccess) onSuccess(); // Minta tabel diperbarui seketika
      }
    } catch (error) {
      console.error("Gagal mengubah status promo:", error);
      showToast(error.response?.data?.message || "Gagal mengubah status promo.", "error");
    }
  };

  // Kedua petugas bersiap siaga menunggu titah mandor
  return {
    confirmDelete,
    updateStatusPromo,
  };
}

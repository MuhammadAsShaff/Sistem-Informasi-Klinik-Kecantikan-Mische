import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * =========================================================================
 * PETUGAS PEMBERSIH & PENCORET TAMU (useHapusReservasi)
 * =========================================================================
 * Ibarat petugas eksekutor berseragam rapi yang memegang penghapus hitam.
 * Ketika pimpinan menunjuk salah satu nama tamu di tabel dan memberi perintah, 
 * petugas ini langsung mencoret dan membuang catatan tamu tersebut dari buku antrean permanen.
 */
export function useHapusReservasi(selectedReservasi, onSuccess, showToast) {
  // Rambu penanda petugas sedang menggosok penghapus dan merobek berkas
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * TUGAS PENCORETAN DAN PENGHAPUSAN BERKAS (handleDelete)
   * Petugas mencari nomor urut tamu di dalam buku besar, merobeknya, dan memberi tahu TOA pengumuman.
   */
  const handleDelete = async () => {
    if (!selectedReservasi) return; // Jika tidak ada tamu yang ditunjuk, petugas diam saja

    setIsDeleting(true); // Nyalakan lampu tanda petugas sedang mencoret berkas
    try {
      const id = selectedReservasi.idReservasi || selectedReservasi.id;
      await axiosClient.delete(`${endpoints.admin.reservations}/${id}`);
      if (onSuccess) onSuccess(); // Beri tahu mandor agar memperbarui tampilan tabel
    } catch (err) {
      console.error("Gagal menghapus reservasi:", err);
      let errMsg = "Terjadi kesalahan saat menghapus reservasi.";
      if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      }
      showToast(errMsg, "error"); // Umumkan kegagalan lewat TOA
    } finally {
      setIsDeleting(false); // Matikan lampu sibuk mencoret
    }
  };

  // Petugas menyerahkan tombol eksekusi dan rambu sibuk kepada plang peringatan (view)
  return {
    handleDelete,
    isDeleting,
  };
}

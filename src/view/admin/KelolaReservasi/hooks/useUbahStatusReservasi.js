import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * =========================================================================
 * PETUGAS PENANDA STATUS KEHADIRAN TAMU (useUbahStatusReservasi)
 * =========================================================================
 * Ibarat petugas penerima tamu yang memegang stempel warna-warni di meja resepsionis.
 * Ketika meja pengecapan dibuka, petugas ini memeriksa status lama tamu tersebut, 
 * lalu bersiap mengganti pita warnanya menjadi: "Menunggu" (Kuning), "Dikonfirmasi" (Hijau), 
 * "Selesai" (Hijau Gelap), atau "Dibatalkan" (Merah).
 */
export function useUbahStatusReservasi(selectedReservasi, onSuccess, isOpen) {
  // Laci penyimpanan cap status yang dipilih admin
  const [status, setStatus] = useState("Menunggu");
  // Rambu penanda petugas sedang mengetok stempel ke buku arsip pusat
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Papan teguran jika stempel gagal menempel
  const [error, setError] = useState(null);

  /**
   * EFEK SAMPING: MENYELARASKAN STEMPEL SAAT MEJA DIBUKA
   * Begitu meja pengecapan dibuka (isOpen) dan tamu ditunjuk (selectedReservasi), 
   * petugas langsung mengambil stempel yang cocok dengan riwayat kehadiran tamu tersebut.
   */
  useEffect(() => {
    if (isOpen && selectedReservasi) {
      setStatus(selectedReservasi.status || "Menunggu");
      setError(null);
    }
  }, [isOpen, selectedReservasi]);

  /**
   * TUGAS MENGIRIM CAP STATUS BARU (submitStatus)
   * Petugas menorehkan cap baru pada berkas tamu dan mengirimkannya ke kantor pusat (PATCH).
   */
  const submitStatus = async (e) => {
    if (e) e.preventDefault();
    if (!selectedReservasi) return; // Jika tidak ada tamu yang ditunjuk, petugas diam saja

    setIsSubmitting(true); // Nyalakan lampu tanda petugas sibuk mengecap
    setError(null);

    try {
      const id = selectedReservasi.idReservasi || selectedReservasi.id;
      // Mengirimkan pembaruan status ke loket PATCH di kantor pusat
      await axiosClient.patch(`${endpoints.admin.reservations}/${id}`, {
        status: status
      });
      if (onSuccess) onSuccess(); // Beri tahu mandor bahwa stempel berhasil diganti
    } catch (err) {
      console.error("Gagal mengubah status:", err);
      let errMsg = "Terjadi kesalahan saat mengubah status.";
      if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      }
      if (err.response?.data?.errors) {
        errMsg = Object.values(err.response.data.errors).flat().join(" ");
      }
      setError(errMsg); // Tuliskan teguran di papan meja
    } finally {
      setIsSubmitting(false); // Matikan lampu tanda petugas sibuk
    }
  };

  // Petugas menyerahkan kotak pilihan stempel dan rambu kerja kepada meja pengecapan (view)
  return {
    status, setStatus,
    submitStatus,
    isSubmitting,
    error,
  };
}

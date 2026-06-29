import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * =========================================================================
 * ASISTEN KURIR PENDAFTARAN TAMU BARU (useTambahReservasi)
 * =========================================================================
 * Ibarat asisten kurir kilat yang siap siaga di pintu balai pendaftaran.
 * Begitu formulir pendaftaran tamu baru selesai ditulis, kurir ini memasukkannya ke dalam tas 
 * dan mengayuh sepeda secepat mungkin menuju kantor pusat (backend server).
 */
export function useTambahReservasi(onSuccess, onError) {
  // Rambu penanda kurir sedang mengayuh sepeda di perjalanan
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Papan teguran jika berkas ditolak oleh kantor pusat
  const [error, setError] = useState(null);

  /**
   * TUGAS PENGIRIMAN BERKAS PENDAFTARAN (tambahReservasi)
   * Kurir mengantarkan bungkusan formulir (payload) ke alamat loket pendaftaran di kantor pusat.
   */
  const tambahReservasi = async (payload) => {
    setIsSubmitting(true); // Nyalakan lampu tanda kurir berangkat
    setError(null);

    try {
      // NOTE: Mengirimkan bungkusan pendaftaran ke loket /api/admin/reservations
      const res = await axiosClient.post(endpoints.admin.reservations, payload);
      
      if (res.data?.success) {
        if (onSuccess) onSuccess(res.data.message); // Ketuk palu keberhasilan pendaftaran
      }
    } catch (err) {
      console.error("Gagal menambah reservasi:", err);
      let errMsg = err.response?.data?.message || err.message || "Gagal menambah reservasi";
      
      // Jika ada rincian isian yang kurang lengkap, kurir membacakan alasannya
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        const errorDetails = Object.values(validationErrors).flat().join(", ");
        errMsg += ` (${errorDetails})`;
      }
      
      setError(errMsg);
      if (onError) onError(errMsg, validationErrors); // Sampaikan teguran kepada mandor
    } finally {
      setIsSubmitting(false); // Matikan lampu tanda kurir berangkat
    }
  };

  // Kurir menyerahkan sepeda dan rambu pengiriman kepada mandor
  return {
    tambahReservasi,
    isSubmitting,
    error,
  };
}

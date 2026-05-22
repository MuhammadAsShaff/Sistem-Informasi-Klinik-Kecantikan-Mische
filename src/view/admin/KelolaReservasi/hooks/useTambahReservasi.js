import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useTambahReservasi(onSuccess, onError) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const tambahReservasi = async (payload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // NOTE: Endpoint POST /api/admin/reservations saat ini belum ada di backend.
      // Pastikan backend dikembangkan agar menerima endpoint ini!
      const res = await axiosClient.post(endpoints.admin.reservations, payload);
      
      if (res.data?.success) {
        if (onSuccess) onSuccess(res.data.message);
      }
    } catch (err) {
      console.error("Gagal menambah reservasi:", err);
      let errMsg = err.response?.data?.message || err.message || "Gagal menambah reservasi";
      
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        const errorDetails = Object.values(validationErrors).flat().join(", ");
        errMsg += ` (${errorDetails})`;
      }
      
      setError(errMsg);
      if (onError) onError(errMsg, validationErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    tambahReservasi,
    isSubmitting,
    error,
  };
}

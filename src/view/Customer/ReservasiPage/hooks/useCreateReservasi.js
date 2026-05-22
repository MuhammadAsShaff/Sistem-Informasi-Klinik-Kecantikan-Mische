import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useCreateReservasi() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const createReservasi = async (payload, onSuccess, onError) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await axiosClient.post(endpoints.customer.reservations, payload);
      if (res.data.success) {
        if (onSuccess) onSuccess(res.data.message);
      }
    } catch (err) {
      console.error("Gagal membuat reservasi:", err);
      let errMsg = "Terjadi kesalahan saat memproses reservasi.";
      if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      }
      if (err.response?.data?.errors) {
        errMsg = Object.values(err.response.data.errors).flat().join(" ");
      }
      setError(errMsg);
      if (onError) onError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createReservasi,
    isSubmitting,
    error,
  };
}

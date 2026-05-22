import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useUbahStatusReservasi(selectedReservasi, onSuccess, isOpen) {
  const [status, setStatus] = useState("Menunggu");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Sync state dengan modal terbuka
  useEffect(() => {
    if (isOpen && selectedReservasi) {
      setStatus(selectedReservasi.status || "Menunggu");
      setError(null);
    }
  }, [isOpen, selectedReservasi]);

  const submitStatus = async (e) => {
    if (e) e.preventDefault();
    if (!selectedReservasi) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const id = selectedReservasi.idReservasi || selectedReservasi.id;
      // Gunakan PATCH sesuai API di ReservasiController
      await axiosClient.patch(`${endpoints.admin.reservations}/${id}`, {
        status: status
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Gagal mengubah status:", err);
      let errMsg = "Terjadi kesalahan saat mengubah status.";
      if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      }
      if (err.response?.data?.errors) {
        errMsg = Object.values(err.response.data.errors).flat().join(" ");
      }
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    status,
    setStatus,
    submitStatus,
    isSubmitting,
    error,
  };
}

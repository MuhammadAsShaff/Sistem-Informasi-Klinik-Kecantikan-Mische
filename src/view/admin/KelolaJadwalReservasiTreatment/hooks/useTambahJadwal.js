import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import dayjs from "dayjs";

/**
 * Hook untuk mengelola form tambah jadwal baru (CREATE).
 * Termasuk: state jam, validasi operasional, fetch data klinik, dan submit.
 *
 * @param {Array}    existingSchedules - Jadwal yang sudah ada (untuk blokir overlap)
 * @param {Function} onSuccess         - Callback setelah berhasil tambah
 * @param {boolean}  isOpen            - Status modal (untuk trigger fetch klinik)
 */
export function useTambahJadwal(existingSchedules = [], onSuccess, isOpen) {
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clinicData, setClinicData] = useState(null);

  // Fetch data klinik (jam operasional) setiap kali modal dibuka
  useEffect(() => {
    if (isOpen) {
      fetchClinicData();
      // Reset form saat modal dibuka
      setJamMulai("");
      setJamSelesai("");
      setErrorMessage("");
    }
  }, [isOpen]);

  const fetchClinicData = async () => {
    try {
      const res = await axiosClient.get(endpoints.admin.clinic);
      if (res.data.success && res.data.data) {
        setClinicData(res.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data klinik:", error);
    }
  };

  // ─── Utilitas Waktu ────────────────────────────────────────────
  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(":");
    return dayjs().set("hour", parseInt(h)).set("minute", parseInt(m)).set("second", 0);
  };

  const parseToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(":");
    return parseInt(h) * 60 + parseInt(m);
  };

  // ─── Computed: Batas Waktu TimePicker ──────────────────────────
  const minOperasional = parseTime(clinicData?.jamBuka);
  const maxOperasional = parseTime(clinicData?.jamTutup);
  const minJamSelesai = jamMulai ? parseTime(jamMulai).add(1, "minute") : minOperasional;
  const maxJamMulai = jamSelesai ? parseTime(jamSelesai).subtract(1, "minute") : maxOperasional;

  // ─── Disable Logik TimePicker ──────────────────────────────────
  const shouldDisableJamMulai = (timeValue, clockType) => {
    const h = timeValue.hour();
    const opBuka = parseToMinutes(clinicData?.jamBuka);
    const opTutup = parseToMinutes(clinicData?.jamTutup);
    if (clockType === "hours") {
      if (opBuka !== null && h * 60 + 59 < opBuka) return true;
      if (opTutup !== null && h * 60 > opTutup) return true;
      return false;
    }
    const t = h * 60 + timeValue.minute();
    if (opBuka !== null && t < opBuka) return true;
    if (opTutup !== null && t > opTutup) return true;
    for (const s of existingSchedules) {
      const start = parseToMinutes(s.jamMulai);
      const end = parseToMinutes(s.jamSelesai);
      if (t >= start && t < end) return true;
    }
    return false;
  };

  const shouldDisableJamSelesai = (timeValue, clockType) => {
    const h = timeValue.hour();
    const opBuka = parseToMinutes(clinicData?.jamBuka);
    const opTutup = parseToMinutes(clinicData?.jamTutup);
    if (clockType === "hours") {
      if (opBuka !== null && h * 60 + 59 < opBuka) return true;
      if (opTutup !== null && h * 60 > opTutup) return true;
      return false;
    }
    const t = h * 60 + timeValue.minute();
    if (opBuka !== null && t < opBuka) return true;
    if (opTutup !== null && t > opTutup) return true;
    for (const s of existingSchedules) {
      const start = parseToMinutes(s.jamMulai);
      const end = parseToMinutes(s.jamSelesai);
      if (t > start && t <= end) return true;
    }
    return false;
  };

  // ─── Submit ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setErrorMessage("");

    if (!jamMulai || !jamSelesai) {
      setErrorMessage("Harap isi jam mulai dan jam selesai!");
      return;
    }
    if (jamMulai >= jamSelesai) {
      setErrorMessage("Jam Selesai harus lebih lambat dari Jam Mulai!");
      return;
    }
    if (clinicData) {
      const b = clinicData.jamBuka?.substring(0, 5) ?? null;
      const t = clinicData.jamTutup?.substring(0, 5) ?? null;
      if (b && jamMulai < b) {
        setErrorMessage(`Jam Mulai tidak boleh lebih awal dari jam operasional buka (${b})`);
        return;
      }
      if (t && jamSelesai > t) {
        setErrorMessage(`Jam Selesai tidak boleh lebih lambat dari jam operasional tutup (${t})`);
        return;
      }
    }

    try {
      setIsLoading(true);
      const res = await axiosClient.post(endpoints.admin.schedules, { jamMulai, jamSelesai });
      if (res.data.success) {
        setJamMulai("");
        setJamSelesai("");
        onSuccess && onSuccess();
      }
    } catch (error) {
      let msg = "Gagal menambahkan jadwal.";
      if (error.response?.data?.errors) {
        msg = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    jamMulai,
    setJamMulai,
    jamSelesai,
    setJamSelesai,
    isLoading,
    errorMessage,
    clinicData,
    minOperasional,
    maxOperasional,
    minJamSelesai,
    maxJamMulai,
    shouldDisableJamMulai,
    shouldDisableJamSelesai,
    handleSubmit,
  };
}

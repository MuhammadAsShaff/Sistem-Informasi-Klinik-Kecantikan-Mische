import { useState, useEffect } from "react";
// Mengimpor pengantar data ke komputer server pusat
import axiosClient from "@/core/api/axiosClient";
// Mengimpor daftar alamat tujuan di server
import { endpoints } from "@/core/api/endpoints";
// Mengimpor alat pembantu pengaturan jam dan waktu
import dayjs from "dayjs";

/**
 * =========================================================================
 * PENGATUR TAMBAH JADWAL BARU (Ibarat Petugas Pendaftaran Jadwal Baru)
 * =========================================================================
 * File ini ibarat "Petugas Pendaftaran Jadwal Baru" di klinik Mische.
 * Tugas utamanya: Membersihkan kotak isian saat pop-up dibuka, memeriksa 
 * jam operasional klinik, serta memastikan jadwal baru yang dibuat tidak 
 * bertabrakan dengan jadwal dokter yang sudah ada.
 *
 * @param {Array}    existingSchedules - Daftar seluruh jadwal saat ini untuk mencegah tabrakan jam
 * @param {Function} onSuccess         - Perintah penutup pop-up jika jadwal sukses disimpan
 * @param {boolean}  isOpen            - Penanda apakah kotak pop-up sedang terbuka atau tertutup
 */
export function useTambahJadwal(existingSchedules = [], onSuccess, isOpen) {
  // =========================================================================
  // KOTAK ISIAN PETUGAS PENDAFTARAN
  // =========================================================================
  // Kotak untuk menyimpan isian Jam Mulai
  const [jamMulai, setJamMulai] = useState("");
  // Kotak untuk menyimpan isian Jam Selesai
  const [jamSelesai, setJamSelesai] = useState("");
  // Penanda proses loading saat sistem sedang menyimpan data ke server
  const [isLoading, setIsLoading] = useState(false);
  // Kotak pesan peringatan jika terjadi kesalahan isian atau jam bertabrakan
  const [errorMessage, setErrorMessage] = useState("");
  // Catatan resmi jam buka dan tutup klinik
  const [clinicData, setClinicData] = useState(null);

  // =========================================================================
  // PEMBERSIHAN KOTAK ISIAN & PENGECEKAN JAM OPERASIONAL
  // =========================================================================
  /**
   * Begitu kotak pop-up pendaftaran dibuka (isOpen = true), petugas langsung meminta 
   * data ke server untuk mengecek jam buka-tutup klinik hari ini.
   * Sekaligus, petugas membersihkan seluruh sisa tulisan dari pendaftaran sebelumnya.
   */
  useEffect(() => {
    if (isOpen) {
      fetchClinicData(); // Meminta informasi jam operasional klinik
      // Bersihkan kotak isian dari sisa tulisan sebelumnya
      setJamMulai("");
      setJamSelesai("");
      setErrorMessage("");
    }
  }, [isOpen]);

  const fetchClinicData = async () => {
    try {
      const res = await axiosClient.get(endpoints.admin.clinic);
      if (res.data.success && res.data.data) {
        setClinicData(res.data.data); // Menyimpan data jam operasional klinik
      }
    } catch (error) {
      console.error("Gagal mengambil data klinik:", error);
    }
  };

  // =========================================================================
  // FUNGSI BANTU PENGHITUNG WAKTU
  // =========================================================================
  /**
   * Mengubah teks tulisan jam (misal '08:00') menjadi format waktu khusus agar bisa dihitung sistem.
   */
  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(":");
    return dayjs().set("hour", parseInt(h)).set("minute", parseInt(m)).set("second", 0);
  };

  /**
   * MENGHITUNG TOTAL MENIT DIHITUNG DARI TENGAH MALAM
   * Jam 01:00 dihitung jadi 60 menit. Jam 02:30 dihitung jadi 150 menit.
   * Ini mempermudah sistem komputer mendeteksi jadwal yang bertabrakan.
   */
  const parseToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(":");
    return parseInt(h) * 60 + parseInt(m);
  };

  // =========================================================================
  // PEMBATAS JAM OPERASIONAL KLINIK
  // =========================================================================
  // Batas jam paling pagi (jam buka klinik)
  const minOperasional = parseTime(clinicData?.jamBuka);
  // Batas jam paling malam (jam tutup klinik)
  const maxOperasional = parseTime(clinicData?.jamTutup);
  // Jam Selesai harus dipastikan minimal 1 menit setelah Jam Mulai
  const minJamSelesai = jamMulai ? parseTime(jamMulai).add(1, "minute") : minOperasional;
  // Jam Mulai harus dipastikan minimal 1 menit sebelum Jam Selesai
  const maxJamMulai = jamSelesai ? parseTime(jamSelesai).subtract(1, "minute") : maxOperasional;

  // =========================================================================
  // PENCEGAH TABRAKAN JADWAL (PENGUNCI JAM PILIHAN)
  // =========================================================================
  /**
   * Fungsi ini memantau pilihan Jam Mulai yang sedang dipilih admin.
   * Jika pilihannya keluar dari jam operasional atau bertabrakan dengan jadwal dokter lain, 
   * maka jam tersebut otomatis dikunci / dinonaktifkan (return true).
   */
  const shouldDisableJamMulai = (timeValue, clockType) => {
    const h = timeValue.hour();
    const opBuka = parseToMinutes(clinicData?.jamBuka);
    const opTutup = parseToMinutes(clinicData?.jamTutup);
    
    // Pemeriksaan awal saat admin memilih angka jam utama
    if (clockType === "hours") {
      if (opBuka !== null && h * 60 + 59 < opBuka) return true; // Kunci jika di bawah jam buka
      if (opTutup !== null && h * 60 > opTutup) return true; // Kunci jika di atas jam tutup
      return false;
    }
    
    // Pemeriksaan rinci saat admin memilih menit
    const t = h * 60 + timeValue.minute();
    if (opBuka !== null && t < opBuka) return true;
    if (opTutup !== null && t > opTutup) return true;
    
    // Mengecek satu per satu jadwal yang sudah ada di tabel (existingSchedules)
    for (const s of existingSchedules) {
      const start = parseToMinutes(s.jamMulai);
      const end = parseToMinutes(s.jamSelesai);
      
      // Jika menit pilihan admin berada tepat di tengah-tengah jadwal lain, KUNCI!
      if (t >= start && t < end) return true;
    }
    return false; // Aman, jangan dikunci
  };

  /**
   * Fungsi pencegah tabrakan untuk Jam Selesai. Tugasnya sama, menjaga agar batas akhir 
   * jadwal tidak menabrak jadwal dokter lainnya.
   */
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
      
      // Jika jam selesai memotong rentang waktu jadwal lain, KUNCI!
      if (t > start && t <= end) return true;
    }
    return false;
  };

  // =========================================================================
  // MENGIRIM JADWAL BARU KE SERVER (TOMBOL SIMPAN)
  // =========================================================================
  const handleSubmit = async () => {
    setErrorMessage(""); // Bersihkan pesan kesalahan lama

    // PEMERIKSAAN 1: Pastikan kotak jam mulai dan jam selesai tidak kosong
    if (!jamMulai || !jamSelesai) {
      setErrorMessage("Harap isi jam mulai dan jam selesai!");
      return;
    }
    
    // PEMERIKSAAN 2: Pastikan Jam Mulai lebih awal dari Jam Selesai
    if (jamMulai >= jamSelesai) {
      setErrorMessage("Jam Selesai harus lebih lambat dari Jam Mulai!");
      return;
    }
    
    // PEMERIKSAAN 3: Memastikan jam tidak melewati batas buka dan tutup klinik
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

    // --- PROSES MENYIMPAN KE SERVER PUSAT ---
    try {
      setIsLoading(true); // Nyalakan status loading
      
      // Mengirimkan data jadwal baru (POST) ke komputer server pusat
      const res = await axiosClient.post(endpoints.admin.schedules, { jamMulai, jamSelesai });
      
      // Jika server menjawab berhasil (status success), bersihkan kotak isian dan jalankan perintah sukses
      if (res.data.success) {
        setJamMulai("");
        setJamSelesai("");
        onSuccess && onSuccess();
      }
    } catch (error) {
      // Jika server menolak (misal terjadi kendala jaringan), ambil alasannya dan tampilkan
      let msg = "Gagal menambahkan jadwal.";
      if (error.response?.data?.errors) {
        msg = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false); // Matikan status loading
    }
  };

  // =========================================================================
  // MEMBERIKAN DATA DAN FUNGSI KE KOTAK POP-UP TAMBAH JADWAL
  // =========================================================================
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

import { useState, useEffect } from "react";
// Mengimpor kurir terpercaya pembawa pesan ke server
import axiosClient from "@/core/api/axiosClient";
// Mengimpor peta rute resmi ke markas backend
import { endpoints } from "@/core/api/endpoints";
// Mengimpor alat pemintal waktu canggih
import dayjs from "dayjs";

/**
 * =========================================================================
 * ASISTEN INSPEKTUR AHLI BONGKAR & PERBAIKI JADWAL (useEditJadwal)
 * =========================================================================
 * Bayangkan file ini sebagai "Asisten Inspektur Khusus" yang bertugas merevisi jadwal lama.
 * Tugas utamanya: Membuka berkas jadwal lama yang ingin diotak-atik, mencocokkannya 
 * dengan plang jam buka-tutup klinik, serta menyalakan sistem keamanan ketat 
 * agar jadwal baru yang diubah tidak bentrok dengan jadwal dokter lainnya.
 *
 * @param {Object|null} jadwalData        - Kertas berkas jadwal lama yang ditunjuk admin
 * @param {Array}       existingSchedules - Daftar seluruh jadwal lain di papan tulis (untuk mencegah tabrakan)
 * @param {Function}    onSuccess         - Tombol lonceng perayaan JIKA update berhasil
 * @param {boolean}     isOpen            - Status pintu ruang rapat (modal terbuka atau tertutup)
 */
export function useEditJadwal(jadwalData, existingSchedules = [], onSuccess, isOpen) {
  // =========================================================================
  // LACI-LACI CATATAN DI MEJA INSPEKTUR (STATE)
  // =========================================================================
  // Laci untuk menuliskan Jam Mulai baru
  const [jamMulai, setJamMulai] = useState("");
  // Laci untuk menuliskan Jam Selesai baru
  const [jamSelesai, setJamSelesai] = useState("");
  // Rambu tanda asisten sedang sibuk menggedor server (loading)
  const [isLoading, setIsLoading] = useState(false);
  // Papan keluhan merah JIKA terjadi kesalahan isi
  const [errorMessage, setErrorMessage] = useState("");
  // Buku tata tertib jam operasional klinik (jam buka & tutup resmi)
  const [clinicData, setClinicData] = useState(null);

  // =========================================================================
  // TUGAS PENYALIN BERKAS LAMA (POPULATE FORM)
  // =========================================================================
  /**
   * Begitu admin menyodorkan berkas lama (jadwalData), asisten langsung menyalin 
   * angka jam mulai dan selesainya ke atas meja kerja (substring 5 karakter 'HH:mm'), 
   * dan menyapu bersih seluruh papan keluhan merah.
   */
  useEffect(() => {
    if (jadwalData) {
      setJamMulai(jadwalData.jamMulai ? jadwalData.jamMulai.substring(0, 5) : "");
      setJamSelesai(jadwalData.jamSelesai ? jadwalData.jamSelesai.substring(0, 5) : "");
      setErrorMessage("");
    }
  }, [jadwalData]);

  // =========================================================================
  // PEMERIKSAAN PLANG OPERASIONAL KLINIK
  // =========================================================================
  /**
   * Begitu pintu ruang rapat dibuka (isOpen = true), asisten langsung menyuruh kurir 
   * melongok ke server untuk mencatat jam buka dan jam tutup klinik Mische hari ini.
   */
  useEffect(() => {
    if (isOpen) {
      fetchClinicData();
    }
  }, [isOpen]);

  const fetchClinicData = async () => {
    try {
      const res = await axiosClient.get(endpoints.admin.clinic);
      if (res.data.success && res.data.data) {
        setClinicData(res.data.data); // Simpan buku tata tertib di laci clinicData
      }
    } catch (error) {
      console.error("Gagal mengambil data klinik:", error);
    }
  };

  // =========================================================================
  // KALKULATOR PENERJEMAH WAKTU (UTILITIES)
  // =========================================================================
  /**
   * Mengubah teks tulisan jam (misal '08:00') menjadi objek mesin waktu dayjs.
   */
  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(":");
    return dayjs().set("hour", parseInt(h)).set("minute", parseInt(m)).set("second", 0);
  };

  /**
   * MENGHITUNG KESELURUHAN MENIT DARI TENGAH MALAM
   * Jam 01:00 disulap jadi 60 menit. Jam 02:30 disulap jadi 150 menit.
   * Ini adalah trik jenius agar mesin satpam mudah menghitung siapa yang bentrok!
   */
  const parseToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(":");
    return parseInt(h) * 60 + parseInt(m);
  };

  // =========================================================================
  // BATAS PAGAR MASA OPERASIONAL (COMPUTED TIMEPICKER BOUNDS)
  // =========================================================================
  // Pagar paling pagi (jam buka klinik)
  const minOperasional = parseTime(clinicData?.jamBuka);
  // Pagar paling malam (jam tutup klinik)
  const maxOperasional = parseTime(clinicData?.jamTutup);
  // Jam Selesai harus minimal 1 menit setelah Jam Mulai
  const minJamSelesai = jamMulai ? parseTime(jamMulai).add(1, "minute") : minOperasional;
  // Jam Mulai harus minimal 1 menit sebelum Jam Selesai
  const maxJamMulai = jamSelesai ? parseTime(jamSelesai).subtract(1, "minute") : maxOperasional;

  // =========================================================================
  // POLISI PENJAGA GEMBOK WAKTU (DISABLE LOGIC TIMEPICKER)
  // =========================================================================
  /**
   * Polisi ini mengawasi jarum jam yang sedang diputar admin.
   * JIKA jarum menunjuk ke luar jam operasional, atau menabrak jadwal orang lain, 
   * polisi langsung menggembok jarum jam tersebut (return true)!
   */
  const shouldDisableJamMulai = (timeValue, clockType) => {
    const h = timeValue.hour();
    const opBuka = parseToMinutes(clinicData?.jamBuka);
    const opTutup = parseToMinutes(clinicData?.jamTutup);
    
    // Pemeriksaan cepat saat admin baru memilih angka Jam (Hours)
    if (clockType === "hours") {
      if (opBuka !== null && h * 60 + 59 < opBuka) return true; // Gembok jika di bawah jam buka
      if (opTutup !== null && h * 60 > opTutup) return true; // Gembok jika di atas jam tutup
      return false;
    }
    
    // Pemeriksaan jeli saat admin memilih Menit (Minutes)
    const t = h * 60 + timeValue.minute();
    if (opBuka !== null && t < opBuka) return true;
    if (opTutup !== null && t > opTutup) return true;
    
    // Polisi berkeliling mengecek satu per satu jadwal di papan tulis (existingSchedules)
    for (const s of existingSchedules) {
      /*
        ATURAN PENGECUALIAN DIRI SENDIRI:
        Inspektur kita sangat pintar! JIKA jadwal yang diperiksa di papan tulis ternyata 
        adalah jadwal yang sedang kita revisi saat ini, LEWATI (continue)! 
        Jangan biarkan jadwal kita berantem dengan bayangannya sendiri.
      */
      if (jadwalData && (s.idJadwal === jadwalData.idJadwal || s.id === jadwalData.id)) continue;
      
      const start = parseToMinutes(s.jamMulai);
      const end = parseToMinutes(s.jamSelesai);
      
      // JIKA menit pilihan admin berada tepat di tengah-tengah jadwal orang lain, GEMBOK!
      if (t >= start && t < end) return true;
    }
    return false; // Aman, buka gembok
  };

  /**
   * Satpam penjaga putaran Jam Selesai. Aturannya persis sama dengan satpam Jam Mulai, 
   * memastikan waktu selesai tidak melompati pagar tetangga.
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
      if (jadwalData && (s.idJadwal === jadwalData.idJadwal || s.id === jadwalData.id)) continue;
      const start = parseToMinutes(s.jamMulai);
      const end = parseToMinutes(s.jamSelesai);
      
      // JIKA jam selesai menabrak batas tengah jadwal lain, GEMBOK!
      if (t > start && t <= end) return true;
    }
    return false;
  };

  // =========================================================================
  // MENGGEDOR PINTU SERVER & MELAPORKAN REVISI (SUBMIT)
  // =========================================================================
  const handleSubmit = async () => {
    setErrorMessage(""); // Bersihkan keluhan lama

    // SATPAM 1: Periksa apakah laci jam mulai atau selesai ada yang kosong
    if (!jamMulai || !jamSelesai) {
      setErrorMessage("Harap isi jam mulai dan jam selesai!");
      return;
    }
    
    // SATPAM 2: Pastikan Jam Mulai tidak mendahului Jam Selesai (Hukum Alam Waktu!)
    if (jamMulai >= jamSelesai) {
      setErrorMessage("Jam Selesai harus lebih lambat dari Jam Mulai!");
      return;
    }
    
    // SATPAM 3: Pemeriksaan ulang dengan buku operasional klinik
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

    // --- PROSES PENGIRIMAN SURAT REVISI KE SERVER ---
    try {
      setIsLoading(true); // Nyalakan rambu sibuk
      const idJadwal = jadwalData?.idJadwal || jadwalData?.id;
      
      // Menyuruh kurir membawa surat ubah (PUT) ke markas server
      const res = await axiosClient.put(`${endpoints.admin.schedules}/${idJadwal}`, {
        jamMulai,
        jamSelesai,
      });
      
      // JIKA markas menyetujui (success), bunyikan lonceng perayaan (onSuccess)
      if (res.data.success) {
        onSuccess && onSuccess();
      }
    } catch (error) {
      // JIKA kurir dibanting server, tangkap surat penolakannya dan pajang di papan merah
      let msg = "Gagal memperbarui jadwal.";
      if (error.response?.data?.errors) {
        msg = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false); // Matikan rambu sibuk
    }
  };

  // =========================================================================
  // MENYERAHKAN PERBEKALAN KE MODAL EDIT JADWAL
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

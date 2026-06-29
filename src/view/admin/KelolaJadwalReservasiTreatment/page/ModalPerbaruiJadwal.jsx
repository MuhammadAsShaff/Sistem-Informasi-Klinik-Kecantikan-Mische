import React from "react";
// Mengimpor ikon silang penutup kotak (X)
import { X } from "lucide-react";
// Mengimpor pembungkus kalender standar
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// Mengimpor aturan waktu dayjs
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// Mengimpor kotak pemilih jam (TimePicker)
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// Mengimpor penampil wujud jam dinding bulat
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";

/**
 * =========================================================================
 * KOTAK POP-UP PERBARUI JADWAL (Ibarat Formulir Edit Jadwal di Toko)
 * =========================================================================
 * File ini ibarat "Formulir Ubah Jadwal" dengan latar belakang transparan buram.
 * Di sinilah data jadwal lama ditampilkan di dalam kotak pemilih jam, 
 * siap untuk diubah oleh admin ke jam yang baru.
 */
export default function ModalPerbaruiJadwal({ isOpen, onClose, hook }) {
  // Mengambil kotak isian jam, status loading, pesan peringatan, serta pembatas jam dari pengatur ubah jadwal
  const {
    jamMulai, setJamMulai,
    jamSelesai, setJamSelesai,
    isLoading,
    errorMessage,
    minOperasional,
    maxOperasional,
    minJamSelesai,
    maxJamMulai,
    shouldDisableJamMulai,
    shouldDisableJamSelesai,
    handleSubmit,
  } = hook;

  // Jika pop-up belum dibuka (isOpen = false), sembunyikan kotak ini
  if (!isOpen) return null;

  /*
    PENGATUR TAMPILAN KOTAK JAM (timePickerSx):
    Membuat latar belakang kotak pemilih jam menjadi putih bersih dengan bingkai melengkung (0.75rem).
  */
  const timePickerSx = {
    backgroundColor: "white",
    borderRadius: "0.75rem",
    "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
  };

  return (
    /*
      LATAR BELAKANG TRANSPARAN BURAM (bg-black/40 backdrop-blur-sm):
      Menutupi layar utama dengan efek buram agar admin fokus pada kotak formulir di tengah layar.
    */
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      
      {/* KOTAK FORMULIR PUTIH: Muncul dengan efek membesar halus (zoom-in duration-300) */}
      <div className="bg-white w-full max-w-[900px] rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">

        {/* ========================================================================= */}
        {/* BAGIAN ATAS (HEADER) */}
        {/* ========================================================================= */}
        <div className="px-10 py-8 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Perbarui Jadwal</h2>
          {/* TOMBOL SILANG (X): Jika ditekan, tutup pop-up (`onClose`) */}
          <button onClick={onClose} disabled={isLoading} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* KOTAK PESAN PERINGATAN (ERROR MESSAGE) */}
        {/* ========================================================================= */}
        {/* Jika ada pesan kesalahan (misal jam terbalik atau di luar jam operasional), tampilkan kotak merah */}
        {errorMessage && (
          <div className="mx-10 mt-6 bg-red-50 text-red-500 text-sm p-3 rounded-xl font-medium border border-red-100">
            {errorMessage}
          </div>
        )}

        {/* ========================================================================= */}
        {/* BAGIAN TENGAH: KOTAK ISIAN JAM (FORM BODY) */}
        {/* ========================================================================= */}
        <div className="px-10 py-8">
          {/* PEMBUNGKUS ATURAN KALENDER DAN WAKTU (LocalizationProvider) */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-10">

              {/* --- BAGIAN KIRI: PEMILIH JAM MULAI --- */}
              <div className="flex flex-col gap-2.5">
                <label className="text-sm font-bold text-[#1A1A1A]">
                  Jam Mulai <span className="text-red-500">*</span>
                </label>
                <TimePicker
                  ampm={false} // Menggunakan format 24 Jam (tanpa AM/PM)
                  viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock, seconds: renderTimeViewClock }}
                  minTime={minOperasional} // Batas paling pagi klinik
                  maxTime={maxJamMulai}    // Batas maksimal sebelum Jam Selesai
                  shouldDisableTime={shouldDisableJamMulai} // Fungsi pencegah tabrakan jam
                  value={jamMulai ? dayjs(`2024-01-01T${jamMulai}`) : null}
                  onChange={(val) => setJamMulai(val ? val.format("HH:mm") : "")}
                  slotProps={{ textField: { size: "medium", fullWidth: true, sx: timePickerSx } }}
                />
                {!jamMulai && <p className="text-[11px] text-red-500">* Wajib diisi</p>}
              </div>

              {/* --- BAGIAN KANAN: PEMILIH JAM SELESAI --- */}
              <div className="flex flex-col gap-2.5">
                <label className="text-sm font-bold text-[#1A1A1A]">
                  Jam Selesai <span className="text-red-500">*</span>
                </label>
                <TimePicker
                  ampm={false} // Format 24 Jam
                  viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock, seconds: renderTimeViewClock }}
                  minTime={minJamSelesai} // Batas minimal setelah Jam Mulai
                  maxTime={maxOperasional} // Batas paling malam klinik
                  shouldDisableTime={shouldDisableJamSelesai} // Fungsi pencegah tabrakan jam
                  value={jamSelesai ? dayjs(`2024-01-01T${jamSelesai}`) : null}
                  onChange={(val) => setJamSelesai(val ? val.format("HH:mm") : "")}
                  slotProps={{ textField: { size: "medium", fullWidth: true, sx: timePickerSx } }}
                />
                {!jamSelesai && <p className="text-[11px] text-red-500">* Wajib diisi</p>}
              </div>

            </div>
          </LocalizationProvider>

          {/* ========================================================================= */}
          {/* BAGIAN BAWAH: TOMBOL SIMPAN (FOOTER ACTION) */}
          {/* ========================================================================= */}
          <div className="flex justify-end pt-8 border-t border-gray-100">
            {/* 
              TOMBOL HIJAU PERBARUI JADWAL: 
              Jika sistem sedang menyimpan (isLoading) ATAU kotak jam masih kosong, tombol terkunci (opacity-50 cursor-not-allowed).
              Jika semua terisi benar, tombol siap ditekan untuk menyimpan (`handleSubmit`).
            */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !jamMulai || !jamSelesai}
              className={`bg-[#7CC052] text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-[#68a741] transition-all shadow-lg shadow-green-100 ${
                isLoading || !jamMulai || !jamSelesai ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Menyimpan..." : "Perbarui Jadwal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { X } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";

/**
 * Modal untuk menambah jadwal baru.
 * Semua logic (state, validasi, submit) dikelola oleh hook `useTambahJadwal`
 * yang dipass lewat prop `hook`.
 */
export default function ModalTambahJadwal({ isOpen, onClose, hook }) {
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

  if (!isOpen) return null;

  const timePickerSx = {
    backgroundColor: "white",
    borderRadius: "0.75rem",
    "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[900px] rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">

        {/* HEADER */}
        <div className="px-10 py-8 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Tambah Jadwal</h2>
          <button onClick={onClose} disabled={isLoading} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="mx-10 mt-6 bg-red-50 text-red-500 text-sm p-3 rounded-xl font-medium border border-red-100">
            {errorMessage}
          </div>
        )}

        {/* FORM BODY */}
        <div className="px-10 py-8">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-10">

              {/* Jam Mulai */}
              <div className="flex flex-col gap-2.5">
                <label className="text-sm font-bold text-[#1A1A1A]">
                  Jam Mulai <span className="text-red-500">*</span>
                </label>
                <TimePicker
                  ampm={false}
                  viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock, seconds: renderTimeViewClock }}
                  minTime={minOperasional}
                  maxTime={maxJamMulai}
                  shouldDisableTime={shouldDisableJamMulai}
                  value={jamMulai ? dayjs(`2024-01-01T${jamMulai}`) : null}
                  onChange={(val) => setJamMulai(val ? val.format("HH:mm") : "")}
                  slotProps={{ textField: { size: "medium", fullWidth: true, sx: timePickerSx } }}
                />
                {!jamMulai && <p className="text-[11px] text-red-500">* Wajib diisi</p>}
              </div>

              {/* Jam Selesai */}
              <div className="flex flex-col gap-2.5">
                <label className="text-sm font-bold text-[#1A1A1A]">
                  Jam Selesai <span className="text-red-500">*</span>
                </label>
                <TimePicker
                  ampm={false}
                  viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock, seconds: renderTimeViewClock }}
                  minTime={minJamSelesai}
                  maxTime={maxOperasional}
                  shouldDisableTime={shouldDisableJamSelesai}
                  value={jamSelesai ? dayjs(`2024-01-01T${jamSelesai}`) : null}
                  onChange={(val) => setJamSelesai(val ? val.format("HH:mm") : "")}
                  slotProps={{ textField: { size: "medium", fullWidth: true, sx: timePickerSx } }}
                />
                {!jamSelesai && <p className="text-[11px] text-red-500">* Wajib diisi</p>}
              </div>

            </div>
          </LocalizationProvider>

          {/* FOOTER ACTION */}
          <div className="flex justify-end pt-8 border-t border-gray-100">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !jamMulai || !jamSelesai}
              className={`bg-[#7CC052] text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-[#68a741] transition-all shadow-lg shadow-green-100 ${
                isLoading || !jamMulai || !jamSelesai ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Menyimpan..." : "Tambah Jadwal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

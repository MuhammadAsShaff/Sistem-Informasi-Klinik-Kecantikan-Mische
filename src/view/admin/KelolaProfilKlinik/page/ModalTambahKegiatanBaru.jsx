import React from "react";
import { X } from "lucide-react";

/**
 * BILIK MEJA PENDAFTARAN KEGIATAN BARU (ModalTambahKegiatanBaru)
 * Ibarat meja lipat khusus yang dibuka mandor saat admin menekan tombol "Tambah".
 * Meja ini menyediakan kertas isian kosong untuk mencatat nama acara, tanggal, cerita kegiatan, dan menaruh foto.
 * Segala aturan pena dan timbangan foto diurus tuntas oleh Asisten Juru Tulis Pendaftaran (useTambahKegiatan).
 */
const ModalTambahKegiatanBaru = ({ isOpen, onClose, hook }) => {
  // Meminta pena, kertas isian, dan laci foto dari Asisten Juru Tulis Pendaftaran
  const {
    formData,
    previewImage,
    isLoading,
    errorMessage,
    hasFileError,
    fileInputRef,
    handleChange,
    handleFileChange,
    handleSubmit,
  } = hook;

  if (!isOpen) return null; // Jika saklar ditutup, meja lipat ini disimpan kembali

  // Gembok pengaman: Tombol kirim terkunci jika ada satu saja kotak isian yang dibiarkan kosong
  const isDisabled =
    isLoading ||
    !formData.namaKegiatan ||
    !formData.deskripsi ||
    !formData.tanggalKegiatan ||
    !formData.foto ||
    hasFileError;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[750px] rounded-[16px] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">

        {/* ATAP BILIK PENDAFTARAN */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-[20px] font-bold text-black">Tambah Kegiatan Baru</h2>
          <button onClick={onClose} disabled={isLoading} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* PAPAN TEGURAN MERAH */}
        {errorMessage && (
          <div className="mx-6 mt-6 bg-red-50 text-red-500 text-sm p-3 rounded-xl font-medium border border-red-100">
            {errorMessage}
          </div>
        )}

        {/* AREA FORMULIR KOSONG PADA MEJA */}
        <div className="p-6 grid grid-cols-12 gap-8">

          {/* Kolom Unggah Foto */}
          <div className="col-span-5 flex flex-col pt-10 pl-4">
            <p className="text-[14px] text-gray-800 mb-6">Unggah Gambar Kegiatan</p>
            <div className="mb-4">
              <div className="w-full h-32 border border-black flex items-center justify-center text-[13px] font-semibold mb-2 bg-gray-100 overflow-hidden">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500">Preview Foto</span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <label className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-5 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer inline-block">
                  Choose File
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                <span className="text-sm text-gray-500 font-medium truncate max-w-[200px]">
                  {formData.foto ? formData.foto.name : "No File Chosen"}
                </span>
              </div>
              <span className="text-[11px] text-red-500 italic mt-2">* Format: JPG/PNG/JPEG. Ukuran maksimal 2MB.</span>
            </div>
          </div>

          {/* Kolom Kotak Isian Teks */}
          <div className="col-span-7 flex flex-col pt-4">
            <div className="mb-5">
              <label className="block text-[14px] text-black mb-2">Nama Kegiatan <span className="text-red-500">*</span></label>
              <input type="text" name="namaKegiatan" value={formData.namaKegiatan} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                placeholder="Nama Kegiatan" />
              {!formData.namaKegiatan && <p className="text-[11px] text-red-500 mt-1">* Wajib diisi</p>}
            </div>
            <div className="mb-5">
              <label className="block text-[14px] text-black mb-2">Tanggal Kegiatan <span className="text-red-500">*</span></label>
              <input type="date" name="tanggalKegiatan" value={formData.tanggalKegiatan} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white" />
              {!formData.tanggalKegiatan && <p className="text-[11px] text-red-500 mt-1">* Wajib diisi</p>}
            </div>
            <div className="mb-2">
              <label className="block text-[14px] text-black mb-2">Deskripsi Kegiatan <span className="text-red-500">*</span></label>
              <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white min-h-[120px] resize-none"
                placeholder="Deskripsi Kegiatan" />
              {!formData.deskripsi && <p className="text-[11px] text-red-500 mt-1">* Wajib diisi</p>}
            </div>
          </div>

        </div>

        {/* LACI TOMBOL UTUS KURIR */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button onClick={handleSubmit} disabled={isDisabled}
            className={`bg-[#55BC36] hover:bg-[#46a02b] text-white px-6 py-2.5 rounded-md font-medium text-[14px] transition-colors shadow-sm ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
            {isLoading ? "Menambahkan..." : "Tambah Kegiatan"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ModalTambahKegiatanBaru;

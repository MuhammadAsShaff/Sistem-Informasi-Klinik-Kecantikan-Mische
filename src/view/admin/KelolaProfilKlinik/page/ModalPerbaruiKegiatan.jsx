import React from "react";
import { X } from "lucide-react";

/**
 * Modal untuk memperbarui kegiatan — pure UI.
 * Logic state, fetch detail, validasi file, dan submit dikelola oleh hook `useEditKegiatan`
 * via prop `hook`.
 */
const ModalEditKegiatan = ({ isOpen, onClose, hook }) => {
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

  if (!isOpen) return null;

  const isDisabled =
    isLoading ||
    !formData.namaKegiatan ||
    !formData.deskripsi ||
    !formData.tanggalKegiatan ||
    hasFileError;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[750px] rounded-[16px] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-[20px] font-bold text-black">Perbarui Kegiatan</h2>
          <button onClick={onClose} disabled={isLoading} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div className="mx-6 mt-6 bg-red-50 text-red-500 text-sm p-3 rounded-xl font-medium border border-red-100">
            {errorMessage}
          </div>
        )}

        {/* BODY */}
        <div className="p-6 grid grid-cols-12 gap-8">

          {/* Kolom Foto */}
          <div className="col-span-5 flex flex-col">
            <div className="border border-black h-[180px] w-full flex items-center justify-center text-[15px] font-semibold mb-4 bg-gray-100 overflow-hidden">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500">Foto Kegiatan</span>
              )}
            </div>
            <p className="text-[13px] text-gray-800 text-center mb-4">Ubah Gambar Kegiatan</p>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <label className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-5 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer inline-block">
                  Choose File
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                </label>
                <span className="text-sm text-gray-500 font-medium truncate max-w-[200px]">
                  {formData.foto ? formData.foto.name : "No File Chosen"}
                </span>
              </div>
              <span className="text-[11px] text-red-500 italic mt-2 block">* Format: JPG/PNG/JPEG. Ukuran maksimal 2MB.</span>
            </div>
          </div>

          {/* Kolom Form */}
          <div className="col-span-7 flex flex-col">
            <p className="text-[13px] text-gray-800 mb-6 leading-relaxed">
              Anda dapat memperbarui informasi kegiatan dengan nama, deskripsi, dan gambar. Pastikan untuk memasukkan informasi terbaru agar data selalu akurat.
            </p>
            <div className="mb-4">
              <label className="block text-[14px] text-black mb-2">Nama Kegiatan <span className="text-red-500">*</span></label>
              <input type="text" name="namaKegiatan" value={formData.namaKegiatan} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                placeholder="Nama Kegiatan" />
              {!formData.namaKegiatan && <p className="text-[11px] text-red-500 mt-1">* Wajib diisi</p>}
            </div>
            <div className="mb-4">
              <label className="block text-[14px] text-black mb-2">Tanggal Kegiatan <span className="text-red-500">*</span></label>
              <input type="date" name="tanggalKegiatan" value={formData.tanggalKegiatan} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white" />
              {!formData.tanggalKegiatan && <p className="text-[11px] text-red-500 mt-1">* Wajib diisi</p>}
            </div>
            <div className="mb-2">
              <label className="block text-[14px] text-black mb-2">Deskripsi Kegiatan <span className="text-red-500">*</span></label>
              <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white min-h-[100px] resize-none"
                placeholder="Deskripsi Kegiatan" />
              {!formData.deskripsi && <p className="text-[11px] text-red-500 mt-1">* Wajib diisi</p>}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button onClick={handleSubmit} disabled={isDisabled}
            className={`bg-[#55BC36] hover:bg-[#46a02b] text-white px-6 py-2.5 rounded-md font-medium text-[14px] transition-colors shadow-sm ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ModalEditKegiatan;

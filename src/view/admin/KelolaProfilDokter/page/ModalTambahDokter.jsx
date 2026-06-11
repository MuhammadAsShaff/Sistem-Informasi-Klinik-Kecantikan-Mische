import React, { useRef } from "react";
import { X } from "lucide-react";

export default function ModalTambahDokter({ isOpen, onClose, hook }) {
  const {
    formData,
    error,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    submitTambahDokter,
  } = hook;

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-[800px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-black">Tambah Profil Dokter</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL FORM */}
        <form onSubmit={submitTambahDokter}>
          <div className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 text-xs font-semibold px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* KOLOM KIRI */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Nama Dokter
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nama Dokter"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7CC052] focus:border-transparent transition-all placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Deskripsi Dokter
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Deskripsi Dokter"
                    rows={6}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7CC052] focus:border-transparent transition-all resize-none placeholder-gray-400"
                  />
                </div>
              </div>

              {/* KOLOM KANAN */}
              <div className="space-y-5 flex flex-col">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7CC052] focus:border-transparent transition-all placeholder-gray-400"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-start">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Foto Dokter
                  </label>
                  
                  {/* Premium Styled File Input */}
                  <div className="flex items-center gap-3">
                    <label className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-5 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer inline-block">
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <span className="text-sm text-gray-500 font-medium truncate max-w-[200px]">
                      {formData.image ? "Gambar Terpilih" : "No File Chosen"}
                    </span>
                  </div>

                  {formData.image && (
                    <div className="mt-4 w-28 h-28 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                      <img 
                        src={formData.image} 
                        alt="Preview Dokter" 
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* MODAL FOOTER */}
          <div className="px-8 py-5 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#56BC36] hover:bg-[#469e2c] text-white px-6 py-3 rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Menambahkan..." : "Tambah Profil"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

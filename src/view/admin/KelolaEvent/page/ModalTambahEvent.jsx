import { useModalTambahEvent } from '../hooks/useModalTambahEvent';

export default function ModalTambahEvent({ isOpen, onClose, refetch, showToast }) {
  const {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit
  } = useModalTambahEvent(refetch, showToast, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Tambah Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <form id="tambah-event-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Event */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Nama Event</label>
                <input 
                  type="text" 
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Nama Event"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm"
                  required
                />
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Lokasi</label>
                <input 
                  type="text" 
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  placeholder="Lokasi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm"
                  required
                />
              </div>

              {/* Tanggal Mulai */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-800 mb-2">Tanggal Mulai</label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="tanggalMulai"
                    value={formData.tanggalMulai}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm"
                    required
                  />
                </div>
              </div>

              {/* Tanggal Selesai */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-800 mb-2">Tanggal Selesai</label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="tanggalSelesai"
                    value={formData.tanggalSelesai}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm"
                    required
                  />
                </div>
                <p className="text-[11px] text-red-500 italic mt-0.5">* Pastikan tanggal selesai &ge; tanggal mulai</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Foto Event */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Foto Event</label>
                <div className="flex items-center gap-3">
                  <label className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-5 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer inline-block">
                    Choose File
                    <input 
                      type="file" 
                      name="foto"
                      onChange={handleChange}
                      className="sr-only"
                      required
                    />
                  </label>
                  <span className="text-sm text-gray-500 font-medium truncate max-w-[200px]">
                    {formData.foto ? (formData.foto.name || "Gambar Terpilih") : "No File Chosen"}
                  </span>
                </div>
                <p className="text-[11px] text-red-500 italic mt-2">* Format: JPG/PNG/JPEG. Ukuran maksimal 2MB.</p>
              </div>

              {/* Deskripsi Event */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Deskripsi Event</label>
                <textarea 
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  placeholder="Deskripsi Event"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm resize-none"
                  required
                ></textarea>
              </div>
            </div>

            

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button 
            type="submit"
            form="tambah-event-form"
            disabled={isSubmitting}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-[#56BC36] hover:bg-[#45a025] text-white"
            }`}
          >
            {isSubmitting ? "Menyimpan..." : "Tambah Event"}
          </button>
        </div>
      </div>
    </div>
  );
}

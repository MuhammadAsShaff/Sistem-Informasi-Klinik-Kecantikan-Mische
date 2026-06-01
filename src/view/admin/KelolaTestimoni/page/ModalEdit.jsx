import React from "react";

const ModalEdit = ({ isOpen, onClose, onSubmit, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 font-poppins">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Perbarui Kategori Produk</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Unggah Gambar Testimoni</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-[#1e293b] hover:bg-gray-800 text-white px-5 py-2.5 text-sm font-medium rounded transition-colors">
                  Choose File
                  <input type="file" className="hidden" />
                </label>
                <span className="text-sm font-bold text-gray-800">No File Choosen</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Deskripsi Kategori</label>
              <textarea 
                className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-gray-400 min-h-[160px] resize-none"
                placeholder="Deskripsi Kategori"
                defaultValue={data?.deskripsi}
              ></textarea>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Nama Testimoni</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-gray-400"
                placeholder="Nama Testimoni"
                defaultValue={data?.nama}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Tanggal Testimoni</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-gray-400"
                  defaultValue={data?.tanggal}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Jenis Testimoni</label>
              <div className="relative">
                <select className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-gray-400 appearance-none bg-white" defaultValue={data?.jenis || ""}>
                  <option value="" disabled>Pilih Jenis Testimoni</option>
                  <option value="Treatment">Treatment</option>
                  <option value="Produk">Produk</option>
                  <option value="Pelayanan">Pelayanan</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onSubmit}
            className="bg-[#56BC36] hover:bg-[#469e2c] text-white px-6 py-2.5 rounded font-medium transition-colors"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEdit;

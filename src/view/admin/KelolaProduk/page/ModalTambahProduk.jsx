import React from 'react';
import { X, Upload } from 'lucide-react';
import { useModalTambahProduk } from '../hooks/useModalTambahProduk';

const ModalTambahProduk = ({ isOpen, onClose, refetch, showToast }) => {
  const {
    nama, setNama,
    harga, setHarga,
    stock, setStock,
    berat, setBerat,
    kategori, setKategori,
    deskripsi, setDeskripsi,
    gambar,
    preview,
    isSubmitting,
    categories,
    handleImageChange,
    handleSave
  } = useModalTambahProduk(isOpen, refetch, showToast, onClose);

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
          <h2 className="text-xl font-bold text-black">Tambah Produk</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <form id="tambah-produk-form" onSubmit={handleSave} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Produk */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Nama Produk</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama Produk"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm"
                  required
                />
              </div>

              {/* Harga Produk */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Harga Produk</label>
                <input
                  type="number"
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                  placeholder="Harga Produk"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm"
                  required
                />
                <p className="text-[11px] text-red-500 italic mt-1">* Hanya angka, tidak boleh negatif</p>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Stock</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Jumlah Stock"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm"
                  required
                />
                <p className="text-[11px] text-red-500 italic mt-1">* Hanya angka</p>
              </div>

              {/* Berat Produk */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Berat Produk (gram)</label>
                <input
                  type="number"
                  value={berat}
                  onChange={(e) => setBerat(e.target.value)}
                  placeholder="Berat (gram)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm"
                  required
                />
                <p className="text-[11px] text-red-500 italic mt-1">* Hanya angka dalam satuan gram</p>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Kategori</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm bg-white"
                  required
                >
                  <option value="" disabled>Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.idKategori} value={cat.idKategori}>
                      {cat.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gambar Produk */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Gambar Produk (Opsional)</label>
                <div className="flex items-center gap-3">
                  <label htmlFor="produk-gambar-upload" className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-5 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer inline-block">
                    Choose File
                  </label>
                  <input 
                    id="produk-gambar-upload"
                    type="file" 
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                  <span className="text-sm text-gray-500 font-medium truncate max-w-[200px]">
                    {gambar ? (gambar.name || "Gambar Terpilih") : "No File Chosen"}
                  </span>
                </div>
                <p className="text-[11px] text-red-500 italic mt-2">* Format: JPG/PNG/JPEG. Maks 2MB</p>
              </div>
            </div>

            <div className="mt-6">
              {/* Deskripsi Produk */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Deskripsi Produk</label>
                <textarea 
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Deskripsi Produk"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#56BC36] text-sm resize-none"
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            form="tambah-produk-form"
            disabled={isSubmitting}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-[#56BC36] hover:bg-[#45a025] text-white"
              }`}
          >
            {isSubmitting ? "Menyimpan..." : "Tambah Produk"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTambahProduk;

import React from "react";
import { X } from "lucide-react";

export default function ModalPerbaruiPromo({
  isOpen,
  onClose,
  formData,
  handleInputChange,
  submitEditPromo,
  isSubmitting,
  error,
}) {
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
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Perbarui Promo</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form id="perbaruiPromoForm" onSubmit={submitEditPromo} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Kiri */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Nama Promo</label>
                <input
                  type="text"
                  name="namaPromo"
                  value={formData.namaPromo}
                  onChange={handleInputChange}
                  placeholder="Nama Promo"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#56BC36] focus:ring-1 focus:ring-[#56BC36] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Pilih Kategori Produk</label>
                <select
                  name="idKategori"
                  value={formData.idKategori}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#56BC36] focus:ring-1 focus:ring-[#56BC36] transition-colors bg-white"
                >
                  <option value="1">Skincare</option>
                  <option value="2">Treatment</option>
                  <option value="3">Bodycare</option>
                  <option value="4">Haircare</option>
                </select>
                <p className="text-xs text-red-500 mt-1">*Pilih kategori produk bila promo berdasarkan kategori produk</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Tanggal Mulai</label>
                <input
                  type="date"
                  name="tanggalMulai"
                  value={formData.tanggalMulai}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#56BC36] focus:ring-1 focus:ring-[#56BC36] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Minimal Transaksi</label>
                <input
                  type="number"
                  name="minimalTransaksi"
                  value={formData.minimalTransaksi}
                  onChange={handleInputChange}
                  placeholder="Minimal Transaksi"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#56BC36] focus:ring-1 focus:ring-[#56BC36] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Deskripsi Produk</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  placeholder="Deskripsi Produk"
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#56BC36] focus:ring-1 focus:ring-[#56BC36] transition-colors resize-none"
                ></textarea>
              </div>
            </div>

            {/* Kanan */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Jenis Promo</label>
                <select
                  name="jenisPromo"
                  value={formData.jenisPromo}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#56BC36] focus:ring-1 focus:ring-[#56BC36] transition-colors bg-white"
                  required
                >
                  <option value="">Pilih Jenis Promo</option>
                  <option value="Diskon Persen">Diskon Persen</option>
                  <option value="Potongan Harga">Potongan Harga</option>
                  <option value="Gratis Produk">Gratis Produk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Pilih Produk</label>
                <select
                  name="idProduk"
                  value={formData.idProduk}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#56BC36] focus:ring-1 focus:ring-[#56BC36] transition-colors bg-white"
                >
                  <option value="1">Facial Wash</option>
                  <option value="2">Serum Acne</option>
                  <option value="3">Day Cream</option>
                  <option value="4">Sunscreen</option>
                  <option value="5">Laser Treatment</option>
                </select>
                <p className="text-xs text-red-500 mt-1">*Pilih produk bila promo berdasarkan produk</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Tanggal Selesai</label>
                <input
                  type="date"
                  name="tanggalSelesai"
                  value={formData.tanggalSelesai}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#56BC36] focus:ring-1 focus:ring-[#56BC36] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Kode Promo</label>
                <input
                  type="text"
                  name="kode"
                  value={formData.kode}
                  onChange={handleInputChange}
                  placeholder="Kode Promo"
                  maxLength={12}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#56BC36] focus:ring-1 focus:ring-[#56BC36] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Diskon</label>
                <input
                  type="text"
                  name="diskon"
                  value={formData.diskon}
                  onChange={handleInputChange}
                  placeholder="Diskon"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#56BC36] focus:ring-1 focus:ring-[#56BC36] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Gambar Promo Baru (Opsional)</label>
                <div className="flex items-center gap-3">
                  <label className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-5 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer inline-block">
                    Choose File
                    <input
                      type="file"
                      name="gambarBaru"
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                  </label>
                  <span className="text-sm text-gray-500 font-medium truncate max-w-[200px]">
                    {formData.gambarBaru ? (formData.gambarBaru.name || "Gambar Terpilih") : "No File Chosen"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Format: Semua Format Gambar. Max: 4MB.</p>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button
            form="perbaruiPromoForm"
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#56BC36] hover:bg-[#4ea830] active:scale-[0.98]"
            }`}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}

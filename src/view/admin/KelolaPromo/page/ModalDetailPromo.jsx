import React from "react";
import { Calendar } from "lucide-react";

export default function ModalDetailPromo({ isOpen, onClose, promo }) {
  if (!isOpen || !promo) return null;

  const getKategoriName = (id) => {
    switch (String(id)) {
      case "1": return "Skincare";
      case "2": return "Treatment";
      case "3": return "Bodycare";
      case "4": return "Haircare";
      default: return id;
    }
  };

  const getProdukName = (id) => {
    switch (String(id)) {
      case "1": return "Facial Wash";
      case "2": return "Serum Acne";
      case "3": return "Day Cream";
      case "4": return "Sunscreen";
      case "5": return "Laser Treatment";
      default: return id;
    }
  };

  // Ambil ID dari berbagai kemungkinan nama field API (camelCase / snake_case)
  const katId = promo.idKategori || promo.id_kategori || promo.kategori_id;
  const prodId = promo.idProduk || promo.id_produk || promo.produk_id;

  // Cek apakah ada data teks (string) atau ambil nama berdasarkan ID
  const kategori = promo.kategoriProduk || promo.kategori_produk || promo.kategori || (katId ? getKategoriName(katId) : null);
  const produk = promo.produk || promo.namaProduk || promo.nama_produk || (prodId ? getProdukName(prodId) : null);

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
          <h2 className="text-xl font-bold text-black">Detail Promo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Promo */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Nama Promo</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                  {promo.namaPromo || promo.nama || "-"}
                </div>
              </div>

              {/* Jenis Promo */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Jenis Promo</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                  {promo.jenisPromo || "-"}
                </div>
              </div>

              {/* Kode Promo */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Kode Promo</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                  {promo.kode || promo.kodePromo || "-"}
                </div>
              </div>

              {/* Diskon */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Diskon</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                  {promo.diskon || "-"}
                </div>
              </div>

              {/* Tanggal Mulai */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Tanggal Mulai</label>
                <div className="relative">
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm appearance-none">
                    {promo.tanggalMulai ? new Date(promo.tanggalMulai).toLocaleDateString('id-ID') : "-"}
                  </div>
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={20} />
                </div>
              </div>

              {/* Tanggal Selesai */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Tanggal Selesai</label>
                <div className="relative">
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm appearance-none">
                    {promo.tanggalSelesai ? new Date(promo.tanggalSelesai).toLocaleDateString('id-ID') : "-"}
                  </div>
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={20} />
                </div>
              </div>

              {/* Minimal Transaksi */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Minimal Transaksi</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                  {promo.minimalTransaksi ? `Rp ${Number(promo.minimalTransaksi).toLocaleString("id-ID")}` : "-"}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Status</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                  {promo.status || "-"}
                </div>
              </div>

              {/* Kategori / Produk Spesifik (Optional) */}
              {(kategori || produk) && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-800 mb-2">Kategori / Produk Terkait</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                    {kategori ? `Kategori: ${kategori}` : ''}
                    {kategori && produk ? ' | ' : ''}
                    {produk ? `Produk: ${produk}` : ''}
                  </div>
                </div>
              )}
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Deskripsi Promo</label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm whitespace-pre-wrap min-h-[100px]">
                {promo.deskripsi || "-"}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-[#56BC36] hover:bg-[#45a025] text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

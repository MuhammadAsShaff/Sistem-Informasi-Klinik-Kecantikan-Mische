import React from "react";
import { X, Calendar, Tag, CreditCard, Box, Percent, CheckCircle, Info } from "lucide-react";

export default function ModalDetailPromo({ isOpen, onClose, promo }) {
  if (!isOpen || !promo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#56BC36]">
              <Tag size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Detail Promo</h2>
              <p className="text-sm text-gray-500 font-medium">{promo.kodePromo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Kolom Kiri */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-gray-400"><Tag size={18} /></div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nama Promo</p>
                  <p className="text-gray-800 font-medium text-lg">{promo.nama}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-gray-400"><Box size={18} /></div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Jenis Promo</p>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {promo.jenisPromo}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-gray-400"><CreditCard size={18} /></div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Minimal Transaksi</p>
                  <p className="text-gray-800 font-medium">
                    {promo.minimalTransaksi ? `Rp ${Number(promo.minimalTransaksi).toLocaleString("id-ID")}` : "-"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 text-gray-400"><Percent size={18} /></div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Diskon</p>
                  <p className="text-gray-800 font-medium text-lg text-[#56BC36]">{promo.diskon || "-"}</p>
                </div>
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-gray-400"><Calendar size={18} /></div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Periode Promo</p>
                  <p className="text-gray-800 font-medium">
                    {promo.tanggalMulai} <span className="text-gray-400 mx-1">s/d</span> {promo.tanggalSelesai}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-gray-400"><CheckCircle size={18} /></div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                    promo.status === "Aktif" 
                      ? "bg-green-50 text-green-700 border-green-100" 
                      : "bg-red-50 text-red-700 border-red-100"
                  }`}>
                    {promo.status}
                  </span>
                </div>
              </div>

              {(promo.kategoriProduk || promo.produk) && (
                <div className="flex items-start gap-4">
                   <div className="mt-1 text-gray-400"><Box size={18} /></div>
                   <div className="space-y-3">
                     {promo.kategoriProduk && (
                       <div>
                         <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Kategori Produk</p>
                         <p className="text-gray-800 font-medium">{promo.kategoriProduk}</p>
                       </div>
                     )}
                     {promo.produk && (
                       <div>
                         <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Produk Spesifik</p>
                         <p className="text-gray-800 font-medium">{promo.produk}</p>
                       </div>
                     )}
                   </div>
                </div>
              )}

              {/* Deskripsi (Dipindah ke Kanan) */}
              <div className="flex items-start gap-4 pt-2">
                <div className="mt-1 text-gray-400"><Info size={18} /></div>
                <div className="w-full">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deskripsi Produk</p>
                  <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm leading-relaxed border border-gray-100">
                    {promo.deskripsi || <span className="text-gray-400 italic">Tidak ada deskripsi</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

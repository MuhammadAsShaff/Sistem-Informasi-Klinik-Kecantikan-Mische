import React from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';

export default function PromoCard({ promo }) {
  const navigate = useNavigate();
  // Status dari backend mungkin integer (1/0) atau boolean atau string
  const isActive = promo.status === "Aktif" || promo.status === 1 || promo.status === true;

  // Format tanggal untuk tampilan (misal: 24 Nov 2025)
  const formatTanggal = (dateString) => {
    if (!dateString) return "";
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const extractName = (field) => {
    if (!field) return null;
    if (typeof field === 'string' || typeof field === 'number') return String(field);
    if (typeof field === 'object') {
      return field.nama || field.namaProduk || field.namaKategori || field.nama_produk || field.nama_kategori || null;
    }
    return null;
  };

  const getPromoText = (promo) => {
    const jenis = String(promo.jenisPromo || promo.jenis_promo || "").toLowerCase();
    const isGratis = jenis.includes("gratis") || promo.diskon == 0;
    const isPersen = jenis.includes("persen") || (jenis === "diskon" && promo.diskon <= 100) || (!jenis && promo.diskon > 0 && promo.diskon <= 100);
    const isPotongan = jenis.includes("potongan") || jenis.includes("nominal") || (jenis === "diskon" && promo.diskon > 100) || (!jenis && promo.diskon > 100);

    if (isGratis) {
      const produkTeks = extractName(promo.produk) || extractName(promo.namaProduk) || extractName(promo.nama_produk);
      if (produkTeks && !produkTeks.toLowerCase().includes("semua produk")) {
        return `GRATIS ${String(produkTeks).toUpperCase()}`;
      }
      return "GRATIS PRODUK SPESIAL";
    }
    if (isPersen) return `DISKON ${promo.diskon}%`;
    if (isPotongan) return `POTONGAN Rp ${Number(promo.diskon).toLocaleString('id-ID')}`;
    return "PROMO SPESIAL";
  };

  return (
    <div 
      onClick={() => navigate(`/promo/${promo.idPromo || promo.id}`)}
      className="bg-white rounded-tl-[30px] rounded-br-[30px] shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group relative border border-gray-100"
    >
      {/* Ribbon */}
      <div className="absolute top-0 left-0 z-10 overflow-hidden w-[140px] h-[140px] rounded-tl-[24px]">
        <div className={`absolute w-[200px] h-[200px] -top-[100px] -left-[100px] transform -rotate-45 flex items-end justify-center pb-2 shadow-md
          ${isActive ? 'bg-[#56BC36]' : 'bg-[#CC3333]'}`}
        >
          <span className="text-white font-bold text-[18px] tracking-wide text-center leading-tight">
            {isActive ? (
              <>Masih<br />Berlaku</>
            ) : (
              <>Tidak<br />Berlaku</>
            )}
          </span>
        </div>
      </div>


      {/* Image Area */}
      <div className="w-full h-[200px] bg-gray-100 relative overflow-hidden">
        {promo.gambar ? (
          <img src={promo.gambar.startsWith('http') ? promo.gambar : `${STORAGE_BASE_URL}${String(promo.gambar).replace(/^(?:public\/|storage\/|\/)+/, '')}`} alt={promo.namaPromo} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 flex flex-col items-center justify-center p-6 text-center">
             <h3 className="text-2xl font-black text-green-600 mb-2 drop-shadow-sm opacity-50">{getPromoText(promo)}</h3>
             <p className="text-green-800 font-bold opacity-70 bg-white/50 px-4 py-1 rounded-full text-sm">Mische Aesthetic Clinic</p>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-black mb-2 line-clamp-1">{promo.namaPromo || promo.nama}</h3>
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-[#56BC36]/10 text-[#56BC36] rounded-full text-xs font-bold shadow-sm border border-[#56BC36]/20">
            {getPromoText(promo)}
          </span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
          {promo.deskripsi}
        </p>

        {/* Action Button */}
        <div className="mt-auto">
          <div className={`inline-block px-5 py-2 rounded-full text-sm font-semibold text-white transition-colors
            ${isActive ? 'bg-[#56BC36]' : 'bg-[#CC3333]'}
          `}>
            Berlaku Hingga {formatTanggal(promo.tanggalSelesai)}
          </div>
        </div>
      </div>
    </div>
  );
}

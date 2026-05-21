import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Eye, EyeOff, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function PromoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promo, setPromo] = useState(null);
  const [showVoucher, setShowVoucher] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when loaded
    try {
      const stored = localStorage.getItem('mische_promos');
      if (stored) {
        const parsed = JSON.parse(stored);
        const found = parsed.find(p => p.id.toString() === id);
        if (found) {
          setPromo(found);
        }
      }
    } catch (error) {
      console.error("Gagal memuat detail promo:", error);
    }
  }, [id]);

  if (!promo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <p className="text-gray-500 font-medium">Promo tidak ditemukan.</p>
      </div>
    );
  }

  const formatTanggal = (dateString) => {
    if (!dateString) return "";
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const isAktif = promo.status === "Aktif";

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-10 pb-20">
      <div className="max-w-[900px] mx-auto px-4 md:px-6">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#56BC36] font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Kembali ke Promo
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-tl-[30px] rounded-br-[30px] shadow-sm p-6 md:p-8 mb-8 border border-gray-100">
          
          {/* Hero Banner (Placeholder for now) */}
          <div className="w-full h-[250px] md:h-[350px] bg-gradient-to-br from-green-100 to-green-50 rounded-2xl mb-8 relative overflow-hidden flex flex-col items-center justify-center text-center px-4">
             <h1 className="text-6xl md:text-8xl font-black text-green-600 drop-shadow-md">{promo.diskon || "PROMO"}</h1>
             <p className="text-green-800 font-bold mt-4 bg-white/70 px-6 py-2 rounded-full shadow-sm text-lg md:text-xl">Mische Aesthetic Clinic</p>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">{promo.nama}</h1>

          {/* Calendar Dates */}
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <div className="text-[#56BC36]"><Calendar size={40} strokeWidth={1.5} /></div>
            <div className="bg-[#56BC36] text-white px-4 py-1 rounded-full font-semibold">
              {formatTanggal(promo.tanggalMulai)}
            </div>
            <div className="font-bold text-2xl text-black">-</div>
            <div className="bg-[#56BC36] text-white px-4 py-1 rounded-full font-semibold">
              {formatTanggal(promo.tanggalSelesai)}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-[15px] leading-relaxed text-justify mb-2">
            {promo.deskripsi}
          </p>
        </div>

        {/* Bottom Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Code Voucher */}
          <div className="bg-white rounded-tl-[30px] rounded-br-[30px] shadow-sm p-6 md:p-8 flex items-center justify-between border border-gray-100">
            <div>
               <div className="flex items-center gap-4 mb-2">
                 <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-[#56BC36]">
                    <span className="font-bold text-2xl">%</span>
                 </div>
                 <h2 className="text-2xl font-bold text-black">Code Voucher</h2>
               </div>
               <div className="ml-16 mb-4">
                 <p className="text-gray-500 font-medium text-sm">
                   Status &nbsp;&nbsp;:&nbsp;&nbsp; <span className="text-black">{isAktif ? 'Masih Berlaku' : 'Tidak Berlaku'}</span>
                 </p>
               </div>
               
               <div className="ml-16 flex items-center">
                 <div className="border border-gray-200 rounded-l-xl px-6 py-2 font-mono text-xl tracking-widest text-black bg-gray-50 min-w-[180px] text-center">
                   {showVoucher ? promo.kodePromo : "********"}
                 </div>
                 <button 
                    onClick={() => setShowVoucher(!showVoucher)}
                    className="bg-[#56BC36] hover:bg-[#4ea830] transition-colors text-white p-[11px] rounded-r-xl"
                  >
                   {showVoucher ? <EyeOff size={24} /> : <Eye size={24} />}
                 </button>
               </div>
            </div>
          </div>

          {/* Kategori Produk */}
          <div className="bg-white rounded-tl-[30px] rounded-br-[30px] shadow-sm p-6 md:p-8 flex items-start border border-gray-100">
            <div className="w-12 h-12 bg-[#56BC36] rounded-t-xl rounded-b-md flex items-center justify-center text-white mr-6 mt-1 shrink-0">
               <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black mb-4">Kategori Produk</h2>
              <div className="space-y-2">
                {promo.kategoriProduk && (
                  <p className="text-gray-500 font-medium text-sm">
                    Kategori &nbsp;&nbsp;:&nbsp;&nbsp; <span className="text-black">{promo.kategoriProduk}</span>
                  </p>
                )}
                {promo.produk && (
                  <p className="text-gray-500 font-medium text-sm">
                    Produk &nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp; <span className="text-black">{promo.produk}</span>
                  </p>
                )}
                {!promo.kategoriProduk && !promo.produk && (
                  <p className="text-gray-500 font-medium text-sm">
                    Kategori &nbsp;&nbsp;:&nbsp;&nbsp; <span className="text-black">Semua Produk</span>
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

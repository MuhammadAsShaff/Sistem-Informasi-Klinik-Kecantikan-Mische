import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Eye, EyeOff, ShoppingBag, ArrowLeft, Percent, Gift, Banknote } from 'lucide-react';
import { endpoints, STORAGE_BASE_URL } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

export default function PromoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showVoucher, setShowVoucher] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when loaded
  }, []);

  const { data: rawPromo, isLoading: isPromoLoading } = useFetchWithCache(endpoints.customer.promo, { ttl: 15000, revalidateOnMount: false });
  const { data: rawProduct, isLoading: isProdLoading } = useFetchWithCache(endpoints.customer.product, { ttl: 15000, revalidateOnMount: false });

  const promoDataObj = useMemo(() => {
    if (!rawPromo) return null;
    const promoData = rawPromo?.data?.data || rawPromo?.data || rawPromo;
    const promos = Array.isArray(promoData) ? promoData : [];
    const found = promos.find(p => (p.idPromo || p.id).toString() === id);
    
    if (!found) return null;

    let fetchedProdName = null;
    let fetchedKatName = null;

    if (rawProduct) {
      const productsData = rawProduct?.data?.data || rawProduct?.data || [];
      const products = Array.isArray(productsData) ? productsData : [];
      
      const prodId = found.idProduk || found.id_produk || found.produk_id;
      const katId = found.idKategori || found.id_kategori || found.kategori_id;

      if (prodId) {
         const matchedProd = products.find(p => String(p.idProduk || p.id) === String(prodId));
         if (matchedProd) {
            fetchedProdName = matchedProd.nama || matchedProd.namaProduk;
            if (matchedProd.kategori) {
               fetchedKatName = matchedProd.kategori.nama || matchedProd.kategori.namaKategori;
            }
         }
      }

      if (katId && !fetchedKatName) {
         const prodWithCat = products.find(p => String(p.idKategori || p.kategori_id) === String(katId));
         if (prodWithCat && prodWithCat.kategori) {
            fetchedKatName = prodWithCat.kategori.nama || prodWithCat.kategori.namaKategori;
         }
      }
    }

    return {
      promo: found,
      dinamisNamaProduk: fetchedProdName,
      dinamisNamaKategori: fetchedKatName
    };
  }, [rawPromo, rawProduct, id]);

  const isLoading = isPromoLoading || isProdLoading;
  const promo = promoDataObj?.promo;
  const dinamisNamaProduk = promoDataObj?.dinamisNamaProduk;
  const dinamisNamaKategori = promoDataObj?.dinamisNamaKategori;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <p className="text-gray-500 font-medium">Memuat...</p>
      </div>
    );
  }

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

  const isAktif = promo.status === "Aktif" || promo.status === 1 || promo.status === true;

  const extractName = (field) => {
    if (!field) return null;
    if (typeof field === 'string' || typeof field === 'number') return String(field);
    if (typeof field === 'object') {
      const ext = field.nama || field.namaProduk || field.namaKategori || field.nama_produk || field.nama_kategori || null;
      if (ext && (typeof ext === 'string' || typeof ext === 'number')) return String(ext);
      return "Detail Objek";
    }
    return null;
  };

  const safeRender = (val, fallback = "") => {
    if (val === null || val === undefined) return fallback;
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (typeof val === 'object') return "Data tidak dapat ditampilkan";
    return String(val);
  };

  const katId = promo.idKategori || promo.id_kategori || promo.kategori_id;
  const prodId = promo.idProduk || promo.id_produk || promo.produk_id;

  const kategoriTeks = extractName(dinamisNamaKategori) || 
                       extractName(promo.kategori) || 
                       extractName(promo.kategoriProduk) || 
                       extractName(promo.kategori_produk) || 
                       (katId ? `Kategori ID: ${katId}` : 'Semua Kategori');

  const produkTeks = extractName(dinamisNamaProduk) || 
                     extractName(promo.produk) || 
                     extractName(promo.namaProduk) || 
                     extractName(promo.nama_produk) || 
                     (prodId ? `Produk ID: ${prodId}` : 'Semua Produk');

  const getPromoText = (promo) => {
    const jenis = String(promo.jenisPromo || promo.jenis_promo || "").toLowerCase();
    const isGratis = jenis.includes("gratis") || promo.diskon == 0;
    const isPersen = jenis.includes("persen") || (jenis === "diskon" && promo.diskon <= 100) || (!jenis && promo.diskon > 0 && promo.diskon <= 100);
    const isPotongan = jenis.includes("potongan") || jenis.includes("nominal") || (jenis === "diskon" && promo.diskon > 100) || (!jenis && promo.diskon > 100);

    if (isGratis) {
      if (produkTeks && !produkTeks.toLowerCase().includes("semua produk")) {
        return `GRATIS ${String(produkTeks).toUpperCase()}`;
      }
      return "GRATIS PRODUK SPESIAL";
    }
    if (isPersen) return `DISKON ${promo.diskon}%`;
    if (isPotongan) return `POTONGAN Rp ${Number(promo.diskon).toLocaleString('id-ID')}`;
    return "PROMO SPESIAL";
  };

  const getPromoIcon = () => {
    const jenis = String(promo.jenisPromo || promo.jenis_promo || "").toLowerCase();
    const isGratis = jenis.includes("gratis") || promo.diskon == 0;
    const isPotongan = jenis.includes("potongan") || jenis.includes("nominal") || (jenis === "diskon" && promo.diskon > 100) || (!jenis && promo.diskon > 100);

    if (isGratis) return <Gift size={24} strokeWidth={2.5} />;
    if (isPotongan) return <Banknote size={24} strokeWidth={2.5} />;
    return <Percent size={24} strokeWidth={2.5} />;
  };

  const getPromoTitleText = () => {
    const jenis = String(promo.jenisPromo || promo.jenis_promo || "").toLowerCase();
    const isGratis = jenis.includes("gratis") || promo.diskon == 0;
    const isPotongan = jenis.includes("potongan") || jenis.includes("nominal") || (jenis === "diskon" && promo.diskon > 100) || (!jenis && promo.diskon > 100);

    if (isGratis) return "Kode Gratis Produk";
    if (isPotongan) return "Kode Potongan Harga";
    return "Kode Voucher Diskon";
  };

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
          
          {/* Hero Banner */}
          <div className="w-full h-[250px] md:h-[350px] bg-gradient-to-br from-green-100 to-green-50 rounded-2xl mb-8 relative overflow-hidden flex flex-col items-center justify-center text-center">
             {typeof promo.gambar === 'string' && promo.gambar.trim() !== '' ? (
               <img src={promo.gambar.startsWith('http') ? promo.gambar : `${STORAGE_BASE_URL}${String(promo.gambar).replace(/^(?:public\/|storage\/|\/)+/, '')}`} alt={safeRender(promo.namaPromo || promo.nama)} className="w-full h-full object-cover" />
             ) : (
               <>
                 <h1 className="text-4xl md:text-6xl font-black text-green-600 drop-shadow-md">{getPromoText(promo)}</h1>
                 <p className="text-green-800 font-bold mt-4 bg-white/70 px-6 py-2 rounded-full shadow-sm text-lg md:text-xl">Mische Aesthetic Clinic</p>
               </>
             )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-black">{safeRender(promo.namaPromo || promo.nama)}</h1>
            <div className="inline-flex items-center px-4 py-1.5 bg-[#56BC36]/10 text-[#56BC36] rounded-full text-sm font-bold w-fit shadow-sm border border-[#56BC36]/20">
              {getPromoText(promo)}
            </div>
          </div>

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
          <p className="text-gray-700 text-[15px] leading-relaxed text-justify mb-2 whitespace-pre-line">
            {safeRender(promo.deskripsi)}
          </p>
        </div>

        {/* Bottom Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          

          {/* Code Voucher */}
          <div className="bg-white rounded-tl-[30px] rounded-br-[30px] shadow-sm p-6 md:p-8 flex items-center justify-between border border-gray-100">
            <div>
               <div className="flex items-center gap-4 mb-2">
                 <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-[#56BC36]">
                    {getPromoIcon()}
                 </div>
                 <h2 className="text-2xl font-bold text-black">{getPromoTitleText()}</h2>
               </div>
               <div className="ml-16 mb-4">
                 <p className="text-gray-500 font-medium text-sm">
                   Status &nbsp;&nbsp;:&nbsp;&nbsp; <span className="text-black">{isAktif ? 'Masih Berlaku' : 'Tidak Berlaku'}</span>
                 </p>
               </div>
               
               <div className="ml-16 flex items-center">
                 <div className="border border-gray-200 rounded-l-xl px-6 py-2 font-mono text-xl tracking-widest text-black bg-gray-50 min-w-[180px] text-center">
                   {showVoucher ? safeRender(promo.kode || promo.kodePromo, "********") : "********"}
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

          {/* Syarat & Ketentuan */}
          <div className="bg-white rounded-tl-[30px] rounded-br-[30px] shadow-sm p-6 md:p-8 flex items-start border border-gray-100">
            <div className="w-12 h-12 bg-[#56BC36] rounded-t-xl rounded-b-md flex items-center justify-center text-white mr-6 mt-1 shrink-0">
               <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black mb-4">Syarat & Ketentuan</h2>
              <div className="space-y-2">
                <p className="text-gray-500 font-medium text-sm">
                  Berlaku Untuk &nbsp;&nbsp;:&nbsp;&nbsp; 
                  <span className="text-[#56BC36] font-bold">
                    {prodId ? `Khusus Produk: ${extractName(dinamisNamaProduk) || extractName(promo.produk) || extractName(promo.namaProduk) || extractName(promo.nama_produk) || `ID ${prodId}`}` 
                      : katId ? `Khusus Kategori: ${extractName(dinamisNamaKategori) || extractName(promo.kategori) || extractName(promo.kategoriProduk) || extractName(promo.kategori_produk) || `ID ${katId}`}` 
                      : "Semua Produk (Global)"}
                  </span>
                </p>
                <p className="text-gray-500 font-medium text-sm">
                  Minimal Order &nbsp;:&nbsp;&nbsp; 
                  <span className="text-black">
                    {promo.minimalTransaksi ? `Rp ${Number(promo.minimalTransaksi).toLocaleString('id-ID')}` : 'Tanpa Minimal Pembelian'}
                  </span>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

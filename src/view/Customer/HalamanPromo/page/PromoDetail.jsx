import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Eye, EyeOff, ShoppingBag, ArrowLeft } from 'lucide-react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints, STORAGE_BASE_URL } from '@/core/api/endpoints';

export default function PromoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promo, setPromo] = useState(null);
  const [showVoucher, setShowVoucher] = useState(false);
  const [dinamisNamaProduk, setDinamisNamaProduk] = useState(null);
  const [dinamisNamaKategori, setDinamisNamaKategori] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when loaded
    const fetchPromoDetail = async () => {
      try {
        // Tarik data promo dan semua produk secara paralel
        const [promoRes, prodRes] = await Promise.all([
          axiosClient.get(endpoints.customer.promo),
          axiosClient.get(endpoints.customer.product).catch(() => ({ data: { data: [] } }))
        ]);
        
        if (promoRes.data) {
          const promoData = promoRes.data.data?.data || promoRes.data.data || promoRes.data;
          const promos = Array.isArray(promoData) ? promoData : [];
          const found = promos.find(p => (p.idPromo || p.id).toString() === id);
          
          if (found) {
            setPromo(found);

            // Coba ambil nama asli dari endpoint produk
            const productsData = prodRes.data?.data?.data || prodRes.data?.data || [];
            const products = Array.isArray(productsData) ? productsData : [];
            
            const prodId = found.idProduk || found.id_produk || found.produk_id;
            const katId = found.idKategori || found.id_kategori || found.kategori_id;

            let fetchedProdName = null;
            let fetchedKatName = null;

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

            setDinamisNamaProduk(fetchedProdName);
            setDinamisNamaKategori(fetchedKatName);
          }
        }
      } catch (error) {
        console.error("Gagal memuat detail promo:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromoDetail();
  }, [id]);

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
               <img src={promo.gambar.startsWith('http') ? promo.gambar : `${STORAGE_BASE_URL}${promo.gambar}`} alt={safeRender(promo.namaPromo || promo.nama)} className="w-full h-full object-cover" />
             ) : (
               <>
                 <h1 className="text-6xl md:text-8xl font-black text-green-600 drop-shadow-md">{safeRender(promo.diskon, "PROMO")}</h1>
                 <p className="text-green-800 font-bold mt-4 bg-white/70 px-6 py-2 rounded-full shadow-sm text-lg md:text-xl">Mische Aesthetic Clinic</p>
               </>
             )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">{safeRender(promo.namaPromo || promo.nama)}</h1>

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

          {/* Kategori Produk */}
          <div className="bg-white rounded-tl-[30px] rounded-br-[30px] shadow-sm p-6 md:p-8 flex items-start border border-gray-100">
            <div className="w-12 h-12 bg-[#56BC36] rounded-t-xl rounded-b-md flex items-center justify-center text-white mr-6 mt-1 shrink-0">
               <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black mb-4">Produk Promo</h2>
              <div className="space-y-2">
                <p className="text-gray-500 font-medium text-sm">
                  Kategori &nbsp;&nbsp;:&nbsp;&nbsp; <span className="text-black">{safeRender(kategoriTeks, "Semua Kategori")}</span>
                </p>
                <p className="text-gray-500 font-medium text-sm">
                  Produk &nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp; <span className="text-black">{safeRender(produkTeks, "Semua Produk")}</span>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

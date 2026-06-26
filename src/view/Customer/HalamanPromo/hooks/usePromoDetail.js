import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

export const usePromoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showVoucher, setShowVoucher] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const formatTanggal = (dateString) => {
    if (!dateString) return "";
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

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

  const getPromoText = (promo) => {
    const produkTeks = extractName(promoDataObj?.dinamisNamaProduk) || 
                     extractName(promo.produk) || 
                     extractName(promo.namaProduk) || 
                     extractName(promo.nama_produk);
                     
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

  const getPromoTitleText = (promo) => {
    const jenis = String(promo.jenisPromo || promo.jenis_promo || "").toLowerCase();
    const isGratis = jenis.includes("gratis") || promo.diskon == 0;
    const isPotongan = jenis.includes("potongan") || jenis.includes("nominal") || (jenis === "diskon" && promo.diskon > 100) || (!jenis && promo.diskon > 100);

    if (isGratis) return "Kode Gratis Produk";
    if (isPotongan) return "Kode Potongan Harga";
    return "Kode Voucher Diskon";
  };

  const promo = promoDataObj?.promo || {};
  const katId = promo.idKategori || promo.id_kategori || promo.kategori_id;
  const prodId = promo.idProduk || promo.id_produk || promo.produk_id;
  const dinamisNamaProduk = promoDataObj?.dinamisNamaProduk;
  const dinamisNamaKategori = promoDataObj?.dinamisNamaKategori;

  return {
    navigate,
    showVoucher,
    setShowVoucher,
    isLoading,
    promoDataObj,
    formatTanggal,
    extractName,
    safeRender,
    getPromoText,
    getPromoTitleText,
    katId,
    prodId,
    dinamisNamaProduk,
    dinamisNamaKategori
  };
};

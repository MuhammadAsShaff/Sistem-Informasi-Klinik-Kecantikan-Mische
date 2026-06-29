import { useState } from 'react';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

/**
 * =========================================================================
 * MANDOR ARSIP KUPON POTONGAN HARGA (usePromoData)
 * =========================================================================
 * Ibarat kepala bagian promosi di kantor pusat klinik:
 * 1. Meminta seluruh tumpukan kupon promo dari brankas server (FetchWithCache).
 * 2. Menyediakan kotak kaca pembesar (searchQuery) untuk mencocokkan judul promo.
 * 3. Menggunakan stempel saringan jenis promo dan status aktif untuk memastikan tamu hanya melihat kupon yang benar-benar mereka butuhkan.
 */
export function usePromoData() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  const { data, isLoading } = useFetchWithCache(endpoints.customer.promo);
  
  // Extract data array (handle Laravel pagination or standard response)
  const promoData = data?.data || data || [];
  const promos = Array.isArray(promoData) ? promoData : [];

  const filteredPromos = promos.filter(promo => {
    // 1. Search Query
    const matchesSearch = 
      promo.namaPromo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Jenis Promo
    let matchesJenis = true;
    if (filterJenis !== 'Semua') {
      const jenis = String(promo.jenisPromo || promo.jenis_promo || "").toLowerCase();
      
      // Fallback heuristics based on diskon
      const isGratis = jenis.includes("gratis") || promo.diskon == 0;
      const isPersen = jenis.includes("persen") || (jenis === "diskon" && promo.diskon <= 100) || (!jenis && promo.diskon > 0 && promo.diskon <= 100);
      const isPotongan = jenis.includes("potongan") || jenis.includes("nominal") || (jenis === "diskon" && promo.diskon > 100) || (!jenis && promo.diskon > 100);

      if (filterJenis === 'gratis produk') matchesJenis = isGratis;
      else if (filterJenis === 'diskon persen') matchesJenis = isPersen;
      else if (filterJenis === 'potongan harga') matchesJenis = isPotongan;
    }

    // 3. Status
    let matchesStatus = true;
    if (filterStatus !== 'Semua') {
      const isActive = promo.status === "Aktif" || promo.status === 1 || promo.status === true;
      if (filterStatus === 'Aktif') matchesStatus = isActive;
      else if (filterStatus === 'Tidak Aktif') matchesStatus = !isActive;
    }

    return matchesSearch && matchesJenis && matchesStatus;
  });

  return { 
    promos: filteredPromos, 
    searchQuery, 
    setSearchQuery, 
    filterJenis, 
    setFilterJenis, 
    filterStatus, 
    setFilterStatus, 
    isLoading 
  };
}

import { useState } from 'react';

export const useKelolaPenjualan = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProduk, setFilterProduk] = useState('Semua Produk');
  
  // Nanti data di-fetch dari API. Untuk sekarang mockup kosong sesuai gambar.
  const [penjualan, setPenjualan] = useState([]);
  
  const filteredPenjualan = penjualan.filter(item => 
    item.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    searchQuery,
    setSearchQuery,
    filterProduk,
    setFilterProduk,
    filteredPenjualan,
    penjualan,
    setPenjualan
  };
};

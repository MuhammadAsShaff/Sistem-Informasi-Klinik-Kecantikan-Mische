import { useState, useEffect } from 'react';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

/**
 * ASISTEN PENCATAT KATALOG PRODUK (useFetchProduk)
 * Ibarat petugas yang rajin mengecek dan mencatat seluruh barang yang ada di gudang pusat.
 * Petugas ini juga menyiapkan catatan salinan agar tabel selalu menampilkan informasi barang terkini.
 */
export function useFetchProduk() {
  // 1. Mengirim kurir untuk memeriksa daftar barang di gudang pusat secara cepat
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(endpoints.admin.products);
  
  // 2. Tempat menyimpan salinan daftar barang yang siap dipajang di etalase tabel
  const [products, setProducts] = useState([]);
  const isLoading = isCacheLoading; // Penanda apakah kurir sedang sibuk mencatat

  // 3. Jika kurir membawa daftar barang baru dari gudang, segera salin ke buku catatan etalase
  useEffect(() => {
    if (data) {
      setProducts(Array.isArray(data) ? data : []);
    }
  }, [data]);

  // Fungsi untuk menyuruh kurir mengecek ulang daftar barang di gudang pusat sekarang juga
  const fetchProducts = async () => {
    mutate();
  };

  // Fungsi khusus untuk langsung mengganti angka stok di pembukuan etalase saat tombol tambah/kurang ditekan
  // (Tanpa harus menunggu konfirmasi panjang dari gudang)
  const updateLocalStock = (id, newStock) => {
    setProducts(prev => prev.map(p => {
      const productId = p.idProduk || p.id;
      if (productId === id) {
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  return { products, isLoading, refetch: fetchProducts, updateLocalStock };
}

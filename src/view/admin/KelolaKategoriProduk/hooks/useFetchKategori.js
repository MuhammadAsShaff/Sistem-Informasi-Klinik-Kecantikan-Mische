import { useState, useEffect } from 'react';
import { endpoints } from '@/core/api/endpoints';
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

/**
 * =========================================================================
 * FUNGSI PENGAMBIL DAFTAR KATEGORI (Ibarat Buku Daftar Rak Kategori di Toko)
 * =========================================================================
 * File ini ibarat "Petugas Pengambil Buku Kategori" di toko.
 * Tugasnya mengambil 2 macam data dari server pusat:
 * 1. Daftar nama-nama kategori barang (seperti Perawatan Wajah, Perawatan Tubuh).
 * 2. Hitungan berapa banyak produk di dalam masing-masing kategori tersebut.
 * Lalu, kedua info ini digabungkan jadi satu daftar lengkap agar mudah dilihat.
 */
export function useFetchKategori() {
  // Tempat menyimpan daftar kategori yang sudah matang dan siap tayang
  const [categories, setCategories] = useState([]);
  
  // 1. Mengambil daftar nama dan deskripsi kategori dari server pusat
  const { data: catRes, isLoading: catLoading, mutate: mutateCat } = useFetchWithCache(endpoints.admin.kategori);
  
  // 2. Mengambil angka hitungan jumlah produk per kategori dari server
  const { data: countRes, isLoading: countLoading, mutate: mutateCount } = useFetchWithCache(endpoints.admin.kategoriCount);

  // Penanda apakah sistem sedang sibuk memuat data (loading)
  const isLoading = catLoading || countLoading;

  /*
    PROSES MENGGABUNGKAN NAMA KATEGORI & JUMLAH BARANG (useEffect):
    Langsung dijalankan begitu data dari server berhasil diambil.
  */
  useEffect(() => {
    if (catRes) {
      // Pastikan data berbentuk daftar (array) agar bisa disusun
      const catData = Array.isArray(catRes.data) ? catRes.data : (Array.isArray(catRes) ? catRes : []);
      const countData = Array.isArray(countRes?.data) ? countRes.data : (Array.isArray(countRes) ? countRes : []);

      // PROSES PENGGABUNGAN DATA
      // Memeriksa setiap kategori di dalam daftar...
      const merged = catData.map(cat => {
        // ...lalu mencocokkan ID kategorinya dengan angka jumlah barang
        const matchedCount = countData.find(c => c.idKategori === cat.idKategori);
        return {
          ...cat, // Menyalin seluruh data kategori lama
          count: matchedCount ? matchedCount.jumlahProduk : 0 // Menempelkan angka jumlah produk (0 jika kosong)
        };
      });

      // Simpan hasil gabungan ke dalam 'categories'
      setCategories(merged);
    }
  }, [catRes, countRes]);

  /*
    FUNGSI UNTUK MEMPERBARUI DATA (Refresh):
    Jika ada kategori baru ditambah atau dihapus, panggil fungsi ini 
    agar sistem mengambil ulang data terbaru dari server.
  */
  const fetchCategories = async () => {
    mutateCat();
    mutateCount();
  };

  // Mengirimkan daftar kategori (categories), penanda loading (isLoading), dan fungsi refresh (refetch)
  return { categories, isLoading, refetch: fetchCategories };
}

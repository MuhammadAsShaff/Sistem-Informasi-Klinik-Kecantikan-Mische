import { useState, useEffect, useCallback, useRef } from 'react';
import axiosClient from '@/core/api/axiosClient';

/* 
 * =========================================================================
 * BUKU CATATAN SEMENTARA (CACHE)
 * =========================================================================
 * - cache: Tempat menyimpan data yang sudah pernah diambil agar tidak perlu 
 *          tanya ke server berulang-ulang.
 * - inFlightRequests: Daftar antrean kurir. Mencegah 2 kurir dikirim ke 
 *                     tempat yang sama di detik yang persis sama.
 */
const cache = new Map();
const inFlightRequests = new Map();

/**
 * KOMPONEN: useFetchWithCache (Pengambil Data Pintar)
 * FUNGSI: Mengambil data dari Backend, tapi JIKA datanya sudah pernah diambil 
 *         dan masih "segar", dia akan langsung menampilkannya dari Buku Catatan (Cache)
 *         sehingga halaman website memuat secepat kilat (0 detik).
 */
export const useFetchWithCache = (url, options = {}) => {
  const { 
    ttl = 15 * 1000, // TTL (Time To Live): Umur kesegaran data (Default: 15 detik)
    revalidateOnMount = true, // Apakah kurir harus diam-diam ngecek data baru di belakang layar?
    enabled = true, // Sakelar untuk menyalakan/mematikan fungsi ini
    onSuccess // Fungsi yang akan dipanggil kalau data sukses diambil
  } = options;

  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  // =========================================================================
  // 1. STATE UNTUK MENAMPUNG DATA
  // =========================================================================
  const [data, setData] = useState(() => {
    const cached = cache.get(url); // Cek apakah datanya sudah ada di buku catatan?
    if (cached) return cached.data; // Kalau ada, langsung tampilkan! (Ini rahasia web jadi ngebut)
    return null;
  });
  
  // Loading menyala HANYA JIKA datanya belum ada di catatan
  const [isLoading, setIsLoading] = useState(() => !cache.has(url)); 
  const [error, setError] = useState(null);

  // =========================================================================
  // 2. FUNGSI UTAMA UNTUK MENYURUH KURIR MENGAMBIL DATA (FETCHER)
  // =========================================================================
  const fetcher = useCallback(async (isBackground = false) => {
    if (!url || !enabled) return;

    const cached = cache.get(url);
    const now = Date.now();

    // Jika datanya baru saja diambil (kurang dari 2 detik yang lalu), 
    // suruh kurirnya diam saja (jangan berangkat lagi), ini untuk mencegah pesan/spam ganda.
    if (cached && now - cached.timestamp < 2000) {
      if (!isBackground) {
         setData(cached.data);
         setIsLoading(false);
      }
      return;
    }

    // Jika kurir berjalan terang-terangan (bukan di background), nyalakan animasi loading
    if (!isBackground && !cached) {
      setIsLoading(true);
    }

    // Jika sudah ada kurir lain yang OTW ke alamat yang sama, gabung saja antreannya (jangan kirim 2 kurir sekaligus)
    if (inFlightRequests.has(url)) {
      try {
        const res = await inFlightRequests.get(url);
        setData(res.data?.data || res.data);
      } catch (err) {
        setError(err);
      } finally {
        if (!isBackground && !cached) setIsLoading(false);
      }
      return;
    }

    // Kirim kurir (axios) ke alamat (url)
    const requestPromise = axiosClient.get(url);
    inFlightRequests.set(url, requestPromise); // Catat bahwa kurir sedang dalam perjalanan

    try {
      const res = await requestPromise;
      // Membongkar paket data dari kurir
      const responseData = res.data?.data || res.data;
      
      // Tulis hasilnya di Buku Catatan (Cache) beserta jam pengambilannya
      cache.set(url, { data: responseData, timestamp: Date.now() });
      
      setData(responseData); // Tampilkan datanya di layar
      if (onSuccessRef.current) onSuccessRef.current(responseData); // Beritahu halaman bahwa data sudah siap
      setError(null);
    } catch (err) {
      setError(err); // Jika gagal, catat errornya
    } finally {
      inFlightRequests.delete(url); // Hapus dari daftar antrean kurir karena sudah pulang
      setIsLoading(false); // Matikan animasi loading
    }
  }, [url, enabled]);

  // =========================================================================
  // 3. EFEK OTOMATIS SAAT HALAMAN DIBUKA (USE-EFFECT)
  // =========================================================================
  useEffect(() => {
    if (!enabled || !url) return;

    const cached = cache.get(url);
    const now = Date.now();

    if (cached) {
      // Jika data sudah ada di buku catatan, langsung tampilkan ke layar! (Instan/Tanpa loading)
      setData(cached.data);
      setIsLoading(false);

      // Meskipun sudah tampil dari buku catatan, suruh kurir DIAM-DIAM mengecek ke Backend (Background).
      // Siapa tahu ada data baru (misal: diam-diam ada produk baru ditambahkan).
      if (revalidateOnMount || now - cached.timestamp > ttl) {
        fetcher(true);
      }
    } else {
      // Jika buku catatan kosong (Halaman baru pertama kali dibuka), 
      // suruh kurir berangkat terang-terangan (muncul animasi loading bundar).
      fetcher(false);
    }
  }, [url, enabled, fetcher, revalidateOnMount, ttl]);

  // =========================================================================
  // 4. FUNGSI UNTUK MEROBEK BUKU CATATAN (MUTATE)
  // =========================================================================
  // Dipakai kalau kita habis menghapus/mengubah data dan ingin halaman mengambil data yang paling fresh dari server.
  const mutate = useCallback(() => {
    cache.delete(url); // Hapus catatan lama
    return fetcher(false); // Ambil catatan baru ke server
  }, [url, fetcher]);

  return { data, isLoading, error, mutate };
};

// =========================================================================
// 5. FUNGSI UNTUK MEMBERSIHKAN CATATAN SECARA MASSAL (INVALIDATE CACHE)
// =========================================================================
// Contoh Kasus: Habis nambah kategori baru, kita mau "merobek" semua buku catatan tentang kategori 
// agar halaman dipaksa memuat ulang data terbaru dari server.
export const invalidateCache = (urlPrefix) => {
  for (const key of cache.keys()) {
    if (key.includes(urlPrefix)) {
      cache.delete(key);
    }
  }
};

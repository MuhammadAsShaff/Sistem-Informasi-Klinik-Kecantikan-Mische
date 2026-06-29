import { useState, useEffect, useCallback, useRef } from 'react';
// Mengimpor 'axiosClient', ibarat asisten kurir khusus yang bertugas berlari menjemput data ke kantor backend
import axiosClient from '@/core/api/axiosClient';

/** 
 * =========================================================================
 * SISTEM BUKU CATATAN PINTAR & LEMARI ARSIP (GLOBAL MEMORY)
 * =========================================================================
 * Di luar halaman web, kita menyediakan 2 lemari penyimpanan abadi (menggunakan `Map`):
 * 
 * 1. cache: "Lemari Arsip Kilat". Tempat menyimpan salinan berkas/data yang sudah 
 *           pernah diambil oleh kurir. Jadi kalau ada yang minta data yang sama, 
 *           kita ambilkan dari lemari ini dalam 0 detik (tanpa perlu telepon server lagi).
 * 
 * 2. inFlightRequests: "Papan Pelacak Kurir OTW (On The Way)". Tempat mencatat daftar 
 *                      kurir yang sedang di jalan menuju server. Ini mencegah kebodohan 
 *                      mengirim 2 kurir ke alamat yang sama di detik yang persis sama!
 */
const cache = new Map();
const inFlightRequests = new Map();

/**
 * =========================================================================
 * ASISTEN PENGAMBIL DATA KILAT (useFetchWithCache)
 * =========================================================================
 * Bayangkan file ini sebagai "Asisten Pengambil Data Super Pintar". Dia tidak mau 
 * gegabah langsung menyuruh kurir pergi ke server setiap kali halaman web dibuka.
 * 
 * Cara kerjanya yang cerdik (Stale-While-Revalidate):
 * 1. Cek Lemari Arsip: Kalau datanya ada, langsung hidangkan ke layar (0 detik, super ngebut!).
 * 2. Inspeksi Diam-Diam: Sambil pengunjung menikmati data lama, asisten menyuruh kurir 
 *    pergi ke server secara diam-diam di balik layar untuk mengecek apakah ada pembaruan.
 * 3. Halaman web terasa sangat instan dan tidak pernah membuat mata bosan melihat putaran loading!
 */
export const useFetchWithCache = (url, options = {}) => {
  // Membongkar pesan dan aturan titipan dari halaman web (options)
  const { 
    // ttl (Time To Live): Umur kesegaran data (Ibarat tanggal kedaluwarsa roti, standarnya 15 detik)
    ttl = 15 * 1000, 
    
    // revalidateOnMount: Perintah apakah kurir harus melakukan inspeksi diam-diam di latar belakang?
    revalidateOnMount = true, 
    
    // enabled: Saklar utama (true = asisten bekerja, false = asisten disuruh tidur/berhenti)
    enabled = true, 
    
    // onSuccess: Layanan pesan antar (fungsi) yang akan dihubungi begitu data sukses mendarat
    onSuccess 
  } = options;

  /*
    KOTAK MEMORI STABIL (USE-REF)
    Kita simpan fungsi `onSuccess` ke dalam kotak memori permanen (`useRef`).
    Mengapa? Agar fungsi ini tidak berubah-ubah alamatnya setiap kali halaman menyegarkan diri, 
    sehingga tidak membingungkan asisten kurir kita saat mau melapor.
  */
  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  // =========================================================================
  // 1. LACI-LACI PENYIMPANAN HALAMAN (STATE)
  // =========================================================================
  
  // Laci 1: Tempat menaruh bungkusan data yang siap dipajang di layar
  const [data, setData] = useState(() => {

    // Intip Lemari Arsip: Apakah sebelumnya sudah ada salinan data untuk alamat URL ini?
    const cached = cache.get(url); 

    // Jika ada, langsung sajikan seketika! (Ini rahasia utama mengapa website Mische terasa secepat kilat)
    if (cached) return cached.data; 

    // Jika lemari kosong, siapkan laci kosong (null)
    return null;
  });
  
  // Laci 2: Rambu tanda sibuk (loading). Hanya menyala (true) JIKA lemari arsip kita kosong melompong!
  const [isLoading, setIsLoading] = useState(() => !cache.has(url)); 
  
  // Laci 3: Kotak merah tempat menaruh catatan keluhan JIKA kurir tersandung masalah atau server pingsan
  const [error, setError] = useState(null);

  // =========================================================================
  // 2. KENDALI UTAMA PERGERAKAN KURIR (FETCHER)
  // =========================================================================
  /**
   * Fungsi inti tempat asisten memberi instruksi keberangkatan kepada kurir.
   * Parameter `isBackground` menentukan gayanya: apakah kurir berlari terang-terangan 
   * (muncul animasi loading) atau diam-diam seperti agen rahasia di balik layar.
   */
  const fetcher = useCallback(async (isBackground = false) => {

    // Tombol Pengaman: Jika saklar dimatikan (enabled = false) atau alamat URL kosong, kurir jangan bergerak!
    if (!url || !enabled) return;

    // Ambil salinan arsip lama dan lihat jam dinding saat ini (dalam hitungan milidetik)
    const cached = cache.get(url);
    const now = Date.now();

    /*
      ATURAN ANTI-SPAM KURIR (THROTTLING)
      Jika data di lemari arsip baru saja ditaruh kurang dari 2 detik yang lalu (2000 ms), 
      asisten akan mencegah kurir berangkat lagi. Ini untuk melindugi server dari spam 
      klik bertubi-tubi oleh pengunjung yang tidak sabaran!
    */
    if (cached && now - cached.timestamp < 2000) {
      if (!isBackground) {
         setData(cached.data);
         setIsLoading(false);
      }
      return;
    }

    // Jika kurir disuruh berangkat terang-terangan (bukan agen rahasia) dan lemari arsip kosong, nyalakan animasi putaran loading
    if (!isBackground && !cached) {
      setIsLoading(true);
    }

    /*
      SISTEM MENEBENG KURIR (IN-FLIGHT REQUEST MERGING)
      Kita melirik "Papan Pelacak Kurir OTW". Jika ternyata sudah ada kurir lain yang 
      sedang meluncur ke alamat URL yang sama, kita JANGAN mengirim kurir baru! 
      Kita cukup ikut "menebeng" (menunggu hasil kerja kurir pertama tersebut). Sangat hemat tenaga!
    */
    if (inFlightRequests.has(url)) {
      try {

        // Menunggu kurir pertama pulang membawa paket
        const res = await inFlightRequests.get(url);
        setData(res.data?.data || res.data); // Pajang hasilnya di laci data
      } catch (err) {

        setError(err); // Catat jika kurir pertama ternyata gagal
      } finally {
        if (!isBackground && !cached) setIsLoading(false); // Matikan animasi loading
      }
      return;
    }

    // --- KURIR RESMI DIBERANGKATKAN ---

    // Menyuruh asisten kurir (axiosClient) pergi ke alamat tujuan (url)
    const requestPromise = axiosClient.get(url);
    
    // Tulis nama kurir ini di Papan Pelacak OTW agar kalau ada permintaan baru, mereka bisa ikut menebeng
    inFlightRequests.set(url, requestPromise); 

    try {
      // Menunggu kurir pulang membawa bungkusan dari kantor backend
      const res = await requestPromise;
      
      // Membongkar bungkusan paket (mengambil isi dari dalam kotak data.data atau data langsung)
      const responseData = res.data?.data || res.data;
      
      // Simpan salinan berkasnya ke dalam Lemari Arsip (cache) beserta cap stempel waktu (jam mendaratnya)
      cache.set(url, { data: responseData, timestamp: Date.now() });
      
      setData(responseData); // Hidangkan datanya ke layar pengunjung
      
      // Jika ada nomor telepon layanan pesan antar (onSuccess), segera hubungi dan serahkan datanya
      if (onSuccessRef.current) onSuccessRef.current(responseData); 
      
      setError(null); // Bersihkan laci keluhan
    } catch (err) {
      setError(err); // Jika kurir tersesat atau diserang di jalan, catat laporan kerusakannya di laci error
    } finally {
      // Kurir sudah pulang! Hapus namanya dari Papan Pelacak OTW
      inFlightRequests.delete(url); 
      setIsLoading(false); // Matikan putaran animasi loading di layar
    }
  }, [url, enabled]);

  // =========================================================================
  // 3. TUGAS PENGAWALAN OTOMATIS SAAT HALAMAN DIBUKA (USE-EFFECT)
  // =========================================================================
  /**
   * Efek ini adalah asisten penjaga yang bereaksi begitu halaman website dibuka atau alamat URL berubah.
   */
  useEffect(() => {
    if (!enabled || !url) return; // Jika saklar dimatikan, asisten tidur

    const cached = cache.get(url);
    const now = Date.now();

    if (cached) {
      // KONDISI 1: DATA SUDAH ADA DI LEMARI ARSIP
      // Langsung hidangkan ke layar tanpa babibu! (Website terasa seketika tanpa animasi loading)
      setData(cached.data);
      setIsLoading(false);

      /*
        INSPEKSI AGEN RAHASIA (BACKGROUND REVALIDATION)
        Meskipun pengunjung sudah puas melihat data lama dari lemari, kita tetap menyuruh kurir 
        pergi DIAM-DIAM ke server (isBackground = true). Siapa tahu admin klinik baru saja 
        memperbarui harga promo atau menambah produk baru di database!
      */
      if (revalidateOnMount || now - cached.timestamp > ttl) {
        fetcher(true); // Kurir berangkat diam-diam tanpa menyalakan animasi loading
      }
    } else {
      // KONDISI 2: LEMARI ARSIP KOSONG MELOMPONG
      // (Artinya halaman ini baru pertama kali dibuka oleh pengunjung). 
      // Suruh kurir berangkat terang-terangan (isBackground = false) sehingga animasi loading bundar muncul di layar.
      fetcher(false);
    }
  }, [url, enabled, fetcher, revalidateOnMount, ttl]);

  // =========================================================================
  // 4. FUNGSI UNTUK MEROBEK BUKU CATATAN (MUTATE)
  // =========================================================================
  /**
   * Tombol ajaib ini dipakai ketika kita baru saja melakukan perubahan besar (misal habis mengedit atau menghapus event).
   * Tugasnya: Merobek (menghapus) catatan lama di Lemari Arsip, lalu seketika menyuruh kurir berlari mengambil data paling baru ke server!
   */
  const mutate = useCallback(() => {
    cache.delete(url); // Robek dan buang catatan lama di lemari arsip
    return fetcher(false); // Ambil paksa catatan baru ke server
  }, [url, fetcher]);

  // Asisten menyerahkan bungkusan 'data', rambu 'isLoading', keluhan 'error', dan tombol sakti 'mutate' ke halaman web
  return { data, isLoading, error, mutate };
};

// =========================================================================
// 5. FUNGSI PEMBERSIHAN LEMARI ARSIP BESAR-BESARAN (invalidateCache)
// =========================================================================
/**
 * Bayangkan ini sebagai "Petugas Kebersihan / Razia Lemari Arsip".
 * Contoh Kasus: Jika admin baru saja menambahkan Kategori Produk baru, kita mau menyapu bersih 
 * seluruh laci arsip yang ada kata kunci '/kategori', agar semua halaman dipaksa meminta 
 * daftar kategori terbaru langsung dari server backend. Sangat praktis!
 * 
 * @param {string} urlPrefix - Kata kunci atau awalan alamat yang mau dibersihkan (misal: '/api/kategori').
 */
export const invalidateCache = (urlPrefix) => {

  // Petugas berkeliling mengecek satu per satu laci di dalam lemari arsip (cache.keys)
  for (const key of cache.keys()) {

    // Jika nama lacinya mengandung kata kunci yang dicari (includes)
    if (key.includes(urlPrefix)) {
      
      cache.delete(key); // Robek dan buang isinya ke tempat sampah!
    }
  }
};

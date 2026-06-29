import { useState, useEffect } from 'react';
// Mengimpor 'endpoints', yaitu alamat lokasi penyimpanan event di server backend
import { endpoints } from '@/core/api/endpoints';
// Mengimpor alat pengambil data canggih yang dibekali fasilitas "Buku Catatan Pintar" (Cache)
import { useFetchWithCache } from '@/core/hooks/useFetchWithCache';

/**
 * =========================================================================
 * ASISTEN PENGAMBIL DAFTAR EVENT (useFetchEvent)
 * =========================================================================
 * Bayangkan file ini sebagai "Asisten Pengintai" yang tugasnya berlari ke server 
 * untuk membawa pulang daftar seluruh event yang ada di klinik Mische.
 * 
 * Hebatnya, asisten ini dibekali fasilitas Buku Catatan Pintar (Cache).
 * Jadi, kalau admin bolak-balik membuka halaman kelola event, asisten tidak perlu 
 * boros kuota menelepon server terus-menerus. Dia cukup memperlihatkan salinan 
 * catatan yang sudah dia simpan sebelumnya!
 */
export function useFetchEvent() {

  // =======================================================================
  // 1. MEMINJAM BUKU CATATAN PINTAR (CACHING SYSTEM)
  // =======================================================================
  /*
    Kita suruh alat 'useFetchWithCache' memantau alamat server event.
    Dari alat ini kita mendapatkan 3 barang berharga:
    - data           : Berkas laporan berisi daftar event dari server.
    - isCacheLoading : Rambu tanda sibuk ('true') jika asisten masih di jalan mengambil data.
    - mutate         : Tombol sakti untuk merobek catatan lama dan menyuruh asisten berlari mengambil data paling baru.
  */
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(endpoints.admin.event);
  
  // =======================================================================
  // 2. KOTAK PENYIMPANAN SIAP PAKAI (STATE)
  // =======================================================================
  // Laci penyimpanan utama tempat menaruh daftar event yang sudah dirapikan
  const [events, setEvents] = useState([]);
  // Mengganti nama rambu sibuk menjadi 'isLoading' agar mudah dipanggil oleh halaman web
  const isLoading = isCacheLoading;

  // =======================================================================
  // 3. TUGAS MERAPIKAN BARANG YANG BARU DATANG (SIDE EFFECT)
  // =======================================================================
  /**
   * Setiap kali asisten pulang membawa oleh-oleh 'data' dari server, kita harus merapikannya.
   * Kenapa? Karena server terkadang membungkus datanya di dalam kotak bertuliskan `data.data`, 
   * tapi kadang langsung ditaruh di `data`. Tugas bagian ini adalah memastikan barangnya 
   * selalu berbentuk deretan laci (Array) yang siap dipajang di tabel!
   */
  useEffect(() => {
    if (data) {
      // Periksa isi bungkusan: Ambil dari kotak dalam (data.data) jika ada, atau ambil langsung (data)
      const eventData = data.data || data;
      
      // Kita cek apakah bentuknya benar-benar deretan laci (Array). 
      // Kalau bentuknya rusak atau kosong, kita beri laci kosong [] agar web tidak mendadak error.
      setEvents(Array.isArray(eventData) ? eventData : []);
    }
  }, [data]);

  // =======================================================================
  // 4. TOMBOL SAKTI PEMAKSA REFRESH (REFETCHER)
  // =======================================================================
  /**
   * Fungsi ini memicu tombol sakti `mutate()`.
   * Kalau admin baru saja menambah event baru atau menghapus event lama, kita tekan 
   * tombol ini agar asisten langsung berlari ke server mengambil kondisi terbaru!
   */
  const fetchEvents = async () => {
    mutate();
  };

  // Asisten menyerahkan laci berisi daftar 'events', rambu 'isLoading', dan tombol 'refetch' ke halaman utama Kelola Event
  return { events, isLoading, refetch: fetchEvents };
}


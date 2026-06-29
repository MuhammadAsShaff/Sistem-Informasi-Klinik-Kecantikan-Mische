import { useState, useEffect } from "react";
// Mengimpor daftar alamat tujuan di server pusat
import { endpoints } from "@/core/api/endpoints";
// Mengimpor pengambil data cepat yang menggunakan ruang penyimpanan sementara (cache)
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

/**
 * =========================================================================
 * PENGAMBIL DAFTAR JADWAL (Ibarat Petugas Pencatat Buku Jadwal)
 * =========================================================================
 * File ini ibarat "Petugas Pencatat Buku Jadwal" yang bertugas memantau 
 * daftar jadwal reservasi dokter di klinik Mische. Dia memastikan tabel 
 * admin selalu terisi dengan jadwal terbaru dari server pusat.
 */
export function useFetchJadwal() {
  // =========================================================================
  // 1. MENGAMBIL DATA DENGAN SISTEM PENYIMPAN CEPAT (CACHE)
  // =========================================================================
  /*
    Agar aplikasi tidak lambat saat admin bolak-balik membuka halaman jadwal, 
    sistem menggunakan penyimpanan sementara (cache). Jika data sudah ada, 
    langsung ditampilkan dalam 0 detik, sambil mengecek diam-diam ke server 
    jika ada pembaruan baru.
  */
  const { data, isLoading: isCacheLoading, mutate } = useFetchWithCache(endpoints.admin.schedules);
  
  // Kotak penyimpanan utama untuk menampung daftar jadwal yang siap ditampilkan di tabel
  const [dataJadwal, setDataJadwal] = useState([]);
  
  // Penanda proses loading saat sistem sedang mengambil data dari server
  const isLoading = isCacheLoading;

  // =========================================================================
  // 2. MEMASUKKAN DATA KE DALAM KOTAK PENYIMPANAN
  // =========================================================================
  /**
   * Begitu data berhasil diambil dari server, sistem langsung memeriksa isinya 
   * dan menyimpannya ke dalam laci `dataJadwal`. Jika kosong, laci diisi dengan daftar kosong [].
   */
  useEffect(() => {
    if (data) {
      setDataJadwal(data.data || data || []);
    }
  }, [data]);

  // =========================================================================
  // 3. FUNGSI PENYEGAR TABEL (fetchSchedules)
  // =========================================================================
  /**
   * Fungsi ini ibarat "Tombol Muat Ulang (Refresh)".
   * Begitu admin menekan tombol refresh atau baru saja menambah jadwal baru, fungsi ini 
   * memanggil perintah `mutate()`. Tujuannya untuk mengambil ulang data jadwal terbaru 
   * langsung dari komputer server pusat.
   */
  const fetchSchedules = async () => {
    mutate();
  };

  // =========================================================================
  // MEMBERIKAN DAFTAR JADWAL KE HALAMAN UTAMA
  // =========================================================================
  // Menyerahkan daftar jadwal siap pakai 'dataJadwal', penanda 'isLoading', dan fungsi penyegar 'fetchSchedules' ke halaman tabel
  return {
    dataJadwal,
    isLoading,
    fetchSchedules,
  };
}

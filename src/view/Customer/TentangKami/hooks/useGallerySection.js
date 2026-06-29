import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, endpoints } from "@/core/api/endpoints";

/**
 * =========================================================================
 * MANDOR KEPALA BAGIAN DOKUMENTASI & BROSUR (useGallerySection)
 * =========================================================================
 * Ibarat fotografer resmi klinik yang mencatat seluruh kegiatan harian:
 * 1. Menjaga laci foto-foto kegiatan klinik (kegiatanList).
 * 2. Menyiapkan pemutar otomatis (carousel) agar tamu bisa melihat foto selanjutnya atau sebelumnya.
 * 3. Membentangkan potret kecil (thumbnail) di bawah meja pameran.
 */
export function useGallerySection() {
  // ─── KOTAK PENYIMPANAN FOTO & POSISI TAYANG ────────────────────────────────
  // Laci penyimpanan utama tempat menaruh seluruh koleksi album foto kegiatan klinik
  const [kegiatanList, setKegiatanList] = useState([]);
  // Pointer penunjuk halaman foto mana yang saat ini sedang dipajang di bingkai besar
  const [currentIndex, setCurrentIndex] = useState(0);

  // ─── ASISTEN PENGINTAI KE GUDANG DATA SERVER ────────────────────────────────
  // Saat tamu pertama kali masuk ke ruangan galeri, asisten ini langsung bekerja satu kali
  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        // Mengutus kurir Axios berlari ke laci server backend khusus daftar kegiatan
        const res = await axios.get(`${API_BASE_URL}${endpoints.customer.kegiatan}`);
        // Jika kurir berhasil membawa pulang album foto yang utuh (success: true)
        if (res.data.success) {
          // Masukkan seluruh foto tersebut ke dalam laci penyimpanan utama (kegiatanList)
          setKegiatanList(res.data.data);
        }
      } catch (error) {
        // Jika di tengah jalan kurir tersandung atau gagal mengambil foto, catat keluhannya di buku laporan (console)
        console.error("Gagal mengambil kegiatan:", error);
      }
    };
    // Menyalakan perintah agar asisten pengintai segera berangkat
    fetchKegiatan();
  }, []);

  // ─── TUAS PEMUTAR FOTO KE KIRI DAN KANAN ───────────────────────────────────
  // Tuas untuk memutar bingkai foto ke arah kiri (foto sebelumnya)
  // Jika sudah sampai di foto pertama (0), putar balik ke foto paling ujung kanan
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? kegiatanList.length - 1 : prev - 1));
  };

  // Tuas untuk memutar bingkai foto ke arah kanan (foto selanjutnya)
  // Jika sudah sampai di foto paling ujung kanan, putar kembali ke foto pertama (0)
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === kegiatanList.length - 1 ? 0 : prev + 1));
  };

  // Tuas kilat untuk melompat langsung ke nomor foto tertentu saat tamu menunjuk potret kecil
  const goToIndex = (idx) => setCurrentIndex(idx);

  // ─── PENGOLAHAN TAMPILAN FOTO (Computed Values) ───────────────────────────
  // Memilih satu foto utama yang sedang mendapat sorotan lampu panggung (sesuai currentIndex)
  const mainKegiatan = kegiatanList[currentIndex] || null;
  
  // Memilih 3 potret kecil (thumbnail) di meja bawah sebagai cuplikan foto lainnya.
  // Syaratnya: Foto yang sedang tayang di bingkai besar tidak boleh diikutkan di meja bawah ini.
  const uniqueThumbnails =
    kegiatanList.length > 1
      ? kegiatanList.filter((_, idx) => idx !== currentIndex).slice(0, 3)
      : [];

  // ─── MENYODORKAN ALAT KENDALI KE HALAMAN TAMPILAN ──────────────────────────
  // Menyerahkan laci foto, tuas geser, dan potret kecil kepada petugas panggung (GallerySection)
  return {
    kegiatanList,     // Daftar seluruh album foto kegiatan
    currentIndex,     // Nomor urut foto yang sedang aktif
    mainKegiatan,     // Data lengkap foto utama yang dipajang
    uniqueThumbnails, // Deretan 3 potret kecil di bawah meja
    handlePrev,       // Fungsi tuas geser kiri
    handleNext,       // Fungsi tuas geser kanan
    goToIndex,        // Fungsi lompat langsung ke foto pilihan
  };
}

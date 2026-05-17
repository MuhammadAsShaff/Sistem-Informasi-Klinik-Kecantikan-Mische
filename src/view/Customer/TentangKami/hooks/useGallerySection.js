import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, endpoints } from "@/core/api/endpoints";

/**
 * Hook untuk mengambil daftar kegiatan klinik (READ - public).
 * Juga mengelola state navigasi carousel (index aktif).
 */
export function useGallerySection() {
  const [kegiatanList, setKegiatanList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}${endpoints.customer.kegiatan}`);
        if (res.data.success) {
          setKegiatanList(res.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil kegiatan:", error);
      }
    };
    fetchKegiatan();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? kegiatanList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === kegiatanList.length - 1 ? 0 : prev + 1));
  };

  const goToIndex = (idx) => setCurrentIndex(idx);

  // ─── Computed Values ────────────────────────────────────────────
  const mainKegiatan = kegiatanList[currentIndex] || null;
  const uniqueThumbnails =
    kegiatanList.length > 1
      ? kegiatanList.filter((_, idx) => idx !== currentIndex).slice(0, 3)
      : [];

  return {
    kegiatanList,
    currentIndex,
    mainKegiatan,
    uniqueThumbnails,
    handlePrev,
    handleNext,
    goToIndex,
  };
}

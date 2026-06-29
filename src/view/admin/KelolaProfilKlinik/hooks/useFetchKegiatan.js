import { useState, useEffect } from "react";
import { endpoints } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

/**
 * ASISTEN PENGAMAT PAPAN MADING KEGIATAN (useFetchKegiatan)
 * Ibarat asisten pemantau yang bertugas menyalin daftar kegiatan dari papan mading utama klinik.
 * Asisten ini menggunakan catatan laci (cache) agar layar tidak kosong saat pertama kali dibuka, 
 * sambil bersiap menyuruh kurir menanyakan jadwal kegiatan terbaru ke kantor pusat.
 */
export function useFetchKegiatan() {
  // Mengutus kurir pencatat (useFetchWithCache) untuk menanyakan daftar kegiatan
  const { data, mutate } = useFetchWithCache(endpoints.admin.kegiatan);
  
  // Papan pampangan tempat menjajarkan daftar kegiatan di atas meja
  const [kegiatanList, setKegiatanList] = useState([]);

  // Saat kurir membawa catatan daftar kegiatan dari kantor, rapikan di papan pampangan
  useEffect(() => {
    if (data) {
      setKegiatanList(data.data || data || []);
    }
  }, [data]);

  // Fungsi khusus untuk memaksa kurir berlari menanyakan jadwal kegiatan terbaru
  const fetchKegiatan = async () => {
    mutate();
  };

  // Asisten menyerahkan daftar kegiatan dan tombol penyegar ke mandor utama
  return { kegiatanList, fetchKegiatan };
}

import { useState } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * PETUGAS PENCABUT LEMBAR KEGIATAN MADING (useHapusKegiatan)
 * Ibarat petugas kebersihan mading yang berdiri memegang alat pencabut paku mading.
 * Ketika perintah cabut disetujui, petugas ini bertugas melepas lembaran kegiatan dari papan mading 
 * secara permanen dan memberi tahu mandor agar membersihkan debunya.
 */
export function useHapusKegiatan(id, onSuccess, showToast) {
  // Saklar penanda petugas sedang bersusah payah mencabut pengumuman
  const [isLoading, setIsLoading] = useState(false);

  // Proses utama eksekusi pencabutan lembar kegiatan
  const handleDelete = async () => {
    if (!id) return; // Jika tidak ada nomor kegiatan yang ditunjuk, diam saja
    try {
      setIsLoading(true);
      // Mengutus kurir memberi tahu server bahwa kegiatan ini resmi diturunkan
      await axiosClient.delete(`${endpoints.admin.kegiatan}/${id}`);
      // Jika berhasil, panggil asisten untuk menyegarkan tampilan mading
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Gagal menghapus kegiatan:", error);
      const msg = error.response?.data?.message || "Gagal menghapus kegiatan.";
      // Umumkan lewat TOA jika kegiatan gagal dicabut (misal pakunya macet)
      if (showToast) {
        showToast(msg, "error");
      }
    } finally {
      setIsLoading(false); // Petugas selesai menunaikan pekerjaannya
    }
  };

  // Serahkan alat pembersih ini ke meja peringatan hapus
  return { isLoading, handleDelete };
}

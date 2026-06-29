import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * PETUGAS PENCABUT IZIN & PENGATUR STATUS DOKTER (useHapusDokter)
 * Ibarat petugas disiplin rumah sakit yang memiliki dua wewenang penting: 
 * 1. Menghapus (mencabut permanen) nama dokter dari daftar rumah sakit saat tombol setuju ditekan.
 * 2. Mengubah stempel status kehadiran dokter (Tersedia / Tidak Tersedia) di etalase jadwal.
 */
export function useHapusDokter(selectedDokter, onSuccess, showToast) {
  
  // 1. WEWENANG PERTAMA: EKSEKUSI PENCABUTAN PROFIL DOKTER
  const confirmDelete = async (closeModal) => {
    if (!selectedDokter) return; // Jika tidak ada dokter yang ditunjuk, diam saja

    try {
      const docId = selectedDokter.idDokter || selectedDokter.id;
      
      // Mengutus kurir mengirim surat pencabutan ke pusat (server)
      const res = await axiosClient.delete(`${endpoints.admin.doctors}/${docId}`);
      
      // Jika pusat menyetujui, teriakkan kabar gembira lewat TOA dan tutup peringatan
      if (res.data?.success) {
        showToast("Berhasil menghapus profil dokter", "success");
        if (closeModal) closeModal();
        if (onSuccess) onSuccess(); // Suruh asisten menyegarkan buku daftar
      }
    } catch (error) {
      console.error("Gagal menghapus dokter:", error);
      showToast("Gagal menghapus profil dokter.", "error"); // Umumkan kegagalan
    }
  };

  // 2. WEWENANG KEDUA: PENGGANTIAN STEMPEL STATUS (Tersedia / Tidak Tersedia)
  const updateStatusDokter = async (id, newStatus) => {
    try {
      // Kurir membawa pesan perubahan status kilat ke pusat
      await axiosClient.patch(`${endpoints.admin.doctors}/${id}/status`, { status: newStatus });
      
      // Umumkan lewat TOA bahwa jadwal kehadiran dokter telah berubah
      showToast(`Status dokter berhasil diubah menjadi ${newStatus}!`, "success");
      if (onSuccess) onSuccess(); // Segarkan etalase jadwal
    } catch (error) {
      console.error("Gagal mengubah status dokter:", error);
      showToast(
        error.response?.data?.message || "Gagal mengubah status dokter.",
        "error"
      );
    }
  };

  // Petugas menyerahkan kedua wewenangnya ini ke mandor utama
  return {
    confirmDelete,
    updateStatusDokter,
  };
}

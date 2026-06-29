import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * PETUGAS PEMUSNAH BUKU RIWAYAT KLINIK (useHapusProfilKlinik)
 * Ibarat pengawas kearsipan tingkat tinggi yang diberi wewenang khusus untuk mereset atau memusnahkan 
 * buku riwayat utama klinik (seperti mengosongkan visi, misi, dan foto klinik). Ketika tugas selesai, 
 * petugas ini membersihkan meja baki (menyetelnya jadi null) agar riwayat lama tak tersisa.
 */
export function useHapusProfilKlinik(profileData, showToast, setProfileData) {
  // Eksekusi pemusnahan buku riwayat
  const handleDeleteProfile = async (onClose) => {
    if (!profileData) return; // Jika meja baki sudah kosong, tidak ada yang perlu dibakar
    
    // Memeriksa stempel nomor ID buku di setiap sudut sampulnya
    const id =
      profileData.idProfil ||
      profileData.id_profile ||
      profileData.idProfile ||
      profileData.id;
    if (!id) return;

    try {
      // Mengutus kurir membawa surat penghapusan ke kantor arsip pusat (server)
      const res = await axiosClient.delete(`${endpoints.admin.clinic}/${id}`);
      if (res.data?.success) {
        // Umumkan lewat TOA bahwa buku riwayat lama telah musnah
        showToast("Berhasil menghapus profil klinik", "success");
        if (onSuccess) onSuccess();
        // Bersihkan meja baki sampai bersih tanpa sisa (null)
        setProfileData(null);
        onClose && onClose(); // Tutup plang peringatan
      }
    } catch (error) {
      console.error("Hapus profil klinik gagal:", error);
      showToast("Gagal menghapus profil klinik.", "error"); // Umumkan kegagalan
      onClose && onClose();
    }
  };

  // Serahkan wewenang pemusnahan ini ke plang peringatan di ruangan utama
  return { handleDeleteProfile };
}

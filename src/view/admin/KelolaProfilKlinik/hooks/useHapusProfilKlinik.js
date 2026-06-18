import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * Hook untuk menghapus profil klinik (DELETE).
 *
 * @param {Object|null} profileData   - Data profil yang akan dihapus
 * @param {Function}    showToast     - Fungsi untuk menampilkan notifikasi
 * @param {Function}    setProfileData - Setter state profil (reset ke null setelah hapus)
 */
export function useHapusProfilKlinik(profileData, showToast, setProfileData) {
  const handleDeleteProfile = async (onClose) => {
    if (!profileData) return;
    const id =
      profileData.idProfil ||
      profileData.id_profile ||
      profileData.idProfile ||
      profileData.id;
    if (!id) return;

    try {
      const res = await axiosClient.delete(`${endpoints.admin.clinic}/${id}`);
      if (res.data?.success) {
        showToast("Berhasil menghapus profil klinik", "success");
        if (onSuccess) onSuccess();
        setProfileData(null);
        onClose && onClose();
      }
    } catch (error) {
      console.error("Hapus profil klinik gagal:", error);
      showToast("Gagal menghapus profil klinik.", "error");
      onClose && onClose();
    }
  };

  return { handleDeleteProfile };
}

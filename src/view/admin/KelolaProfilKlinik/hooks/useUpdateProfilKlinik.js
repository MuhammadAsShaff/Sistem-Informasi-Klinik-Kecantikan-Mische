import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * Hook untuk memperbarui atau membuat profil klinik (CREATE / UPDATE).
 * Menggunakan FormData karena mendukung upload gambar.
 *
 * @param {Object|null} profileData - Data profil saat ini (null = mode CREATE)
 * @param {Function}    showToast   - Fungsi untuk menampilkan notifikasi
 * @param {Function}    onSuccess   - Callback setelah berhasil (refresh data)
 */
export function useUpdateProfilKlinik(profileData, showToast, onSuccess) {
  const handleUpdateProfile = async (formData) => {
    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) payload.append(key, formData[key]);
      });

      const id = profileData
        ? profileData.idProfil || profileData.id_profile || profileData.idProfile || profileData.id
        : null;

      let res;
      if (profileData && id) {
        // UPDATE: gunakan POST + _method=PUT karena FormData tidak bisa PUT langsung
        payload.append("_method", "PUT");
        res = await axiosClient.post(`${endpoints.admin.clinic}/${id}`, payload);
      } else {
        // CREATE
        res = await axiosClient.post(endpoints.admin.clinic, payload);
      }

      if (res.data?.success) {
        showToast("Berhasil memperbarui profil klinik", "success");
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Update Profile Error:", error.response?.data || error.message);
      let errorMsg = "Gagal memperbarui profil klinik.";
      if (error.response?.data?.errors) {
        errorMsg = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      showToast(errorMsg, "error");
    }
  };

  return { handleUpdateProfile };
}

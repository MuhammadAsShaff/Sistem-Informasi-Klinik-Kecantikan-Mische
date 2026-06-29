import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * KURIR PENCATAT BUKU RIWAYAT KLINIK (useUpdateProfilKlinik)
 * Ibarat kurir khusus pengantar map besar (FormData) yang memuat cerita, visi, misi, dan foto klinik.
 * Kurir ini sangat pintar: jika buku riwayat lamanya sudah ada, ia akan menempelkan stempel perbaikan (PUT). 
 * Namun jika klinik baru berdiri dan belum punya riwayat, ia akan mendaftarkannya sebagai buku baru (POST).
 */
export function useUpdateProfilKlinik(profileData, showToast, onSuccess) {
  // Fungsi penyerahan map isian ke kurir
  const handleUpdateProfile = async (formData) => {
    try {
      // Membungkus seluruh isian ke dalam map khusus yang kedap air (FormData)
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) payload.append(key, formData[key]);
      });

      // Mencari tahu nomor ID buku riwayat lama (jika ada)
      const id = profileData
        ? profileData.idProfil || profileData.id_profile || profileData.idProfile || profileData.id
        : null;

      let res;
      if (profileData && id) {
        // JIKA BUKU LAMA SUDAH ADA: Kurir melampirkan stempel pembaruan data lama (PUT)
        payload.append("_method", "PUT");
        res = await axiosClient.post(`${endpoints.admin.clinic}/${id}`, payload);
      } else {
        // JIKA BUKU BELUM ADA SAMA SEKALI: Kurir mendaftarkannya sebagai buku riwayat baru (CREATE)
        res = await axiosClient.post(endpoints.admin.clinic, payload);
      }

      // Jika manajemen pusat menerima mapnya, teriakkan pengumuman sukses lewat TOA
      if (res.data?.success) {
        showToast("Berhasil memperbarui profil klinik", "success");
        if (onSuccess) onSuccess(); // Suruh asisten penjaga menyegarkan buku di atas meja
      }
    } catch (error) {
      console.error("Update Profile Error:", error.response?.data || error.message);
      let errorMsg = "Gagal memperbarui profil klinik.";
      // Jika manajemen pusat menolak (misal isiannya salah format), bacakan alasannya
      if (error.response?.data?.errors) {
        errorMsg = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      showToast(errorMsg, "error");
    }
  };

  // Serahkan kurir ini ke meja pengaturan utama
  return { handleUpdateProfile };
}

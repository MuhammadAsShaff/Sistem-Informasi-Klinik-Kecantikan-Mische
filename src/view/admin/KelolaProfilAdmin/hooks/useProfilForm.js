import { useState } from "react";
import { useUbahPasswordAdmin } from "./useUbahPasswordAdmin";

/**
 * PENGURUS PINTU GERBANG PASSWORD (useProfilForm)
 * Ibarat petugas penjaga gembok rahasia di dalam meja formulir profil. Petugas ini memegang 
 * saklar pembuka jendela pop-up "Ubah Password". Saat saklar ditekan, dia memanggil tukang kunci 
 * khusus (useUbahPasswordAdmin) untuk mengganti gembok lama dengan gembok baru.
 */
export const useProfilForm = (formData, showToast, onUserUpdated) => {
  // Saklar pembuka dan penutup kotak pop-up Ubah Password
  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);

  // Memanggil tukang kunci gembok password
  const passwordHook = useUbahPasswordAdmin(
    formData,
    (updatedUser) => {
      // Jika gembok berhasil diganti, teriakkan pengumuman sukses lewat TOA
      showToast("Password berhasil diperbarui!", "success");
      setIsModalPasswordOpen(false); // Segera tutup kembali kotak gemboknya
      onUserUpdated && onUserUpdated(updatedUser); // Segarkan catatan admin
    }
  );

  // Bagikan saklar dan alat tukang kunci ini ke tampilan formulir
  return {
    isModalPasswordOpen,
    setIsModalPasswordOpen,
    passwordHook
  };
};

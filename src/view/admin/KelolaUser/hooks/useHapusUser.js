import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * =========================================================================
 * PETUGAS PENCORET KEANGGOTAAN (useHapusUser)
 * =========================================================================
 * Ibarat petugas disiplin yang bersiap di depan buku besar keanggotaan klinik.
 * Ketika pimpinan menunjuk salah satu anggota dan memberi instruksi cabut keanggotaan,
 * petugas ini mencoret nama tersebut dari loket pusat secara permanen. Jika halaman terakhir 
 * kehabisan baris nama, petugas ini pintar membalik buku ke halaman sebelumnya.
 */
export function useHapusUser(
  selectedUser,
  currentPage,
  dataLength,
  fetchUsers,
  setCurrentPage,
  showToast
) {
  /**
   * TUGAS EKSEKUSI PENCORETAN ANGGOTA (confirmDelete)
   * Petugas mencari nomor anggota di loket pusat, mencoretnya, dan menyesuaikan halaman buku arsip.
   */
  const confirmDelete = async (onClose, onSuccess) => {
    if (!selectedUser) return; // Jika tidak ada berkas anggota, petugas diam saja
    try {
      const idUser = selectedUser.idUser || selectedUser.id;
      await axiosClient.delete(`${endpoints.admin.users}/${idUser}`);
      showToast("Berhasil menghapus user", "success");
      if (onSuccess) onSuccess();

      // Jika halaman terakhir hanya tinggal 1 baris dan dicoret habis, petugas membalik ke halaman sebelumnya
      if (dataLength === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchUsers(currentPage); // Minta asisten menyegarkan halaman saat ini
      }
      onClose(); // Tutup plang peringatan
    } catch (error) {
      console.error("Gagal menghapus user:", error);
      let errorMessage = "Terjadi kesalahan saat menghapus user.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, "error"); // Umumkan di mikrofon jika kandas
    }
  };

  // Petugas menyerahkan keahlian mencoret kepada plang peringatan (ModalHapusUser)
  return { confirmDelete };
}

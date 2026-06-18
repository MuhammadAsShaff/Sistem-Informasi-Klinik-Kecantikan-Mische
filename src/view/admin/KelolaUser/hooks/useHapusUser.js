import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

/**
 * Hook untuk menghapus user (DELETE).
 * @param {Object|null} selectedUser - User yang dipilih untuk dihapus
 * @param {number} currentPage - Halaman aktif saat ini (untuk logika pindah halaman)
 * @param {number} dataLength - Jumlah data di halaman saat ini
 * @param {Function} fetchUsers - Fungsi untuk me-refresh daftar user
 * @param {Function} setCurrentPage - Fungsi untuk mengubah halaman aktif
 * @param {Function} showToast - Fungsi untuk menampilkan notifikasi
 */
export function useHapusUser(
  selectedUser,
  currentPage,
  dataLength,
  fetchUsers,
  setCurrentPage,
  showToast
) {
  const confirmDelete = async (onClose, onSuccess) => {
    if (!selectedUser) return;
    try {
      const idUser = selectedUser.idUser || selectedUser.id;
      await axiosClient.delete(`${endpoints.admin.users}/${idUser}`);
      showToast("Berhasil menghapus user", "success");
      if (onSuccess) onSuccess();

      // Jika halaman terakhir hanya punya 1 data, kembali ke halaman sebelumnya
      if (dataLength === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchUsers(currentPage);
      }
      onClose();
    } catch (error) {
      console.error("Gagal menghapus user:", error);
      let errorMessage = "Terjadi kesalahan saat menghapus user.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, "error");
    }
  };

  return { confirmDelete };
}

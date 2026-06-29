import { useState } from 'react';
import { useHapusKategori } from './useHapusKategori';

/**
 * =========================================================================
 * PENGATUR KOTAK KONFIRMASI HAPUS (Ibarat Petugas Pengaman Hapus Data)
 * =========================================================================
 * File ini ibarat "Petugas Pengaman" di kotak pop-up konfirmasi hapus.
 * Tugasnya mengunci tombol saat proses penghapusan berlangsung agar tidak ditekan
 * berkali-kali, lalu memberitahu sistem untuk menghapus kategori tersebut.
 *
 * @param {number|string} dataId - ID kategori yang ingin dihapus.
 * @param {Function} refetch - Fungsi menyegarkan tabel setelah dihapus.
 * @param {Function} showToast - Fungsi menampilkan notifikasi berhasil/gagal.
 * @param {Function} onClose - Fungsi menutup kotak pop-up.
 */
export const useModalHapusKategori = (dataId, refetch, showToast, onClose) => {
  // Penanda untuk mengunci tombol hapus saat proses sedang berjalan
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Meminta bantuan fungsi penghapus utama
  const { hapusKategori } = useHapusKategori(refetch);

  /*
    FUNGSI EKSEKUSI HAPUS (handleDelete):
    Dijalankan saat admin menekan tombol "Ya, Hapus".
  */
  const handleDelete = async () => {
    // Jika tidak ada ID kategori yang mau dihapus, batalkan
    if (!dataId) return;
    
    // 1. Kunci tombol hapus sementara
    setIsDeleting(true);
    // 2. Kirim permintaan hapus ke server
    const result = await hapusKategori(dataId);
    // 3. Buka kembali kunci tombol setelah selesai
    setIsDeleting(false);

    // 4. Jika berhasil dihapus
    if (result.success) {
      showToast("Berhasil menghapus kategori produk", 'success'); // Tampilkan pesan berhasil
      onClose(); // Tutup kotak pop-up
    } else {
      // Jika gagal, tampilkan pesan gagal di pojok layar
      showToast(result.message, 'error');
    }
  };

  // Mengirimkan penanda kunci (isDeleting) dan fungsi hapus (handleDelete) ke kotak pop-up
  return {
    isDeleting,
    handleDelete
  };
};

import { useState } from 'react';
import { useHapusProduk } from './useHapusProduk';

/**
 * PENGURUS KOTAK KONFIRMASI HAPUS (useModalHapusProduk)
 * Ibarat petugas keamanan yang berdiri di depan mesin penghancur kertas. 
 * Tugasnya memastikan admin benar-benar menekan tombol "Ya, Hapus", memanggil eksekutor penghapus,
 * dan menutup jendela pop-up setelah tugas selesai.
 */
export const useModalHapusProduk = (dataId, refetch, showToast, onClose) => {
  // Saklar penanda apakah proses penghapusan sedang berlangsung (agar tombol tidak ditekan dua kali)
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Memanggil asisten eksekutor penghapus
  const { hapusProduk } = useHapusProduk(refetch);

  // Fungsi yang dijalankan saat tombol "Ya, Hapus" ditekan
  const handleDelete = async () => {
    if (!dataId) return; // Jika tidak ada ID barang yang ditunjuk, diam saja

    setIsDeleting(true); // Nyalakan tanda "Sedang Menghapus..."
    const result = await hapusProduk(dataId); // Minta eksekutor menghapus barang di gudang
    setIsDeleting(false); // Matikan tanda sibuk

    // Jika berhasil, beri tahu admin lewat TOA pengumuman, lalu tutup jendela pop-up
    if (result.success) {
      showToast("Berhasil menghapus produk", 'success');
      onClose();
    } else {
      // Jika gagal, umumkan pesan kesalahannya
      showToast(result.message, 'error');
    }
  };

  return {
    isDeleting,
    handleDelete
  };
};

import { useState } from 'react';
import { useHapusTestimoni } from './useHapusTestimoni';

/**
 * =========================================================================
 * ASISTEN PENGAWAL PLANG PENCOPOTAN (useModalHapus)
 * =========================================================================
 * Ibarat asisten penegak tata tertib yang mengawal plang peringatan pencopotan ulasan.
 * Asisten ini memastikan pimpinan benar-benar setuju sebelum memanggil Petugas Pembersih (useHapusTestimoni)
 * untuk merobek lembar pujian dari dinding mading.
 */
export const useModalHapus = (data, refetch, showToast, onClose) => {
  // Rambu penanda asisten sedang memandu Petugas Pembersih merobek berkas
  const [isDeleting, setIsDeleting] = useState(false);
  // Mempekerjakan Petugas Pembersih & Pencopot Testimoni
  const { hapusTestimoni } = useHapusTestimoni(refetch);

  /**
   * TUGAS EKSEKUSI PEMUSNAHAN BERKAS (handleDelete)
   * Asisten memastikan ada berkas yang ditunjuk (data), lalu menyuruh Petugas Pembersih beraksi.
   */
  const handleDelete = async () => {
    if (!data) return; // Jika tidak ada berkas, asisten diam saja
    setIsDeleting(true); // Nyalakan lampu tanda petugas sibuk mencopot
    const result = await hapusTestimoni(data.id || data.idTestimoni);
    setIsDeleting(false); // Matikan lampu tanda sibuk

    if (result.success) {
      showToast("Berhasil menghapus testimoni", "success");
      onClose(); // Tutup plang peringatan
    } else {
      showToast(result.message, "error"); // Umumkan jika kandas
    }
  };

  // Asisten menyerahkan tombol eksekusi dan rambu sibuk kepada plang peringatan (view)
  return {
    isDeleting,
    handleDelete
  };
};

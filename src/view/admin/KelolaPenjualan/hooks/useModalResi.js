import { useState, useEffect } from 'react';

/**
 * =========================================================================
 * PENGATUR KOTAK ISIAN NOMOR RESI (Ibarat Petugas Pencatat Nomor Resi)
 * =========================================================================
 * File ini ibarat "Asisten Pencatat Resi" di meja pengiriman barang.
 * Saat admin membuka kotak pop-up untuk mengisi nomor resi suatu pesanan,
 * file ini bertugas memeriksa apakah pesanan tersebut sudah punya nomor resi lama.
 * Jika ada, tampilkan. Saat tombol simpan ditekan, kirim nomor resi baru ke server.
 */
export const useModalResi = (data, onSave) => {
  // 1. Tempat menyimpan nomor resi yang diketik oleh admin
  const [nomorResi, setNomorResi] = useState('');
  // 2. Penanda untuk mengunci tombol simpan agar tidak ditekan berkali-kali saat proses menyimpan berlangsung
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- PEMERIKSAAN NOMOR RESI LAMA ---
  // Setiap kali pop-up dibuka dan data pesanan masuk (`data`)
  useEffect(() => {
    if (data) {
      // Masukkan nomor resi lama ke dalam kotak isian (jika belum ada, biarkan kosong)
      setNomorResi(data.nomorResi || '');
    }
  }, [data]);

  // --- FUNGSI MENYIMPAN NOMOR RESI ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah halaman web me-reload (berkedip) saat tombol ditekan
    setIsSubmitting(true); // Kunci tombol simpan sementara
    // Panggil fungsi utama untuk mengirim nomor resi ke server
    await onSave(data.idPenjualan || data.id, nomorResi);
    setIsSubmitting(false); // Buka kembali kunci tombol setelah selesai
  };

  // Mengirimkan nomor resi dan fungsi simpan ini ke kotak pop-up ModalResi
  return {
    nomorResi,
    setNomorResi,
    isSubmitting,
    handleSubmit
  };
};

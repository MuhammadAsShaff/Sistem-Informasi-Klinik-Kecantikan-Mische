/* 
 * =========================================================================
 * FORMAT CURRENCY (MESIN PENCETAK LABEL HARGA / KASIR)
 * =========================================================================
 * Fungsi ini bertugas seperti alat kasir yang otomatis menambahkan tulisan "Rp" 
 * dan titik pemisah ribuan pada angka mentah dari server.
 * 
 * Contoh Kasus: 
 * Angka Mentah dari database Backend : 150000 
 * Keluar di layar aplikasi Frontend : Rp 150.000
 */
export const formatCurrency = (value) => {
  // Jika harganya kosong, error, atau tidak ada, anggap saja Rp 0
  // tanda || itu atau
  if (value === null || value === undefined) return 'Rp 0';
  
  // Intl.NumberFormat adalah fitur bawaan komputer (standar internasional) 
  // untuk mendandani angka agar sesuai dengan format negara tertentu.
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', // Gaya: Mata Uang
    currency: 'IDR', // Jenis: Rupiah Indonesia
    minimumFractionDigits: 0, // Jangan tampilkan angka koma di belakang (contoh: ,00)
    maximumFractionDigits: 0,
  }).format(value);
};

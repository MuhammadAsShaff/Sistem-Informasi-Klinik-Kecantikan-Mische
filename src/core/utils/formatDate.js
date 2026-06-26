/* 
 * =========================================================================
 * FORMAT DATE (KALENDER PINTAR PENTERJEMAH WAKTU)
 * =========================================================================
 * Fungsi ini bertugas mengubah teks tanggal komputer yang jelek dan kaku 
 * menjadi bahasa tanggal Indonesia yang enak dibaca oleh pelanggan.
 * 
 * Contoh Kasus:
 * Dari database Backend: "2026-05-17T14:30:00.000Z" (Format ISO Computer)
 * Keluar di layar web : "17 Mei 2026"
 */

export const formatDate = (date) => {
  if (!date) return '-'; // Jika datanya kosong/tidak ada tanggal, tampilkan garis strip saja
  
  const d = new Date(date); // Ubah teks mentah tadi menjadi "Objek Kalender" standar
  if (isNaN(d.getTime())) return '-'; // Jika tanggalnya ngawur atau error, tampilkan strip
  
  const day = String(d.getDate()).padStart(2, '0'); // Ambil tanggalnya (misal: 17)
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const monthName = months[d.getMonth()]; // Ambil nama bulan berdasarkan urutannya
  const year = d.getFullYear(); // Ambil tahunnya (misal: 2026)
  
  return `${day} ${monthName} ${year}`; // Gabungkan semuanya!
};

/* 
 * =========================================================================
 * FORMAT DATE TIME (JAM DINDING & KALENDER PINTAR)
 * =========================================================================
 * Sama persis seperti fungsi di atas, tapi ini ditambahkan keterangan Jam dan Menit.
 * Keluar di layar web : "17 Mei 2026, 14:30 WIB"
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const monthName = months[d.getMonth()];
  const year = d.getFullYear();
  
  const hours = String(d.getHours()).padStart(2, '0'); // Ambil angkam jam
  const minutes = String(d.getMinutes()).padStart(2, '0'); // Ambil angka menit
  
  return `${day} ${monthName} ${year}, ${hours}:${minutes} WIB`; // Gabungkan dengan jam dan tambahan kata "WIB"!
};

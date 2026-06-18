/**
 * Fungsi pembantu untuk memformat tanggal ke format lokal Indonesia.
 * @param {string|Date} date - Tanggal yang akan diformat.
 * @returns {string} String tanggal, misal: "17 Mei 2026"
 */
export const formatDate = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const monthName = months[d.getMonth()];
  const year = d.getFullYear();
  
  return `${day} ${monthName} ${year}`;
};

/**
 * Fungsi untuk memformat tanggal dan waktu (Timestamp)
 * @param {string|Date} date - Tanggal dan waktu yang akan diformat
 * @returns {string} String waktu, misal: "17-05-2026, 14:30 WIB"
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const monthName = months[d.getMonth()];
  const year = d.getFullYear();
  
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${day} ${monthName} ${year}, ${hours}:${minutes} WIB`;
};

/**
 * Fungsi pembantu untuk memformat tanggal ke format lokal Indonesia.
 * @param {string|Date} date - Tanggal yang akan diformat.
 * @returns {string} String tanggal, misal: "17 Mei 2026"
 */
export const formatDate = (date) => {
  if (!date) return '-';
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('id-ID', options);
};

/**
 * Fungsi untuk memformat tanggal dan waktu (Timestamp)
 * @param {string|Date} date - Tanggal dan waktu yang akan diformat
 * @returns {string} String waktu, misal: "17 Mei 2026, 14:30 WIB"
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  
  const options = { 
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  };
  return new Date(date).toLocaleDateString('id-ID', options) + ' WIB';
};

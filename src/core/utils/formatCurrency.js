/**
 * Fungsi pembantu untuk memformat angka menjadi format Rupiah.
 * @param {number} value - Nilai nominal dalam angka.
 * @returns {string} String yang diformat dengan "Rp", misal: "Rp 150.000"
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

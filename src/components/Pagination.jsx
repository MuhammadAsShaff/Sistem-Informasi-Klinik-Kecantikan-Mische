import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/* 
 * KOMPONEN: Pagination
 * FUNGSI: Membuat tombol navigasi halaman (Angka 1, 2, 3, dan tombol Next/Prev) 
 *         untuk membagi daftar data yang panjang menjadi beberapa halaman.
 */
//const itu seperti function untuk membuat sesuatu yang bersifat tetap
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Jika tidak ada data atau halamannya 0, jangan tampilkan apa-apa (null)
  if (totalPages <= 0) return null;

  // Fungsi untuk mundur 1 halaman (selama halamannya bukan halaman pertama)
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  // Fungsi untuk maju 1 halaman (selama halamannya belum mentok di halaman terakhir)
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-between mt-6 px-2">
      {/* Tombol Mundur (Previous) */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1} // Tombol dimatikan/dibekukan kalau sudah di halaman 1
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-colors shadow-sm ${currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'border-gray-400 text-gray-900 hover:bg-gray-100 bg-white cursor-pointer'}`}
      >
        <ArrowLeft size={16} /> Previous
      </button>

      {/* Barisan Tombol Angka Halaman (1, 2, 3, dst.) */}
      <div className="flex items-center gap-1">
        {/* Membuat kumpulan tombol angka sebanyak jumlah total halaman */}
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage; // Mengecek apakah tombol angka ini adalah halaman yang sedang dibuka
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)} // Saat angka diklik, pindah ke halaman tersebut
              className={`w-8 h-8 flex items-center justify-center rounded text-sm shadow-sm font-semibold transition-colors ${isActive ? 'bg-[#97E779] text-black' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Tombol Maju (Next) */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages} // Tombol dimatikan kalau sudah di halaman terakhir
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-colors shadow-sm ${currentPage === totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'border-gray-400 text-gray-900 hover:bg-gray-100 bg-white cursor-pointer'}`}
      >
        Next <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;

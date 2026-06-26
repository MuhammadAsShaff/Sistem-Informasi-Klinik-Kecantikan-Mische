import React from "react";
import { Search } from "lucide-react";

/* 
 * KOMPONEN: SearchBar
 * FUNGSI: Menampilkan kotak input teks untuk mencari data.
 *         Komponen ini dibuat fleksibel sehingga bisa disisipkan komponen tambahan 
 *         di sebelah kiri (leftComponents) atau kanan (rightComponents) jika perlu.
 */
export default function SearchBar({
  searchQuery,       // Variabel yang menyimpan kata kunci yang sedang diketik user
  setSearchQuery,    // Fungsi untuk mengubah variabel 'searchQuery' saat user mengetik
  placeholder = "Cari..", // Teks bayangan bantuan di dalam kotak input
  leftComponents,    // Tempat cadangan untuk menaruh tombol tambahan di kiri kotak pencarian
  rightComponents    // Tempat cadangan untuk menaruh tombol tambahan di kanan kotak pencarian (contoh: tombol Tambah Data)
}) {
  return (
    <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-2 mb-6">
      
      {/* Menampilkan komponen cadangan kiri (jika ada yang dikirim dari halaman pemanggil) */}
      {leftComponents}

      {/* Kotak Input Pencarian */}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          // Fungsi onChange: setiap kali tombol keyboard ditekan, e.target.value (teks terbaru) dikirim ke fungsi set
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)} 
          className="bg-[#F3F4F6] border-none px-6 py-2.5 rounded-md text-sm w-[250px] focus:ring-2 focus:ring-[#7CC052] transition-all outline-none text-gray-700"
        />
      </div>

      {/* Tombol Kaca Pembesar (Hanya untuk estetika UI, karena pencarian biasanya otomatis saat mengetik) */}
      <button className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer">
        <Search size={20} />
      </button>

      {/* Menampilkan komponen cadangan kanan (contoh: tombol Export, Tambah Produk, dll) */}
      {rightComponents}
    </div>
  );
}

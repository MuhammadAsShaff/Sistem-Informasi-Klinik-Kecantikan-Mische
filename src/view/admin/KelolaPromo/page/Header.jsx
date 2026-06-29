import React from "react";

/**
 * PAPAN PLANG PENGUMUMAN BALAI PROMO (Header)
 * Ibarat papan plang besar yang terpasang di atas pintu gerbang "Balai Pengelolaan Promo".
 * Papan ini menyapa admin dengan jelas: "Di ruangan ini Anda bisa mendaftarkan promo baru, 
 * mengoreksi syarat yang keliru, atau menghapus promo yang sudah kadaluarsa".
 */
export default function Header() {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-medium text-black mb-2 tracking-tight">
        Promo Yang Terdaftar Pada Sistem
      </h1>
      <p className="text-[13px] text-gray-500 font-regular leading-relaxed max-w-[1200px]">
        Halaman Ini Menampilkan Informasi mengenai Promo yang ada dan Anda Dapat Menambah, Memperbarui, Atau Menghapus Promo Melalui Halaman Ini.
      </p>
    </div>
  );
}

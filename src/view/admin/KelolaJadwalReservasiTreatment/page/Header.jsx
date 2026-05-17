import React from 'react';

const Header = () => (
  <div className="mb-4">
    <h1 className="text-3xl font-medium text-black tracking-tighter">Data Jadwal Reservasi Treatment</h1>
    <p className="text-black text-sm mt-1">
      Menampilkan data jadwal reservasi treatment lengkap dengan jadwal dan informasi pengguna. Admin dapat melakukan pencarian, edit, dan hapus data.
    </p>
  </div>
);

export default Header;
// const header itu berguna untuk membua komponen yang namanya header yang dimana tanda () akan langsung menampilkan isi didalamnya.
//div classname itu untuk pembungkus kontainer agar bisa di styling
// mb-4 itu untuk memberikan jarak antar baris, dalam kasus ini jarak antara header dan search bar.
// text-3xl itu untuk mengubah ukuran font menjadi 3xl.
// tracking-tight itu untuk mengatur jarak antar karakter agar sedikit lebih rapat.
// mt-1 itu untuk memberikan jarak antar baris, dalam kasus ini jarak antara header dan search bar.

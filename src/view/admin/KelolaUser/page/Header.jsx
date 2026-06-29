import React from "react";

/**
 * PLANG MEGAH SAMBUTAN BALAI KEANGGOTAAN (Header)
 * Ibarat papan plang kayu megah berukir indah yang terpasang di depan balai pendaftaran anggota.
 * Plang ini menyambut setiap pimpinan yang datang dan menjelaskan bahwa di ruangan ini pimpinan 
 * bisa melihat seluruh informasi keanggotaan klinik, baik admin, staf, maupun customer.
 */
export default function Header() {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-medium text-black mb-3">
        User Yang Terdaftar Pada Sistem
      </h1>
      <p className="text-sm text-black max-w-[1500px]">
       Halaman Ini Menampilkan Informasi Tim Admin, Termasuk Status Terkini Dan Detail Lainnya. Anda Dapat Dengan Mudah Melihat Siapa Yang Sedang Online,Offline, Serta Melihat Statistik Anggota.
      </p>
    </div>
  );
}

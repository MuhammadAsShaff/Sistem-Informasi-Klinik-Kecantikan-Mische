import React from "react";
import ModalUbahPasswordAdmin from "./ModalUbahPasswordAdmin";
import { useProfilForm } from "../hooks/useProfilForm";

/**
 * MEJA FORMULIR ISIAN BIODATA (ProfilForm)
 * Ibarat meja panjang tempat meletakkan selembar kertas formulir lengkap berisi kotak isian 
 * nama, email, tanggal lahir, jenis kelamin, nomor WA, dan tombol ganti password. 
 * Urusan ketik-mengetik dan penyerahannya dibantu oleh juru tulis (useUpdateProfilAdmin) 
 * yang dititipkan lewat 'hook'.
 */
const ProfilForm = ({ hook, user, showToast, onUserUpdated }) => {
  // Meminjam pena, kertas isian, dan tombol penyerahan dari juru tulis profil
  const { formData, handleChange, handleSimpan } = hook;
  
  // Memanggil petugas penjaga gembok rahasia (untuk mengurus tombol Ubah Password)
  const {
    isModalPasswordOpen,
    setIsModalPasswordOpen,
    passwordHook
  } = useProfilForm(formData, showToast, onUserUpdated);

  return (
    <div className="w-full">
      {/* KOTAK-KOTAK ISIAN BIODATA DI ATAS MEJA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-12">

        {/* Kotak Isian 1: NAMA LENGKAP */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-medium text-lg">Nama</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Bintang Puspita"
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#55BC36] text-black placeholder:text-gray-600"
          />
        </div>

        {/* Kotak Isian 2: ALAMAT EMAIL */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-medium text-lg">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="BintangPuspita@gmail.com"
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#55BC36] text-black placeholder:text-gray-600"
          />
        </div>

        {/* Kotak Isian 3: TANGGAL LAHIR */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-medium text-lg">Tanggal Lahir</label>
          <input
            type="date"
            name="tanggalLahir"
            value={formData.tanggalLahir}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#55BC36] text-black"
          />
        </div>

        {/* Kotak Isian 4: PEMILIHAN JENIS KELAMIN */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-medium text-lg">Jenis Kelamin</label>
          <select
            name="jenisKelamin"
            value={formData.jenisKelamin}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#55BC36] text-black appearance-none bg-transparent"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='black'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1.2em",
            }}
          >
            <option value="" disabled>Pilih Jenis Kelamin</option>
            <option value="Perempuan">Perempuan</option>
            <option value="Laki-laki">Laki-laki</option>
          </select>
        </div>

        {/* Kotak Isian 5: NOMOR WHATSAPP */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-medium text-lg">Nomor Whatsapp</label>
          <input
            type="text"
            name="nomorWa"
            value={formData.nomorWa}
            onChange={handleChange}
            placeholder="08xx-xxxx-xxxx"
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#55BC36] text-black placeholder:text-gray-600"
          />
        </div>

        {/* Kotak Isian 6: TOMBOL UBAH PASSWORD */}
        <div className="flex flex-col gap-2 items-start">
          <label className="text-black font-medium text-lg">Password</label>
          <button
            onClick={(e) => { e.preventDefault(); setIsModalPasswordOpen(true); }}
            className="text-[#74b35e] font-bold hover:bg-[#e4f4df] transition-colors text-sm bg-[#f2faef] px-5 py-3 rounded-md border border-[#cce8c3]"
          >
            Ubah Password
          </button>
        </div>

        {/* Kotak Isian 7: UNGGAH FOTO PROFIL BARU */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-medium text-lg">Foto Profil</label>
          <div className="flex items-center gap-3">
            <label className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-5 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer inline-block">
              Choose File
              <input
                type="file"
                name="fotoProfil"
                accept="image/*"
                onChange={handleChange}
                className="sr-only"
              />
            </label>
            <span className="text-sm text-gray-500 font-medium truncate max-w-[200px]">
              {(formData.fotoProfil && typeof formData.fotoProfil === 'object' && formData.fotoProfil.name) || "No File Chosen"}
            </span>
          </div>
        </div>

      </div>

      {/* Garis Pemisah Pembatas Meja */}
      <hr className="border-gray-300 mb-8" />

      {/* TOMBOL SIMPAN DI BAGIAN BAWAH MEJA */}
      <div className="flex flex-col gap-10">
        <div className="flex justify-end">
          <button
            onClick={handleSimpan}
            className="bg-[#56BC36] hover:bg-[#4ea830] text-white font-semibold py-3 px-6 rounded-md shadow-sm transition-colors text-[15px]"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>

      {/* BILIK KOTAK POP-UP UBAH PASSWORD (MUNCUL KALAU TOMBOL DITEKAN) */}
      <ModalUbahPasswordAdmin
        isOpen={isModalPasswordOpen}
        onClose={() => {
          passwordHook.reset();
          setIsModalPasswordOpen(false);
        }}
        hook={passwordHook}
      />
    </div>
  );
};

export default ProfilForm;

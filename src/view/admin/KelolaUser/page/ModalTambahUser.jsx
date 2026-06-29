import React from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { PROVINCES } from "@/core/utils/rajaOngkirData";
import { useModalTambahUser } from "../hooks/useModalTambahUser";

/**
 * BILIK MEJA PENDAFTARAN ANGGOTA BARU (ModalTambahUser)
 * Ibarat bilik meja lipat terang di sudut balai tempat asisten membagikan kertas formulir pendaftaran putih bersih.
 * Di meja ini, pimpinan bisa mencatat nama anggota baru, alamat email, membuat kata sandi baru,
 * memilih jenis kelamin, menentukan kedudukan (Admin/Customer), tanggal lahir, serta nomor WhatsApp.
 * Khusus jika mendaftar sebagai "Customer", asisten pintar langsung menggelar laci atlas untuk mencatat rincian
 * provinsi, kota/kabupaten, kecamatan, kode pos, dan detail jalan.
 * Segala urusan pengawalan kelengkapan formulir dibantu oleh Asisten Pengawal Meja (useModalTambahUser).
 */
export default function ModalTambahUser({ isOpen, onClose, hook }) {
  // Meminta pena, laci isian, saklar senter, dan atlas kota dari Asisten Pengawal Meja Pendaftaran
  const {
    formData,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
    localCities,
    fetchCities
  } = useModalTambahUser(hook);

  if (!isOpen) return null; // Jika saklar ditutup, bilik meja pendaftaran ini disimpan kembali

  return (
    <>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[900px] rounded-[24px] shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">

        {/* Atap Bilik Pendaftaran */}
        <div className="px-10 py-6 flex items-center justify-between border-b border-gray-100 shrink-0">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">Tambah User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Ruangan Formulir Meja Kerja */}
        <div className="px-10 py-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-10">

            {/* Kotak Isian Nama User */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Nama user</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Nama user"
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-500"
              />
            </div>

            {/* Kotak Isian Email */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-500"
              />
              <p className="text-[11px] text-red-500 italic mt-0.5">* Pastikan format email valid (@gmail.com)</p>
            </div>

            {/* Kotak Isian Password */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan Password"
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-500 pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-[11px] text-red-500 italic mt-0.5">* Minimal 8 karakter, mengandung huruf BESAR dan kecil</p>
            </div>

            {/* Kotak Pilihan Jenis Kelamin */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Jenis Kelamin</label>
              <select
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleChange}
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-500"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-Laki">Laki-Laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Kotak Pilihan Role */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-500"
              >
                <option value="">Pilih Role</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {/* Kotak Isian Tanggal Lahir */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Tanggal Lahir</label>
              <input
                type="date"
                name="tanggalLahir"
                value={formData.tanggalLahir}
                onChange={handleChange}
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-500"
              />
            </div>

            {/* Kotak Isian Nomor Whatsapp */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Nomor Whatsapp</label>
              <input
                type="text"
                name="nomorWa"
                value={formData.nomorWa}
                onChange={handleChange}
                placeholder="Nomor Whatsapp"
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-500"
              />
              <p className="text-[11px] text-red-500 italic mt-0.5">* Hanya angka (contoh: 08123456789)</p>
            </div>

            {/* --- GELARAN LACI ATLAS KHUSUS CUSTOMER --- */}
            {formData.role === 'customer' && (
              <div className="col-span-2 grid grid-cols-2 gap-x-12 gap-y-8 mt-4 border-t border-gray-100 pt-6">
                <div className="col-span-2">
                  <h3 className="text-lg font-bold text-[#1A1A1A]">Detail Alamat Lengkap</h3>
                  <p className="text-sm text-gray-500">Silakan lengkapi alamat detail untuk customer.</p>
                </div>

                {/* Pilihan Provinsi */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-bold text-[#1A1A1A]">Provinsi</label>
                  <select
                    name="provinceId"
                    value={formData.provinceId}
                    onChange={(e) => {
                       handleChange(e);
                       fetchCities(e.target.value); // Asisten membuka atlas kota
                    }}
                    className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-700"
                  >
                    <option value="">Pilih Provinsi</option>
                    {PROVINCES.map(prov => (
                      <option key={prov.province_id} value={prov.province_id}>
                        {prov.province}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pilihan Kota/Kabupaten */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-bold text-[#1A1A1A]">Kota/Kabupaten</label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleChange}
                    disabled={!formData.provinceId}
                    className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">Pilih Kota/Kabupaten</option>
                    {localCities.map(city => (
                      <option key={city.city_id} value={city.city_id}>
                        {city.type} {city.city_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kotak Isian Kecamatan */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-bold text-[#1A1A1A]">Kecamatan</label>
                  <input
                    type="text"
                    name="kecamatan"
                    value={formData.kecamatan}
                    onChange={handleChange}
                    placeholder="Contoh: Gubeng"
                    className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-300"
                  />
                </div>

                {/* Kotak Isian Kode Pos */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-bold text-[#1A1A1A]">Kode Pos</label>
                  <input
                    type="text"
                    name="kodePos"
                    value={formData.kodePos}
                    onChange={handleChange}
                    placeholder="Contoh: 60281"
                    className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-300"
                  />
                </div>

                {/* Kotak Isian Detail Alamat Lengkap */}
                <div className="flex flex-col gap-2.5 col-span-2">
                  <label className="text-sm font-bold text-[#1A1A1A]">Detail Alamat Lengkap</label>
                  <textarea
                    name="detailAlamat"
                    value={formData.detailAlamat}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Nama Jalan, Gedung, No. Rumah, dll."
                    className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-300 resize-none"
                  ></textarea>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* LACI TOMBOL UTUS KURIR PENDAFTARAN */}
        <div className="px-10 py-6 flex justify-end border-t border-gray-100 shrink-0 bg-white">
          <button
            onClick={handleSubmit}
            className="bg-[#7CC052] text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-[#68a741] transition-all shadow-lg shadow-green-100"
          >
            Tambah User
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

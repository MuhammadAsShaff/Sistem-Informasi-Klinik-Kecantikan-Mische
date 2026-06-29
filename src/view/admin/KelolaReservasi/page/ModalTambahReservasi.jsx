import React from 'react';
import { useModalTambahReservasi } from '../hooks/useModalTambahReservasi';

/**
 * BILIK MEJA PENDAFTARAN TAMU BARU (ModalTambahReservasi)
 * Ibarat meja lipat khusus di lobi klinik tempat asisten menyodorkan kertas formulir baru.
 * Di meja ini, admin bisa menuliskan nama tamu, nomor WhatsApp, memilih jenis perawatan, 
 * memilih nama dokter, serta memilih jam berkunjung yang masih kosong.
 * Segala urusan pencegahan bentrok jadwal dikawal ketat oleh Asisten Pendaftaran (useModalTambahReservasi).
 */
export default function ModalTambahReservasi({ isOpen, onClose, onSubmit, isSubmitting }) {
  // Meminta kertas formulir, laci dokter, dan daftar jadwal kosong dari Asisten Pendaftaran
  const {
    formData,
    jamSelesai,
    dataDokter,
    jadwalTersedia,
    availableJenisTreatments,
    handleChange,
    handleSubmit
  } = useModalTambahReservasi(isOpen, onSubmit);

  if (!isOpen) return null; // Jika saklar ditutup, meja pendaftaran ini disimpan kembali

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 font-poppins">
        
        {/* Atap Bilik Pendaftaran */}
        <div className="px-8 py-5 border-b border-gray-300 flex justify-between items-center">
          <h3 className="text-[22px] font-bold text-black">Tambah Customer Treatment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Ruangan Formulir Meja Kerja */}
        <div className="p-8">
          <form id="formTambahReservasi" onSubmit={handleSubmit} className="space-y-6">
            
            {/* BARIS 1: Kotak Nama Tamu & Nomor WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm text-black">Nama Customer</label>
                <input 
                  type="text"
                  name="namaCustomer"
                  value={formData.namaCustomer}
                  onChange={handleChange}
                  required
                  placeholder="Isi Nama Customer"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-black">Nomor Whatsapp</label>
                <input 
                  type="text"
                  name="nomorWa"
                  value={formData.nomorWa}
                  onChange={handleChange}
                  required
                  placeholder="Isi Nomor Whatsapp"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm"
                />
                <p className="text-[11px] text-red-500 italic mt-0.5">* Harus diawali dengan '08' atau '+62' dan berisi 10-15 angka</p>
              </div>
            </div>

            {/* BARIS 2: Laci Pemilihan Jenis Treatment */}
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                <label className="text-sm text-black">Jenis Treatment</label>
                <select
                  name="jenisTreatment"
                  value={formData.jenisTreatment}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm"
                >
                  <option value="" disabled>Pilih Jenis Treatment</option>
                  {availableJenisTreatments.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* BARIS 3: Laci Pemilihan Dokter */}
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                <label className="text-sm text-black">Dokter</label>
                <select
                  name="idDokter"
                  value={formData.idDokter}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm"
                >
                  <option value="" disabled>Pilih Dokter</option>
                  {dataDokter && dataDokter.length > 0 ? (
                    dataDokter.map((doc) => (
                      <option key={doc.idDokter || doc.id} value={doc.idDokter || doc.id}>
                        {doc.nama}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Sedang memuat dokter...</option>
                  )}
                </select>
              </div>
            </div>

            {/* BARIS 4: Kotak Pemilihan Jam Mulai & Jam Selesai */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm text-black">Jam Mulai</label>
                <select
                  name="idJadwal"
                  value={formData.idJadwal}
                  onChange={handleChange}
                  required
                  disabled={!formData.idDokter}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm disabled:bg-gray-50"
                >
                  <option value="" disabled>
                    {!formData.idDokter ? 'Pilih dokter terlebih dahulu' : 'Pilih Jam Mulai'}
                  </option>
                  {jadwalTersedia && jadwalTersedia.length > 0 ? (
                    jadwalTersedia.map((jadwal) => (
                      <option key={jadwal.idJadwal} value={jadwal.idJadwal}>
                        {jadwal.jamMulai.substring(0, 5)} WIB
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {formData.idDokter ? 'Tidak ada jadwal kosong' : '...'}
                    </option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-black">Jam Selesai</label>
                <input 
                  type="text"
                  disabled
                  value={jamSelesai}
                  placeholder="Jam Selesai"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-white text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Laci Tombol Utus Kurir Pendaftaran */}
        <div className="px-8 py-5 border-t border-gray-300 flex justify-end mt-4">
          <button 
            type="submit"
            form="formTambahReservasi"
            disabled={isSubmitting}
            className={`px-8 py-2.5 text-white font-medium rounded-md
              ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#56BC36] hover:bg-[#469e2c]'}`}
          >
            {isSubmitting ? 'Menyimpan...' : 'Tambah User'}
          </button>
        </div>

      </div>
    </div>
  );
}

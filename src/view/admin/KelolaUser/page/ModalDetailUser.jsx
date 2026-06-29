import React from 'react';
import { X, User as UserIcon, Mail, Phone, Calendar, Smile, Briefcase, MapPin } from 'lucide-react';
import { formatDate } from "@/core/utils/formatDate";

/**
 * BILIK PAMERAN BUKU PROFIL ANGGOTA (ModalDetailUser)
 * Ibarat bilik pameran terang benderang tempat pimpinan meletakkan buku profil anggota di bawah kaca pembesar.
 * Di bilik ini, pimpinan bisa melihat dengan jelas inisial nama, lencana kedudukan (Admin/Staff/Customer), 
 * alamat email, nomor WhatsApp, jenis kelamin, tanggal lahir, serta menyusuri seluruh rincian riwayat alamat 
 * lengkap yang dimilikinya.
 */
export default function ModalDetailUser({ isOpen, onClose, user }) {
  if (!isOpen || !user) return null; // Jika saklar ditutup, bilik pameran ini disimpan kembali

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Tirai penutup latar belakang */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Ruangan Buku Profil */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Atap Bilik Pameran */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <UserIcon size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Detail User</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-1.5 rounded-full transition-colors">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Lembaran Isi Buku Profil */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          
          {/* Bagian Lencana & Inisial Wajah */}
          <div className="flex flex-col items-center mb-6 border-b border-gray-100 pb-6">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-full flex items-center justify-center text-blue-500 font-bold text-2xl shadow-sm mb-3">
              {(user.nama || user.name || "U")[0].toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center">{user.nama || user.name || "-"}</h3>
            <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold capitalize shadow-sm border ${
              (user.role || '').toLowerCase() === 'admin' 
                ? 'bg-orange-50 text-orange-600 border-orange-200' :
              (user.role || '').toLowerCase() === 'staff' 
                ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                'bg-green-50 text-green-600 border-green-200'
            }`}>
              {user.role || "Customer"}
            </span>
          </div>

          <div className="space-y-4">
            {/* Kartu Catatan Email */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="mt-0.5 text-gray-400">
                <Mail size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm font-medium text-gray-900">{user.email || "-"}</p>
              </div>
            </div>

            {/* Kartu Catatan Nomor WhatsApp */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="mt-0.5 text-gray-400">
                <Phone size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nomor Whatsapp</p>
                <p className="text-sm font-medium text-gray-900">{user.nomorWa || user.whatsapp || user.nomor_whatsapp || user.no_wa || "-"}</p>
              </div>
            </div>

            {/* Kartu Catatan Jenis Kelamin & Tanggal Lahir */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="mt-0.5 text-gray-400">
                  <Smile size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Jenis Kelamin</p>
                  <p className="text-sm font-medium text-gray-900">{user.jenisKelamin || user.gender || user.jenis_kelamin || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="mt-0.5 text-gray-400">
                  <Calendar size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tanggal Lahir</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.tanggalLahir || user.birth || user.tanggal_lahir ? formatDate(user.tanggalLahir || user.birth || user.tanggal_lahir) : "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Kartu Arsip Riwayat Alamat */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 mt-4">
              <div className="mt-0.5 text-gray-400">
                <MapPin size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Daftar Alamat</p>
                <div className="text-sm text-gray-900 space-y-2">
                  {(user.role || '').toLowerCase() === 'customer' ? (
                    user.alamats && user.alamats.length > 0 ? (
                      <div className="flex flex-col gap-3 w-full mt-2">
                        {user.alamats.map((alamat, index) => (
                          <div 
                            key={index} 
                            className={`flex flex-col p-4 rounded-xl border transition-all ${
                              alamat.is_utama 
                                ? 'bg-green-50/50 border-[#56BC36]/30 shadow-sm' 
                                : 'bg-white border-gray-200 shadow-sm'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                  {alamat.namaPenerima || `Alamat ${index + 1}`}
                                  {alamat.is_utama && (
                                    <span className="text-[9px] bg-[#56BC36] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                      Utama
                                    </span>
                                  )}
                                </h4>
                                {alamat.nomorHp && (
                                  <p className="text-xs font-semibold text-gray-500 mt-0.5">{alamat.nomorHp}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-gray-700 leading-relaxed bg-white/60 p-3 rounded-lg border border-gray-100/50 mt-1">
                              {alamat.detailAlamat || alamat.alamat_lengkap || alamat.alamat || '-'}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Belum ada alamat tersimpan</span>
                    )
                  ) : (
                    <span className="text-gray-400 italic">Bukan Customer</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Laci Tombol Penutup Bilik */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}

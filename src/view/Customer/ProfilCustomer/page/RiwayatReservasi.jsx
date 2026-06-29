import React from 'react';
import { ArrowLeft, Clock, Calendar, Hash, Stethoscope, Eye } from 'lucide-react';
import ModalDetailReservasi from './ModalDetailReservasi';
import { useRiwayatReservasi } from '../hooks/useRiwayatReservasi';

/**
 * =========================================================================
 * RUANG ARSIP UTAMA JADWAL KEDATANGAN (RiwayatReservasi)
 * =========================================================================
 * Ibarat ruang tabel marmer di sebelah lobi klinik tempat seluruh jadwal temu tamu
 * dicetak rapi. Menyediakan stempel status dan tombol kilat untuk mengintip
 * surat tanda bukti reservasi secara lengkap.
 */
export default function RiwayatReservasi() {
  const {
    navigate,
    myReservasi,
    isLoading,
    selectedReservasi,
    isModalDetailOpen,
    getStatusColor,
    handleOpenDetail,
    handleCloseDetail
  } = useRiwayatReservasi();

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] py-8 md:py-12 px-4 md:px-10 font-poppins">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Riwayat Reservasi Treatment</h1>
            <p className="text-sm text-gray-500">Daftar reservasi yang pernah Anda buat.</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          {isLoading ? (
            <div className="flex justify-center items-center py-20 text-gray-500 font-medium">
              Memuat data riwayat reservasi Anda...
            </div>
          ) : myReservasi && myReservasi.length > 0 ? (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium rounded-tl-xl"><div className="flex items-center gap-2"><Hash className="w-4 h-4"/> Kode Reservasi</div></th>
                    <th className="px-6 py-4 font-medium"><div className="flex items-center gap-2"><Stethoscope className="w-4 h-4"/> Jenis Treatment</div></th>
                    <th className="px-6 py-4 font-medium"><div className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Tanggal</div></th>
                    <th className="px-6 py-4 font-medium"><div className="flex items-center gap-2"><Clock className="w-4 h-4"/> Jam</div></th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium rounded-tr-xl text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {myReservasi.map((item, index) => (
                    <tr key={item.idReservasi || index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 font-semibold text-gray-800">
                        #{item.idReservasi || 'REV-' + Math.floor(Math.random() * 10000)}
                      </td>
                      <td className="px-6 py-5 text-gray-700 font-medium">
                        {item.jenisReservasi || item.jenisTreatment || "-"}
                      </td>
                      <td className="px-6 py-5 text-gray-600">
                        {item.tanggalReservasi}
                      </td>
                      <td className="px-6 py-5 text-gray-600">
                        {item.jadwal ? `${item.jadwal.jamMulai.substring(0,5)} - ${item.jadwal.jamSelesai.substring(0,5)}` : "-"}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button 
                          onClick={() => handleOpenDetail(item)}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:border-green-500 hover:text-green-600 rounded-xl text-sm font-semibold text-gray-600 transition-colors shadow-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada riwayat reservasi</h3>
              <p className="text-gray-500 max-w-sm">
                Anda belum pernah melakukan reservasi treatment sebelumnya.
              </p>
              <button 
                onClick={() => navigate('/reservasi')}
                className="mt-6 px-6 py-3 bg-[#56BC36] hover:bg-[#469e2c] text-white font-medium rounded-xl transition-colors shadow-sm"
              >
                Buat Reservasi Sekarang
              </button>
            </div>
          )}
        </div>

      </div>
      
      <ModalDetailReservasi 
        isOpen={isModalDetailOpen} 
        onClose={handleCloseDetail}
        selectedReservasi={selectedReservasi} 
      />
    </div>
  );
}

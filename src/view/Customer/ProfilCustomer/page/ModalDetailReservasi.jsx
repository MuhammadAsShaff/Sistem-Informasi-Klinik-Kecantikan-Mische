import React from "react";
import { X, Calendar, Clock, Stethoscope, CheckCircle2 } from "lucide-react";

export default function ModalDetailReservasi({ isOpen, onClose, selectedReservasi }) {
  if (!isOpen || !selectedReservasi) return null;

  const data = selectedReservasi;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Selesai': 
      case 'Dikonfirmasi': 
      case 'Konfirmasi':
      case 'Datang':
        return 'bg-[#d1f4cc] text-[#2c7a20] border-[#2c7a20]/20';
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Batal':
      case 'Dibatalkan':
      case 'Tidak Datang':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderField = (icon, label, value) => (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
      <div className="p-3 bg-green-50 rounded-lg text-[#56BC36] mt-1 shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-500 mb-1 truncate">{label}</p>
        <p className="font-bold text-gray-800 text-base break-words">{value || "-"}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden font-poppins max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-100 flex justify-between items-start sm:items-center bg-[#F9FAFB] shrink-0 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Detail Reservasi</h2>
            <p className="text-sm text-gray-500 mt-1">Kode: #{data.idReservasi || data.id}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm border border-gray-200">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar">
          
          <div className="flex justify-between items-center p-4 sm:p-6 bg-gray-50 rounded-2xl mb-6 sm:mb-8 border border-gray-100">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Status Reservasi</p>
              <span className={`inline-flex px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold border ${getStatusColor(data.status)}`}>
                {data.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderField(<Stethoscope size={20} />, "Jenis Treatment", data.jenisReservasi || data.jenisTreatment)}
            {renderField(<Calendar size={20} />, "Tanggal Reservasi", data.tanggalReservasi)}
            {renderField(<Clock size={20} />, "Jadwal Waktu", data.jadwal ? `${data.jadwal.jamMulai?.substring(0,5)} - ${data.jadwal.jamSelesai?.substring(0,5)}` : "-")}
            {renderField(<CheckCircle2 size={20} />, "Dokter Menangani", data.dokter?.nama || "Akan diatur oleh admin")}
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 sm:px-8 py-4 sm:py-6 border-t border-gray-100 bg-white shrink-0 flex justify-end">
           <button onClick={onClose} className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition">
             Tutup
           </button>
        </div>

      </div>
    </div>
  );
}

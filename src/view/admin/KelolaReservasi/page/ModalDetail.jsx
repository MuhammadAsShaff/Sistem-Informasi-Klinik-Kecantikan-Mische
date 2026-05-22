import React from "react";
import { X } from "lucide-react";

export default function ModalDetail({ isOpen, onClose, selectedReservasi }) {
  if (!isOpen || !selectedReservasi) return null;

  const data = selectedReservasi;

  const renderField = (label, value) => (
    <div className="flex flex-col space-y-1">
      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</span>
      <span className="text-sm font-bold text-gray-900">{value || "-"}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-[#F9FAFB]">
          <h2 className="text-xl font-bold text-gray-800">Detail Reservasi</h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm border border-gray-200">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            {renderField("ID Reservasi", `#${data.idReservasi || data.id}`)}
            {renderField("Nama Customer", data.namaCustomer)}
            {renderField("Nomor WhatsApp", data.nomorWa)}
            {renderField("Jenis Treatment", data.jenisTreatment)}
          </div>

          <div className="space-y-6">
            {renderField("Tanggal Reservasi", data.tanggalReservasi)}
            {renderField("Jadwal Waktu", data.jadwal ? `${data.jadwal.jamMulai} - ${data.jadwal.jamSelesai}` : "-")}
            {renderField("Dokter yang Menangani", data.dokter?.nama || "-")}
            {renderField("Status Reservasi", (
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border
                ${data.status === 'Menunggu' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
                  data.status === 'Dikonfirmasi' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                  data.status === 'Selesai' ? 'bg-green-50 text-[#56BC36] border-[#56BC36]/30' :
                  data.status === 'Dibatalkan' ? 'bg-red-50 text-red-500 border-red-500/30' :
                  'bg-gray-50 text-gray-500 border-gray-200'
                }`}
              >
                {data.status}
              </span>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

/**
 * =========================================================================
 * RAK KOTAK PETAK JADWAL KEDATANGAN (JadwalSection)
 * =========================================================================
 * Ibarat jajaran ubin penunjuk waktu di dinding lobi. Ubin berwarna hijau
 * mencerminkan kursi praktek yang siap dipesan, sedangkan ubin kelabu berarti
 * kursi tersebut telah dipesan oleh tamu lain atau dokter sedang rehat.
 */
export default function JadwalSection({ timeSlots, isDoctorAvailable = true, onSlotClick }) {
  // Tampilan jika Dokter TIDAK tersedia
  if (!isDoctorAvailable) {
    return (
      <div className="bg-white rounded-[2rem] shadow-sm p-10 md:p-20 border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 rounded-full flex items-center justify-center">
          <AlertCircle size={60} className="text-[#56BC36]" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
          Maaf Dokter Tidak Tersedia Hari Ini
        </h3>
      </div>
    );
  }

  // Tampilan normal jika Dokter TERSEDIA
  return (
    <div className="bg-white rounded-[2rem] shadow-sm p-6 md:p-12 border border-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {timeSlots.map((slot, index) => {
          const isAvailable = slot.status === "Kosong";
          return (
            <div 
              key={index} 
              onClick={() => {
                if (onSlotClick) {
                  onSlotClick(slot);
                }
              }}
              className={`relative overflow-hidden p-4 md:p-5 flex flex-col items-center justify-center transition-all duration-300 rounded-tl-[1.5rem] rounded-br-[1.5rem] rounded-tr-md rounded-bl-md
                ${isAvailable 
                  ? 'bg-[#6cc24a] text-white cursor-pointer shadow-md hover:-translate-y-1' 
                  : 'bg-white border-2 border-gray-100 text-gray-300 cursor-not-allowed'
                }`}
            >
              <span className="text-lg md:text-xl font-bold mb-2 whitespace-nowrap tracking-wide">{slot.timeRange || slot.time} WIB</span>
              <div className={`px-6 py-1 rounded-full text-xs md:text-sm font-semibold
                ${isAvailable ? 'bg-white text-gray-900' : 'bg-gray-300 text-white'}`}
              >
                {slot.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

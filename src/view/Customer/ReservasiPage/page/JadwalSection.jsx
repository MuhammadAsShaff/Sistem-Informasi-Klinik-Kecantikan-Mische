import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function JadwalSection({ timeSlots, isDoctorAvailable = true, onSlotClick }) {
  // Tampilan jika Dokter TIDAK tersedia
  if (!isDoctorAvailable) {
    return (
      <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl p-10 md:p-20 border border-gray-50 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
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
    <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl p-6 md:p-14 border border-gray-50">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {timeSlots.map((slot, index) => {
          const isAvailable = slot.status === "Kosong";
          return (
            <div 
              key={index} 
              onClick={() => {
                if (isAvailable && onSlotClick) {
                  onSlotClick(slot);
                }
              }}
              className={`relative overflow-hidden rounded-[1.5rem] p-4 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
                ${isAvailable 
                  ? 'bg-[#56BC36] text-white shadow-lg hover:shadow-green-200 hover:-translate-y-1' 
                  : 'bg-white border-2 border-gray-100 text-gray-300 opacity-60'
                }`}
            >
              <span className="text-base md:text-lg font-bold mb-1 whitespace-nowrap">{slot.timeRange || slot.time} WIB</span>
              <div className={`mt-2 px-6 py-1.5 rounded-full text-[0.7rem] font-medium
                ${isAvailable ? 'bg-white text-black' : 'bg-gray-200 text-gray-500'}`}
              >
                {slot.status}
              </div>
              {isAvailable ? (
                <CheckCircle2 size={32} className="absolute top-0 right-0 p-2 opacity-30 rotate-12" />
              ) : (
                <XCircle size={32} className="absolute top-0 right-0 p-2 opacity-5 rotate-12" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

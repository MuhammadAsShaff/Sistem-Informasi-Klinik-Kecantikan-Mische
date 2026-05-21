import React, { useState, useEffect } from 'react';
import logomischee from '@/assets/images/LogoMischee.png';

export default function ModalDetailReservasi({ 
  isOpen, 
  onClose, 
  slot, 
  treatment, 
  doctor, 
  date, 
  formatTgl 
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Reset state pop-up saat modal utama ditutup
  useEffect(() => {
    if (!isOpen) {
      setIsConfirmOpen(false);
    }
  }, [isOpen]);

  if (!isOpen || !slot) return null;

  // Asumsi jam selesai adalah 1 jam setelah jam mulai (karena formatnya jam pas seperti "07:00")
  const calculateJamSelesai = (jamMulai) => {
    if (!jamMulai) return "";
    const [jam] = jamMulai.split(':');
    const jamBerikutnya = parseInt(jam) + 1;
    return `${String(jamBerikutnya).padStart(2, '0')}:00`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-300">
      {/* Latar Belakang Gelap */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Kontainer Modal */}
      <div className="bg-[#F8FAF9] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] md:rounded-[3rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 custom-scrollbar">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/50 hover:bg-white rounded-full p-2 text-gray-600 hover:text-gray-900 z-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="p-6 md:p-10 lg:p-12 space-y-6 md:space-y-8">
          
          <div className="relative w-full bg-gradient-to-r from-[#56bc36] from-[55%] to-[#C6FFD1] rounded-[2rem] p-8 md:p-10 overflow-hidden shadow-sm flex items-center h-32 md:h-40">
            <h2 className="text-2xl md:text-4xl font-bold text-white relative z-10 md:w-2/3 leading-tight">
              Ayo Pilih Jenis <br /> Treatment Kamu!
            </h2>
           {/* Logo Aspect */}
                 <div className="absolute right-0 top-0 h-full w-1/3 sm:w-1/4 pointer-events-none flex items-center justify-end p-4 sm:p-12 z-10">
                   <img
                     src={logomischee}
                     alt="Mische Logo"
                     className="h-2/3 sm:h-full w-auto object-contain drop-shadow-md"
                   />
                 </div>
          </div>

          {/* Form Detail */}
          <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-gray-100 space-y-6 md:space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Jam Mulai */}
              <div className="space-y-3">
                <label className="text-gray-800 text-sm md:text-base font-medium pl-2">Jam Mulai Treatment</label>
                <div className="bg-white rounded-full px-6 py-4 shadow-sm border border-gray-100 text-center font-bold text-gray-900 text-sm md:text-base">
                  {slot.time} WIB
                </div>
              </div>

              {/* Jam Selesai */}
              <div className="space-y-3">
                <label className="text-gray-800 text-sm md:text-base font-medium pl-2">Jam Selesai Treatment</label>
                <div className="bg-white rounded-full px-6 py-4 shadow-sm border border-gray-100 text-center font-bold text-gray-900 text-sm md:text-base">
                  {calculateJamSelesai(slot.time)} WIB
                </div>
              </div>

              {/* Tanggal Treatment */}
              <div className="space-y-3">
                <label className="text-gray-800 text-sm md:text-base font-medium pl-2">Tanggal Treatment</label>
                <div className="bg-white rounded-full px-6 py-4 shadow-sm border border-gray-100 text-center font-bold text-gray-900 text-sm md:text-base">
                  {formatTgl ? formatTgl(date) : date}
                </div>
              </div>

              {/* Nama Dokter */}
              <div className="space-y-3">
                <label className="text-gray-800 text-sm md:text-base font-medium pl-2">Nama Dokter</label>
                <div className="bg-white rounded-full px-6 py-4 shadow-sm border border-gray-100 text-center font-bold text-gray-900 text-sm md:text-base">
                  {doctor}
                </div>
              </div>
            </div>

            {/* Pilih Jenis Treatment */}
            <div className="space-y-3 pt-2">
              <label className="text-gray-800 text-sm md:text-base font-medium pl-2">Pilih Jenis Treatment Kamu</label>
              <div className="bg-white rounded-full px-6 py-4 shadow-sm border border-gray-100 text-center font-bold text-gray-900 text-sm md:text-base">
                {treatment}
              </div>
            </div>

            {/* Tombol Reservasi */}
            <div className="pt-6">
              <button 
                onClick={() => setIsConfirmOpen(true)}
                className="w-full bg-[#75C859] hover:bg-[#56BC36] text-white font-bold py-4 rounded-full transition-all shadow-md hover:shadow-lg text-sm md:text-base transform hover:-translate-y-1"
              >
                Reservasi Sekarang
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Pop-up Konfirmasi */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl max-w-md w-full flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-200">
            {/* Icon Alert Gray */}
            <div className="w-[84px] h-[84px] rounded-full border-[6px] border-[#9AA2B1] flex items-center justify-center">
              <span className="text-[#9AA2B1] text-5xl font-bold">!</span>
            </div>
            
            {/* Text */}
            <h3 className="text-[#64748B] text-lg md:text-xl font-medium leading-relaxed">
              Apakah Anda yakin ingin Reservasi Sekarang ?
            </h3>

            {/* Buttons */}
            <div className="flex flex-row gap-4 w-full justify-center pt-2">
              <button 
                onClick={() => {
                  alert("Reservasi untuk " + treatment + " bersama " + doctor + " pada " + slot.time + " berhasil diajukan!");
                  setIsConfirmOpen(false);
                  onClose();
                }}
                className="flex-1 bg-[#56bc36] hover:bg-[#2da509] text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-sm"
              >
                Ya
              </button>
              <button 
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 bg-white hover:bg-gray-50 text-[#0f172a] font-medium py-3 px-6 rounded-xl border border-gray-200 transition-colors shadow-sm"
              >
                Tidak, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

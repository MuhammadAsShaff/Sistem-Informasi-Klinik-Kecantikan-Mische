import React from 'react';
import logomischee from '@/assets/images/LogoMischee.png';
import { useModalDetailReservasi } from '../hooks/useModalDetailReservasi';

export default function ModalDetailReservasi({ 
  isOpen, 
  onClose, 
  onConfirm,
  isSubmitting,
  slot, 
  kategoriTreatment,
  treatment, 
  doctor, 
  date, 
  formatTgl 
}) {
  const {
    isConfirmOpen,
    setIsConfirmOpen,
    calculateJamSelesai
  } = useModalDetailReservasi(isOpen);

  if (!isOpen || !slot) return null;

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
          
          <div className="relative w-full bg-gradient-to-r from-[#56bc36] to-[#75C859] rounded-3xl p-8 md:p-12 overflow-hidden shadow-lg flex flex-col justify-center min-h-[160px]">
            {/* Dekorasi Latar Belakang */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl translate-y-1/2"></div>
            
            <h2 className="text-2xl md:text-4xl font-bold text-white relative z-10 leading-tight">
              Ayo Selesaikan <br /> Reservasi Kamu!
            </h2>
            
            {/* Logo Aspect (Diperbaiki agar proporsional) */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 h-[80%] max-h-[100px] pointer-events-none flex items-center justify-end z-10">
              <img
                src={logomischee}
                alt="Mische Logo"
                className="h-full w-auto object-contain drop-shadow-lg opacity-90"
              />
            </div>
          </div>

          {/* Form Detail */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {/* Jam Mulai */}
              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/80 transition-colors hover:bg-green-50/30">
                <label className="block text-gray-500 text-xs md:text-sm font-medium mb-1">Jam Mulai</label>
                <div className="font-bold text-gray-900 text-sm md:text-lg">
                  {slot.time} WIB
                </div>
              </div>

              {/* Jam Selesai */}
              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/80 transition-colors hover:bg-green-50/30">
                <label className="block text-gray-500 text-xs md:text-sm font-medium mb-1">Jam Selesai</label>
                <div className="font-bold text-gray-900 text-sm md:text-lg">
                  {slot.timeEnd || calculateJamSelesai(slot.time)} WIB
                </div>
              </div>

              {/* Tanggal Treatment */}
              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/80 transition-colors hover:bg-green-50/30">
                <label className="block text-gray-500 text-xs md:text-sm font-medium mb-1">Tanggal</label>
                <div className="font-bold text-gray-900 text-sm md:text-lg">
                  {formatTgl ? formatTgl(date) : date}
                </div>
              </div>

              {/* Nama Dokter */}
              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/80 transition-colors hover:bg-green-50/30">
                <label className="block text-gray-500 text-xs md:text-sm font-medium mb-1">Dokter</label>
                <div className="font-bold text-gray-900 text-sm md:text-lg">
                  {doctor}
                </div>
              </div>
            </div>

            {/* Pilih Kategori & Jenis Treatment */}
            <div className="bg-[#f0fdf4]/50 p-5 rounded-2xl border border-green-100/50 space-y-4">
              <div>
                <label className="block text-green-700 text-sm font-medium mb-1">Kategori Treatment</label>
                <div className="font-bold text-green-900 text-lg md:text-xl">
                  {kategoriTreatment}
                </div>
              </div>
              <div>
                <label className="block text-green-700 text-sm font-medium mb-1">Jenis Treatment</label>
                <div className="font-bold text-green-900 text-lg md:text-xl">
                  {treatment}
                </div>
              </div>
            </div>

            {/* Tombol Reservasi */}
            <div className="pt-4">
              <button 
                onClick={() => setIsConfirmOpen(true)}
                className="w-full bg-gradient-to-r from-[#56BC36] to-[#65d343] hover:from-[#469e2c] hover:to-[#56BC36] text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:shadow-green-200 text-base md:text-lg transform hover:-translate-y-1"
              >
                Konfirmasi Reservasi
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
                onClick={onConfirm}
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl text-white font-bold text-sm md:text-base transition-colors shadow-lg
                  ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#56BC36] hover:bg-[#469e2c] cursor-pointer'
                  }`}
              >
                {isSubmitting ? "Memproses..." : "Pesan Sekarang"}
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

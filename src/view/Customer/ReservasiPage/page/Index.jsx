import React from 'react';
import HeaderSection from './HeaderSection';
import FilterSection from './FilterSection';
import JadwalSection from './JadwalSection';
import ModalDetailReservasi from './ModalDetailReservasi';
import ToastAlert from '@/view/components/ToastAlert/page/Index';
import CustomerLoading from '@/components/CustomerLoading';
import { treatments as listKategoriTreatment } from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/hooks/TreatmentsData';
import { dataJenisPerawatan } from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/hooks/DataJenisPerawatan';
import { useReservasiPage } from '../hooks/useReservasiPage';

/**
 * =========================================================================
 * KOMPONEN VIEW: ReservasiPage (Halaman Pendaftaran Reservasi Customer)
 * =========================================================================
 * Komponen ini berfungsi sebagai kerangka tampilan (UI/Layout) untuk proses
 * reservasi treatment kecantikan di Mische.
 * 
 * Seluruh logika bisnis seperti pemilihan tanggal, dokter, pencarian ketersediaan
 * slot waktu, penutupan dropdown otomatis, dan fungsi booking dienkapsulasi
 * secara rapi di dalam custom hook `useReservasiPage`.
 */
export default function ReservasiPage() {
  // Memanggil custom hook yang mengelola status dan aksi dari halaman ini
  const {
    selectedDate,
    setSelectedDate,
    treatment,
    setTreatment,
    doctor,
    setDoctor,
    openDropdown,
    setOpenDropdown,
    toast,
    setToast,
    selectedSlot,
    setSelectedSlot,
    isModalOpen,
    setIsModalOpen,
    dropdownRef,
    doctorsList,
    isDoctorsLoading,
    isJadwalLoading,
    timeSlots,
    countKosong,
    countTerisi,
    getHari,
    formatTgl,
    showToast,
    handleBooking,
    isSubmitting,
    isDoctorAvailable,
    handleBack
  } = useReservasiPage();


  return (
    <div className="min-h-screen bg-[#F8FAF9] py-8 md:py-16 px-4 md:px-12 lg:px-24 font-poppins" ref={dropdownRef}>
      <ToastAlert isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
      <div className="max-w-[1440px] mx-auto space-y-12 relative">
        <button 
          onClick={handleBack}
          className="absolute -top-4 md:-top-8 left-0 flex items-center text-gray-500 hover:text-[#56BC36] transition-colors bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="ml-1 font-medium text-sm">Kembali</span>
        </button>
        <HeaderSection />
        <FilterSection 
          treatment={treatment} setTreatment={setTreatment}
          doctor={doctor} setDoctor={setDoctor}
          selectedDate={selectedDate} setSelectedDate={setSelectedDate}
          openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}
          getHari={getHari} formatTgl={formatTgl} 
          doctorsList={doctorsList}
          countKosong={countKosong}
          countTerisi={countTerisi}
        />
        
        {isDoctorsLoading || isJadwalLoading ? (
           <CustomerLoading text="Memuat jadwal dan dokter..." />
        ) : (
          <JadwalSection 
            timeSlots={timeSlots} 
            isDoctorAvailable={isDoctorAvailable} 
            onSlotClick={(slot) => {
              if (!treatment || treatment === "") {
                showToast("Harap pilih Jenis Treatment terlebih dahulu!", "error");
                return;
              }
              if (slot.status === "Kosong") {
                setSelectedSlot(slot);
                setIsModalOpen(true);
              } else if (slot.status === "Sudah Terisi") {
                showToast("Slot sudah penuh", "error");
              }
            }}
          />
        )}

        <ModalDetailReservasi 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBooking}
          isSubmitting={isSubmitting}
          slot={selectedSlot}
          treatment={treatment}
          kategoriTreatment={
            listKategoriTreatment.find(c => 
              c.id === dataJenisPerawatan.find(t => t.title === treatment)?.categoryId
            )?.title || ''
          }
          doctor={doctor}
          date={selectedDate}
          formatTgl={formatTgl}
        />
      </div>
    </div>
  );
}

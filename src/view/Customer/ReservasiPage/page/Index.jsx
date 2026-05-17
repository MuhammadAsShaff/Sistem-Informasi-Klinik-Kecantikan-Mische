import React, { useState, useRef, useEffect } from 'react';
import HeaderSection from './HeaderSection';
import FilterSection from './FilterSection';
import JadwalSection from './JadwalSection';

// INI ADALAH PUSAT HALAMAN RESERVASI
export default function ReservasiPage() {
  // 1. PENYIMPANAN DATA (STATE)
  const [selectedDate, setSelectedDate] = useState("2025-12-24");
  const [treatment, setTreatment] = useState("Acne Treatment");
  const [doctor, setDoctor] = useState("dr. Widya");
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const dropdownRef = useRef(null);
  const dateInputRef = useRef(null);

  // KONDISI: Dokter dianggap tidak tersedia jika pilihannya adalah "-"
  const isDoctorAvailable = doctor !== "-";

  // 2. DATA JADWAL (DUMMY)
  const timeSlots = [
    { time: "07:00", status: "Kosong" }, { time: "08:00", status: "Sudah Terisi" },
    { time: "09:00", status: "Kosong" }, { time: "10:00", status: "Sudah Terisi" },
    { time: "11:00", status: "Sudah Terisi" }, { time: "12:00", status: "Sudah Terisi" },
    { time: "13:00", status: "Kosong" }, { time: "14:00", status: "Kosong" },
    { time: "15:00", status: "Sudah Terisi" }, { time: "16:00", status: "Kosong" },
    { time: "17:00", status: "Kosong" }, { time: "18:00", status: "Kosong" },
  ];

  // 3. FUNGSI-FUNGSI PEMBANTU
  const getHari = (tgl) => {
    const daftarHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return tgl ? daftarHari[new Date(tgl).getDay()] : "Hari";
  };

  const formatTgl = (tgl) => {
    if (!tgl) return "Pilih Tanggal";
    const [thn, bln, tglSkrg] = tgl.split("-");
    const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return tglSkrg ? `${tglSkrg} ${namaBulan[parseInt(bln)-1]} ${thn}` : tgl;
  };

  const bukaKalender = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker ? dateInputRef.current.showPicker() : dateInputRef.current.click();
    }
  };

  // 4. LOGIKA TUTUP DROPDOWN OTOMATIS
  useEffect(() => {
    const handleKlikLuar = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handleKlikLuar);
    return () => document.removeEventListener("mousedown", handleKlikLuar);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAF9] py-8 md:py-16 px-4 md:px-12 lg:px-24 font-poppins" ref={dropdownRef}>
      <div className="max-w-[1440px] mx-auto space-y-12">
        <HeaderSection />
        <FilterSection 
          treatment={treatment} setTreatment={setTreatment}
          doctor={doctor} setDoctor={setDoctor}
          selectedDate={selectedDate} setSelectedDate={setSelectedDate}
          openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}
          getHari={getHari} formatTgl={formatTgl} 
          bukaKalender={bukaKalender} dateInputRef={dateInputRef}
        />
        <JadwalSection timeSlots={timeSlots} isDoctorAvailable={isDoctorAvailable} />
      </div>
    </div>
  );
}

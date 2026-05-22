import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderSection from './HeaderSection';
import FilterSection from './FilterSection';
import JadwalSection from './JadwalSection';
import ModalDetailReservasi from './ModalDetailReservasi';
import { useDokterData } from '@/view/Customer/TentangDokter/hooks/useDokterData';
import { useFetchPublicJadwal } from '../hooks/useFetchPublicJadwal';
import { useCreateReservasi } from '../hooks/useCreateReservasi';
import ToastAlert from '@/view/components/ToastAlert';

export default function ReservasiPage() {
  const navigate = useNavigate();

  // 1. PENYIMPANAN DATA (STATE)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  
  const [treatment, setTreatment] = useState("Acne Treatment");
  const [doctor, setDoctor] = useState("-");
  
  // 2. DATA DARI API (Dokter)
  const { doctors, isLoading: isDoctorsLoading } = useDokterData();

  // KONDISI DOKTER
  const selectedDoctorObj = doctors.find(d => d.nama === doctor);
  const isDoctorAvailable = doctor !== "-" && selectedDoctorObj && (selectedDoctorObj.status || "Tersedia") === "Tersedia";
  const idDokter = selectedDoctorObj?.idDokter || selectedDoctorObj?.id;

  // 3. DATA DARI API (Jadwal)
  const { dataJadwal, isLoading: isJadwalLoading } = useFetchPublicJadwal(selectedDate, idDokter);
  const { createReservasi, isSubmitting, error } = useCreateReservasi();

  const [openDropdown, setOpenDropdown] = useState(null);
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  
  // MODAL STATE
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const dateInputRef = useRef(null);

  // MAPPING JADWAL API KE SLOT UI
  const timeSlots = dataJadwal.map(jadwal => {
    const timeMulai = jadwal.jamMulai ? jadwal.jamMulai.substring(0, 5) : "";
    const timeSelesai = jadwal.jamSelesai ? jadwal.jamSelesai.substring(0, 5) : "";
    const idJadwal = jadwal.idJadwal || jadwal.id;

    // Status "Sudah Terisi" atau "Tersedia" langsung diberikan dari backend API yang baru!
    // Kita pastikan jika status backendnya 'Tersedia' kita map ke 'Kosong' untuk konsistensi di UI, 
    // atau pakai 'Tersedia' saja jika UI sudah mendukung. UI defaultnya menggunakan "Kosong".
    const statusBackend = jadwal.status; 
    let statusFinal = "Kosong"; // default
    if (statusBackend === "Sudah Terisi") statusFinal = "Sudah Terisi";
    else if (statusBackend === "Tersedia" || statusBackend === "Kosong") statusFinal = "Kosong";

    return {
      id: idJadwal,
      time: timeMulai, // tetep simpan timeMulai untuk backward compatibility modal
      timeEnd: timeSelesai,
      timeRange: `${timeMulai} - ${timeSelesai}`,
      status: statusFinal,
    };
  });

  const countKosong = timeSlots.filter(s => s.status === "Kosong").length;
  const countTerisi = timeSlots.filter(s => s.status !== "Kosong").length;

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

  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // Set default doctor saat data dokter selesai dimuat
  useEffect(() => {
    if (doctors.length > 0 && doctor === "-") {
      const availableDoctors = doctors.filter(d => (d.status || "Tersedia") === "Tersedia");
      if (availableDoctors.length > 0) {
        setDoctor(availableDoctors[0].nama);
      }
    }
  }, [doctors]);

  const handleBooking = () => {
    if (!selectedDoctorObj) return;

    const payload = {
      jenisTreatment: treatment,
      tanggalReservasi: selectedDate,
      idDokter: selectedDoctorObj.idDokter || selectedDoctorObj.id,
      idJadwal: selectedSlot.id
    };

    createReservasi(payload, (msg) => {
      setIsModalOpen(false);
      showToast(msg, "success");
      setTimeout(() => navigate('/ProfilCustomer'), 2000); // Redirect ke profil untuk melihat history
    }, (errMsg) => {
      showToast(errMsg, "error");
      setIsModalOpen(false);
    });
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
      <ToastAlert isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
      <div className="max-w-[1440px] mx-auto space-y-12">
        <HeaderSection />
        <FilterSection 
          treatment={treatment} setTreatment={setTreatment}
          doctor={doctor} setDoctor={setDoctor}
          selectedDate={selectedDate} setSelectedDate={setSelectedDate}
          openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}
          getHari={getHari} formatTgl={formatTgl} 
          doctorsList={doctors}
          countKosong={countKosong}
          countTerisi={countTerisi}
        />
        
        {isDoctorsLoading || isJadwalLoading ? (
           <div className="text-center py-10 font-medium text-gray-500">Memuat jadwal dan dokter...</div>
        ) : (
          <JadwalSection 
            timeSlots={timeSlots} 
            isDoctorAvailable={isDoctorAvailable} 
            onSlotClick={(slot) => {
              if (slot.status === "Kosong") {
                setSelectedSlot(slot);
                setIsModalOpen(true);
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
          doctor={doctor}
          date={selectedDate}
          formatTgl={formatTgl}
        />
      </div>
    </div>
  );
}

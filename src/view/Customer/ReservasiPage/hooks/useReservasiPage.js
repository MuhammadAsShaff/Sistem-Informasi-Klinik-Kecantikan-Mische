import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDokterData } from '@/view/Customer/TentangDokter/hooks/useDokterData';
import { useFetchPublicJadwal } from './useFetchPublicJadwal';
import { useCreateReservasi } from './useCreateReservasi';
import { treatments as listKategoriTreatment } from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/hooks/TreatmentsData';
import { dataJenisPerawatan } from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/hooks/DataJenisPerawatan';

/**
 * =========================================================================
 * MANDOR BESAR PENGELOLA LOBI RESERVASI (useReservasiPage)
 * =========================================================================
 * Ibarat kepala direksi di balai pendaftaran klinik yang mengurus segala urusan:
 * 1. Memeriksa daftar nama dokter yang bersedia bertugas (useDokterData).
 * 2. Mencatat hari dan tanggal kedatangan yang diinginkan tamu.
 * 3. Membuka dan menutup rak menu gulung (dropdown) secara cerdas.
 * 4. Meresmikan permohonan pesanan (Booking) ke dalam buku kasir.
 */
export function useReservasiPage() {
  const navigate = useNavigate();

  // 1. STATE MANAGEMENT
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  
  const [treatment, setTreatment] = useState("Refresh Facial");
  const [doctor, setDoctor] = useState("-");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  
  // MODAL STATE
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  // 2. INTEGRASI DATA API
  const { doctors, isLoading: isDoctorsLoading } = useDokterData();

  // Mencari objek dokter yang sedang dipilih
  const selectedDoctorObj = doctors.find(d => d.nama === doctor);
  const isDoctorAvailable = doctor !== "-" && selectedDoctorObj && (selectedDoctorObj.status || "Tersedia") === "Tersedia";
  const idDokter = selectedDoctorObj?.idDokter || selectedDoctorObj?.id;

  // Mengambil jadwal praktek dari API
  const { dataJadwal, isLoading: isJadwalLoading } = useFetchPublicJadwal(selectedDate, idDokter);
  const { createReservasi, isSubmitting, error } = useCreateReservasi();

  // 3. PEMETAAN DATA JADWAL
  const timeSlots = dataJadwal.map(jadwal => {
    const timeMulai = jadwal.jamMulai ? jadwal.jamMulai.substring(0, 5) : "";
    const timeSelesai = jadwal.jamSelesai ? jadwal.jamSelesai.substring(0, 5) : "";
    const idJadwal = jadwal.idJadwal || jadwal.id;

    // Menentukan status ketersediaan slot (Kosong vs Sudah Terisi)
    const statusBackend = jadwal.status; 
    let statusFinal = "Kosong"; 
    if (statusBackend === "Sudah Terisi") statusFinal = "Sudah Terisi";
    else if (statusBackend === "Tersedia" || statusBackend === "Kosong") statusFinal = "Kosong";

    return {
      id: idJadwal,
      time: timeMulai,
      timeEnd: timeSelesai,
      timeRange: `${timeMulai} - ${timeSelesai}`,
      status: statusFinal,
    };
  });

  const countKosong = timeSlots.filter(s => s.status === "Kosong").length;
  const countTerisi = timeSlots.filter(s => s.status !== "Kosong").length;

  // 4. FUNGSI PEMBANTU (HELPERS)
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

  // Efek Samping: Set dokter default pertama kali saat data dokter dimuat
  useEffect(() => {
    if (doctors.length > 0 && doctor === "-") {
      const availableDoctors = doctors.filter(d => (d.status || "Tersedia") === "Tersedia");
      if (availableDoctors.length > 0) {
        setDoctor(availableDoctors[0].nama);
      }
    }
  }, [doctors]);

  // Efek Samping: Menangani klik di luar dropdown untuk menutup opsi dropdown otomatis
  useEffect(() => {
    const handleKlikLuar = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleKlikLuar);
    return () => document.removeEventListener("mousedown", handleKlikLuar);
  }, []);

  // Fungsi untuk mengirim permintaan Booking ke server
  const handleBooking = () => {
    if (!selectedDoctorObj) return;

    const selectedTreatmentObj = dataJenisPerawatan.find(t => t.title === treatment);
    const selectedKategoriObj = listKategoriTreatment.find(c => c.id === selectedTreatmentObj?.categoryId);
    const kategoriValue = selectedKategoriObj ? selectedKategoriObj.title : '';

    const payload = {
      kategoriReservasi: kategoriValue,
      jenisReservasi: treatment,
      tanggalReservasi: selectedDate,
      idDokter: selectedDoctorObj.idDokter || selectedDoctorObj.id,
      idJadwal: selectedSlot.id
    };

    createReservasi(payload, (msg) => {
      setIsModalOpen(false);
      showToast(msg, "success");
      setTimeout(() => navigate('/ProfilCustomer'), 2000);
    }, (errMsg) => {
      showToast(errMsg || "Gagal membuat reservasi.", "error");
      setIsModalOpen(false);
    });
  };

  return {
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
    doctorsList: doctors,
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
    handleBack: () => navigate(-1)
  };
}

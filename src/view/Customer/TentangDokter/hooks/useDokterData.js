import DokterWidya from '@/assets/images/DokterWidya.jpg';
import DokterRiefni from '@/assets/images/DokterRiefni.jpg';

export const DOKTER_DATA = [
  {
    id: 1,
    name: "Dr. WIDYA FINANDA",
    description: "Dokter dengan pengalaman selama 20 tahun di dunia kecantikan, dan sudah melalang buana kemana saja. Dokter dengan pengalaman selama 20 tahun di dunia kecantikan, dan sudah melalang buana kemana saja. Dokter dengan pengalaman selama 20 tahun di dunia kecantikan, dan sudah melalang buana kemana saja...",
    image: DokterWidya,
    experience: "Dokter Dengan Pengalaman Selama 20 Tahun Di Dunia Kecantikan.....",
  },
  {
    id: 2,
    name: "Dr. RIEFNI SILARA DINI",
    description: "Dokter dengan pengalaman selama 20 tahun di dunia kecantikan, dan sudah melalang buana kemana saja. Dokter dengan pengalaman selama 20 tahun di dunia kecantikan, dan sudah melalang buana kemana saja. Dokter dengan pengalaman selama 20 tahun di dunia kecantikan, dan sudah melalang buana kemana saja...",
    image: DokterRiefni,
    experience: "Dokter Dengan Pengalaman Selama 20 Tahun Di Dunia Kecantikan.....",
  }
];

export const useDokterData = () => {
  // Inisialisasi localStorage jika kosong
  if (!localStorage.getItem("mische_doctors")) {
    localStorage.setItem("mische_doctors", JSON.stringify(DOKTER_DATA));
  }

  const getDoctors = () => {
    try {
      return JSON.parse(localStorage.getItem("mische_doctors") || "[]");
    } catch (e) {
      return DOKTER_DATA;
    }
  };

  const doctors = getDoctors();
  const getDoctorById = (id) => doctors.find((doc) => doc.id.toString() === id.toString());

  return {
    doctors,
    getDoctorById,
  };
};

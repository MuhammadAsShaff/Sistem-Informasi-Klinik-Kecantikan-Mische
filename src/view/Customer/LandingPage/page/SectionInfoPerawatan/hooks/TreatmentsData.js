import FacialImage from '@/assets/images/Treatment/Facial.jpg';
import IntensiveFacialImage from '@/assets/images/Treatment/IntensiveFacial.jpg';
import whitteningImg from '@/assets/images/Treatment/BrightenningFacial.jpg';
import acneImg from '@/assets/images/acne.jpg';
import antiAgingImg from '@/assets/images/anti aging.jpg';

// Gambar Tambahan untuk Kategori
import LaserImg from '@/assets/images/Treatment/Laser treatment.jpg';
import CauterImg from '@/assets/images/Treatment/Cauter.jpg';
import WeightManagementImg from '@/assets/images/Treatment/Weight Management Plus For Abdomen.jpg';
import MTSImg from '@/assets/images/Treatment/Microneedle Treatment System (MTS).jpg';
import MesotherapyImg from '@/assets/images/Treatment/Mesotherapy.jpg';
import SkinBoosterImg from '@/assets/images/Treatment/Mische Skin Booster.jpg';
import BotoxImg from '@/assets/images/Treatment/Mische Royal Lift (Botox).jpg';

export const treatments = [
  {
    id: 1,
    title: "Reguler Facial",
    description: "Perawatan dasar wajah.",
    image: FacialImage,
  },
  {
    id: 2,
    title: "Intensive Facial",
    description: "Perawatan kulit wajah dengan masalah yang lebih mendalam.",
    image: IntensiveFacialImage,
  },
  {
    id: 3,
    title: "Mische Skin Peel",
    description: "Chemical Peeling membantu pergantian kulit dengan baik.",
    image: whitteningImg,
  },
  {
    id: 4,
    title: "Laser Treatment",
    description: "Prosedur laser untuk berbagai peremajaan dan penyembuhan kulit.",
    image: LaserImg,
  },
  {
    id: 5,
    title: "Cauter",
    description: "Prosedur perawatan yang dilakukan untuk menghilangkan berbagai kelainan kulit.",
    image: CauterImg,
  },
  {
    id: 6,
    title: "Intense Pulse Light (IPL)",
    description: "Perawatan wajah dengan efek dari sinar IPL yang efektif.",
    image: FacialImage,
  },
  {
    id: 7,
    title: "Weight Management Plus For Abdomen",
    description: "Perawatan kecantikan yang ditujukan untuk mengurangi lemak di area perut.",
    image: WeightManagementImg,
  },
  {
    id: 8,
    title: "Microneedle Treatment System (MTS)",
    description: "Perawatan intensif dengan metode Microneedling.",
    image: MTSImg,
  },
  {
    id: 9,
    title: "Mesotherapy",
    description: "Perawatan wajah intensif dengan teknik pemberian mikro nutrisi.",
    image: MesotherapyImg,
  },
  {
    id: 10,
    title: "Mische Skin Booster",
    description: "Meregenerasi sel kulit, meningkatkan produksi kolagen, dan memperbaiki struktur kulit.",
    image: SkinBoosterImg,
  },
  {
    id: 11,
    title: "Mische Royal Lift (Botox)",
    description: "Berfungsi untuk menghilangkan kerutan pada wajah dan tanda penuaan.",
    image: BotoxImg,
  },
  {
    id: 12,
    title: "Other Treatments",
    description: "Perawatan pelengkap lainnya seperti Totok Wajah dan Skin Analysis.",
    image: FacialImage,
  },
  {
    id: 13,
    title: "Mische Paket Products",
    description: "Berbagai paket produk perawatan dari Mische.",
    image: whitteningImg,
  }
];

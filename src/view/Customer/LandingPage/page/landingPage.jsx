import HeroCarousel from "./Carousel/page/Index";
import DoctorSection from "./SectionDokter/page/Index";
import SectionInfoPerawatan from "./SectionInfoPerawatan/page/Index";
import ProdukBestSeller from "./ProdukBestSeller/page/Index";
import HasilKlinik from "./HasilKlinik/page/Index";
import KeunggulanKlinik from "./KeunggulanKlinik/page/Index";
import WhatsAppButton from "./WhatsAppButton";

export default function LandingPage() {
  // Komponen LandingPage ini adalah halaman utama yang dilihat pelanggan.
  // Di sini kita menggabungkan berbagai "section" (bagian) halaman menjadi satu kesatuan.
  // Setiap section telah dipisah ke dalam folder masing-masing yang memiliki struktur 'hooks' (untuk logika) dan 'page' (untuk tampilan UI).
  return (
    // Membungkus seluruh konten dengan div ber-class 'relative w-full' 
    // agar komponen di dalamnya seperti tombol WhatsApp bisa memiliki posisi yang relatif terhadap halaman.
    <div className="relative w-full">

      {/* BERANDA / HERO CAROUSEL */}
      <HeroCarousel />

      {/* DOKTER SECTION */}
      <DoctorSection />

      {/* INFO PERAWATAN */}
      <SectionInfoPerawatan />

      {/* PRODUK BEST SELLER */}
      <ProdukBestSeller />

      {/* HASIL KLINIK (BEFORE/AFTER) */}
      <HasilKlinik />

      {/* KEUNGGULAN KLINIK */}
      <KeunggulanKlinik />

      {/* FLOATING ACTION BUTTONS (WA + SCROLL TO TOP) */}
      <WhatsAppButton />

    </div>
  );
}

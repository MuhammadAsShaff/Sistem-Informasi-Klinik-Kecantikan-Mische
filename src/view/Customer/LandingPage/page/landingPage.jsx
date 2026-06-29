import HeroCarousel from "./Carousel/page/Index";
import DoctorSection from "./SectionDokter/page/Index";
import SectionInfoPerawatan from "./SectionInfoPerawatan/page/Index";
import ProdukBestSeller from "./ProdukBestSeller/page/Index";
import HasilKlinik from "./HasilKlinik/page/Index";
import KeunggulanKlinik from "./KeunggulanKlinik/page/Index";
import WhatsAppButton from "./WhatsAppButton";

/**
 * =========================================================================
 * BALAI UTAMA SERAMBI PAVILIUN KLINIK (LandingPage)
 * =========================================================================
 * Ibarat keseluruhan area paviliun istana Mische. Halaman ini menggabungkan
 * berbagai anjungan pameran menjadi satu rute tur yang indah:
 * 1. Panggung Komidi Putar (HeroCarousel)
 * 2. Galeri Foto Dokter (DoctorSection)
 * 3. Meja Penjelasan Perawatan (SectionInfoPerawatan)
 * 4. Rak Pameran Produk Paling Laris (ProdukBestSeller)
 * 5. Mading Bukti Nyata Hasil Perawatan (HasilKlinik)
 * 6. Tugu Piagam Keunggulan Klinik (KeunggulanKlinik)
 * 7. Kotak Telepon & Lift Melayang (WhatsAppButton)
 */
export default function LandingPage() {
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

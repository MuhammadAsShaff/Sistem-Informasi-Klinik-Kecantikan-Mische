import HeroCarousel from "./Carousel/Index";
import DoctorSection from "./SectionDokter/Index";
import SectionInfoPerawatan from "./SectionInfoPerawatan/Index";
import ProdukBestSeller from "./ProdukBestSeller/Index";
import HasilKlinik from "./HasilKlinik/Index";
import KeunggulanKlinik from "./KeunggulanKlinik/Index";
import WhatsAppButton from "./WhatsAppButton";

export default function LandingPage() {
  return (
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

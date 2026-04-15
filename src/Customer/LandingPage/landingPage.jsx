import HeroCarousel from "./Carousel/Index";
import DoctorSection from "./SectionDokter/Index";
import SectionInfoPerawatan from "./SectionInfoPerawatan/Index";
import ProdukBestSeller from "./ProdukBestSeller/Index";
import HasilKlinik from "./HasilKlinik/Index";
import KeunggulanKlinik from "./KeunggulanKlinik/Index";

export default function LandingPage() {
  return (
    <div className="w-full">

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

    </div>
  );
}

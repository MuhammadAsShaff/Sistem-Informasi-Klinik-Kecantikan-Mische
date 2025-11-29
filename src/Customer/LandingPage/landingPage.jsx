import HeroCarousel from "./Carousel";

export default function LandingPage() {
  return (
    <div className="w-full">

      {/* BAGIAN 1: HERO CAROUSEL */}
      <HeroCarousel />

      {/* BAGIAN 2: CARD DOKTER */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-6">Dokter Kami</h2>
      </section>

      {/* BAGIAN 3: PROMO */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-6">Promo Terbaru</h2>
      </section>

      {/* BAGIAN 4: PRODUK */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-6">Produk Unggulan</h2>
      </section>

    </div>
  );
}

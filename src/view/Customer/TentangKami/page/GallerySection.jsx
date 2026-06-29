import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGallerySection } from "../hooks/useGallerySection";
import Logo_Mische from "@/assets/images/Logo_Mische.png";

/**
 * =========================================================================
 * PANGGUNG BIOSKOP DOKUMENTASI LAYANAN (GallerySection)
 * =========================================================================
 * Ibarat bioskop mini di ruang tunggu klinik tempat rekaman potret perawatan
 * dan kegiatan harian diputar bergiliran. Dilengkapi tombol kendali geser
 * agar tamu dapat menelusuri kisah di balik layar Mische.
 */
const GallerySection = () => {
  // Meminta bantuan Mandor Bagian Dokumentasi (useGallerySection) untuk membukakan laci album foto dan menyerahkan tuas pemutar
  const {
    kegiatanList,     // Laci utama berisi seluruh koleksi foto
    mainKegiatan,     // Foto terpilih yang dipajang di layar besar
    uniqueThumbnails, // Deretan 3 foto kecil di bawah layar
    handlePrev,       // Tuas geser ke foto kiri
    handleNext,       // Tuas geser ke foto kanan
    goToIndex,        // Tuas lompat langsung ke foto yang ditunjuk
  } = useGallerySection();

  // Jika di dalam laci ternyata kosong melompong (tidak ada foto sama sekali), tutup bioskop ini agar panggung tidak terlihat bolong
  if (kegiatanList.length === 0) return null;

  return (
    // Ruangan bioskop dibalut karpet gradasi hijau asri dari hijau tua ke hijau muda bercahaya
    <div className="w-full bg-gradient-to-r from-[#56bc36] from-[30%] to-[#C6FFD1] relative overflow-hidden">
      
      {/* Bayangan lambang Mische raksasa (watermark) yang dipantulkan di latar belakang dinding */}
      <img
        src={Logo_Mische}
        alt="Background Watermark"
        className="absolute top-1/2 right-0 -translate-y-1/2 h-[50%] md:h-full w-auto max-w-none pointer-events-none z-0 opacity-65"
      />

      {/* ========================================================================= */}
      {/* 1. LAYAR LEBAR BIOSKOP UTAMA (DESKTOP VERSION)                            */}
      {/* Ibarat auditorium megah untuk penonton di layar laptop/desktop            */}
      {/* ========================================================================= */}
      <div className="hidden md:flex container mx-auto px-10 flex-col items-center relative z-10 text-white py-24">
        
        {/* --- PAPAN JUDUL ATAP BIOSKOP --- */}
        <div className="w-full text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">
            Inilah Kegiatan Harian Kami Dalam Memberikan Perawatan Terbaik.
          </h2>
          <p className="text-base opacity-90 tracking-wide uppercase font-semibold">
            #BEING BEAUTY WITH MISCHE
          </p>
        </div>

        {/* --- BINGKAI PROYEKTOR RAKSASA (Main Gallery Display) --- */}
        {/* Bingkai foto besar bersalut bayangan hitam elegan tempat menayangkan satu foto utama */}
        <div className="w-full max-w-5xl rounded-3xl overflow-hidden relative shadow-2xl mb-6 group bg-black/10">
          {/* Memeriksa apakah foto utama memiliki file gambar */}
          {mainKegiatan?.foto ? (
            <img
              src={`http://127.0.0.1:8000/storage/${mainKegiatan.foto}`}
              alt={mainKegiatan.namaKegiatan}
              className="w-full h-[500px] object-cover transition-all duration-300"
            />
          ) : (
            // Jika filenya rusak atau hilang, pasang plakat pengganti bertuliskan "Foto Tidak Tersedia"
            <div className="w-full h-[500px] flex items-center justify-center bg-gray-200 text-gray-500">
              Foto Tidak Tersedia
            </div>
          )}

          {/* --- KOTAK PENJELASAN FOTO (Caption) --- */}
          {/* Pita hitam transparan di bagian bawah foto tempat menuliskan nama dan deskripsi kegiatan */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12">
            <h3 className="text-2xl font-bold">{mainKegiatan?.namaKegiatan}</h3>
            <p className="text-base opacity-90 mt-1 line-clamp-2">{mainKegiatan?.deskripsi}</p>
          </div>

          {/* --- TUAS KIRI DAN KANAN PADA LAYAR RAKSASA (Nav Buttons) --- */}
          {/* Jika foto di laci lebih dari satu, munculkan tombol panah kiri dan kanan saat tamu mengarahkan mata (hover) ke foto */}
          {kegiatanList.length > 1 && (
            <>
              {/* Tombol Panah Kiri */}
              <button onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white/50 transition opacity-0 group-hover:opacity-100">
                <ChevronLeft size={28} />
              </button>
              {/* Tombol Panah Kanan */}
              <button onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white/50 transition opacity-0 group-hover:opacity-100">
                <ChevronRight size={28} />
              </button>
            </>
          )}
        </div>

        {/* --- MEJA POTRET KECIL DI BAWAH LAYAR (Thumbnails) --- */}
        {/* Tempat menyusun 3 bingkai foto kecil agar tamu bisa melompat melihat foto lain secara instan */}
        {uniqueThumbnails.length > 0 && (
          <div className="flex gap-6 justify-center w-full max-w-5xl mb-14">
            {uniqueThumbnails.map((thumb, idx) => (
              <div key={thumb.idKegiatan || idx} className="flex-1 max-w-[30%]">
                <img
                  src={`http://127.0.0.1:8000/storage/${thumb.foto}`}
                  alt={thumb.namaKegiatan}
                  className="w-full h-[220px] object-cover rounded-3xl shadow-lg border-2 border-transparent hover:border-white transition-all cursor-pointer opacity-70 hover:opacity-100"
                  onClick={() => {
                    // Ketika tamu menunjuk salah satu potret kecil, asisten mencari nomor laci aslinya lalu memerintahkan proyektor untuk melompat ke foto tersebut
                    const newIndex = kegiatanList.findIndex((k) => k.idKegiatan === thumb.idKegiatan);
                    if (newIndex !== -1) goToIndex(newIndex);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. LAYAR GENGGAM BIOSKOP MINI (MOBILE VERSION)                            */}
      {/* Ibarat layar lipat khusus untuk penonton dari handphone                   */}
      {/* ========================================================================= */}
      <div className="flex md:hidden container mx-auto px-6 flex-col items-center relative z-10 text-white py-12">
        
        {/* --- PAPAN JUDUL (MOBILE) --- */}
        <div className="w-full text-left mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Inilah Kegiatan Harian Kami Dalam Memberikan Perawatan Terbaik.
          </h2>
          <p className="text-sm opacity-90 tracking-wide uppercase font-semibold">
            #BEING BEAUTY WITH MISCHE
          </p>
        </div>

        {/* --- BINGKAI PROYEKTOR UTAMA (MOBILE) --- */}
        <div className="w-full max-w-5xl rounded-3xl overflow-hidden relative shadow-2xl mb-4 group bg-black/10">
          {mainKegiatan?.foto ? (
            <img
              src={`http://127.0.0.1:8000/storage/${mainKegiatan.foto}`}
              alt={mainKegiatan.namaKegiatan}
              className="w-full h-[200px] sm:h-[350px] object-cover transition-all duration-300"
            />
          ) : (
            <div className="w-full h-[200px] sm:h-[350px] flex items-center justify-center bg-gray-200 text-gray-500">
              Foto Tidak Tersedia
            </div>
          )}

          {/* --- KOTAK PENJELASAN FOTO (MOBILE) --- */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12">
            <h3 className="text-xl font-bold">{mainKegiatan?.namaKegiatan}</h3>
            <p className="text-sm opacity-90 mt-1 line-clamp-2">{mainKegiatan?.deskripsi}</p>
          </div>

          {/* --- TUAS KIRI DAN KANAN PADA LAYAR GENGGAM --- */}
          {/* Di layar HP, tombol panah dibiarkan menyala terus (opacity-100) karena tidak ada sensor mouse hover */}
          {kegiatanList.length > 1 && (
            <>
              <button onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white/50 transition opacity-100">
                <ChevronLeft size={24} />
              </button>
              <button onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white/50 transition opacity-100">
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* --- MEJA POTRET KECIL DI BAWAH LAYAR (MOBILE) --- */}
        {uniqueThumbnails.length > 0 && (
          <div className="flex gap-2 sm:gap-4 justify-center w-full max-w-5xl mb-10">
            {uniqueThumbnails.map((thumb, idx) => (
              <div key={thumb.idKegiatan || idx} className="flex-1 max-w-[30%]">
                <img
                  src={`http://127.0.0.1:8000/storage/${thumb.foto}`}
                  alt={thumb.namaKegiatan}
                  className="w-full h-[80px] sm:h-[150px] object-cover rounded-xl shadow-lg border-2 border-transparent hover:border-white transition-all cursor-pointer opacity-70 hover:opacity-100"
                  onClick={() => {
                    const newIndex = kegiatanList.findIndex((k) => k.idKegiatan === thumb.idKegiatan);
                    if (newIndex !== -1) goToIndex(newIndex);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- LAMPU HIAS ORNAMEN LATAR BELAKANG (Decorative Background) --- */}
      {/* Sorot cahaya hijau zamrud di sudut kanan dan kiri dinding agar bioskop tampak hidup dan berdimensi */}
      <div className="absolute right-0 top-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[800px] bg-[#6aba68] opacity-50 rounded-l-full blur-3xl translate-x-1/2 -translate-y-1/2 hidden md:block pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-[#9ade97] opacity-40 rounded-r-full blur-3xl -translate-x-1/2 translate-y-1/4 hidden md:block pointer-events-none" />
    </div>
  );
};

export default GallerySection;

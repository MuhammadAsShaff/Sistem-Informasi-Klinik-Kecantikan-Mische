import React from "react";
import { Clock, UserCircle } from "lucide-react";
import { useTentangKami } from "../hooks/useTentangKami";
import StoreMische from "@/assets/images/StoreMische.png";

/**
 * =========================================================================
 * BALAI PAMERAN VISI MISI & BANGUNAN (AboutInfoSection)
 * =========================================================================
 * Ibarat ruang pameran utama bernuansa sejuk tempat maket gedung klinik
 * dipajang megah. Di sekelilingnya terpahat prasasti Visi dan Misi, serta jam
 * dinding raksasa yang menandakan waktu pelayanannya.
 */
const AboutInfoSection = () => {
  // Memanggil Mandor Juru Bicara (useTentangKami) untuk meminta seluruh catatan rapi tentang klinik
  const { deskripsi, visi, misi, jamOperasional, doctorCount, imageSrc } = useTentangKami();

  return (
    // Panggung lantai dasar berwarna putih bersih tempat memajang seluruh prasasti
    <div className="w-full bg-white">
      
      {/* ========================================================================= */}
      {/* 1. TAMPILAN LAYAR LEBAR (DESKTOP VERSION)                                 */}
      {/* Ibarat melihat panggung dari kursi VIP penonton layar besar               */}
      {/* ========================================================================= */}
      <div className="hidden md:flex container mx-auto px-10 flex-col gap-16 text-[#333333] py-20">
        
        {/* --- PAPAN CERITA PENDAHULUAN (Header Paragraph) --- */}
        <div>
          {/* Judul megah bertuliskan nama klinik */}
          <h2 className="text-3xl font-extrabold text-black mb-4">Mische Clinic</h2>
          {/* Kotak perkamen yang memajang teks cerita klinik berformat indah (menggunakan dangerouslySetInnerHTML agar format tebal/miring dari database tetap terjaga) */}
          <div
            className="text-base leading-relaxed text-gray-700 text-justify quill-content [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_em]:italic"
            dangerouslySetInnerHTML={{ __html: deskripsi }}
          />
        </div>

        {/* --- BAGIAN LUKISAN GEDUNG & PRASASTI VISI MISI --- */}
        {/* Membagi meja pameran menjadi dua bagian kiri (Gedung) dan kanan (Visi Misi) */}
        <div className="flex flex-row gap-16 items-start">
          
          {/* Meja Sebelah Kiri: Memajang potret megah gedung klinik */}
          <div className="w-1/2 mt-2">
            <img
              // Jika server punya foto asli gedung, pakai itu. Jika kosong, pakai lukisan serep dari gudang aset (StoreMische)
              src={imageSrc || StoreMische}
              alt="Mische Clinic Building"
              className="w-full h-auto rounded-2xl shadow-lg object-cover"
            />
          </div>
          
          {/* Meja Sebelah Kanan: Berisi dua bongkah batu prasasti (Visi dan Misi) */}
          <div className="w-1/2 flex flex-col gap-8">
            {/* Prasasti Atas: Cita-cita utama klinik (Visi) */}
            <div>
              <h3 className="text-2xl font-bold text-black mb-2 text-left">Visi</h3>
              <div
                className="text-base text-gray-700 leading-relaxed text-justify quill-content [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_em]:italic"
                dangerouslySetInnerHTML={{ __html: visi }}
              />
            </div>
            
            {/* Prasasti Bawah: Langkah nyata pelayanan klinik (Misi) */}
            <div>
              <h3 className="text-2xl font-bold text-black mb-2 text-left">Misi</h3>
              <div
                className="text-base text-gray-700 leading-relaxed text-justify quill-content [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_em]:italic"
                dangerouslySetInnerHTML={{ __html: misi }}
              />
            </div>
          </div>
        </div>

        {/* --- DUA PILAR INDIKATOR PELAYANAN (Stats Jam & Jumlah Dokter) --- */}
        {/* Pilar kiri menunjuk jam kerja, pilar kanan menunjuk jumlah dokter aktif */}
        <div className="flex flex-row mt-8 justify-between w-full">
          
          {/* Pilar Pertama: Jam Operasional */}
          <div className="flex flex-col gap-3">
            <span className="text-xl font-bold text-black">Jam Operasional</span>
            <div className="flex items-center gap-4">
              {/* Wadah bulat berwarna hijau sejuk berisi lambang jam dinding (Clock) */}
              <div className="p-4 bg-[#baf5c6] rounded-full text-[#4BAF3A]">
                <Clock className="w-9 h-9" />
              </div>
              {/* Teks tebal jam pelayanan (Misal: 08:00 - 20:00 WIB) */}
              <span className="text-4xl font-extrabold text-black tracking-tight">
                {jamOperasional}
              </span>
            </div>
          </div>

          {/* Pilar Kedua: Jumlah Dokter Aktif */}
          <div className="flex flex-col gap-3">
            <span className="text-xl font-bold text-black">Jumlah Dokter</span>
            <div className="flex items-center gap-4">
              {/* Wadah bulat berwarna hijau sejuk berisi lambang siluet wajah dokter (UserCircle) */}
              <div className="p-4 bg-[#baf5c6] rounded-full text-[#4BAF3A]">
                <UserCircle className="w-9 h-9" />
              </div>
              {/* Teks tebal penghitung jumlah dokter yang bersiap melayani */}
              <span className="text-4xl font-extrabold text-black tracking-tight">
                {doctorCount} Dokter Aktif
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAMPILAN LAYAR GENGGAM (MOBILE VERSION)                                */}
      {/* Ibarat pameran lipat ringkas yang menyesuaikan layar kecil handphone tamu */}
      {/* ========================================================================= */}
      <div className="flex md:hidden container mx-auto px-6 flex-col gap-10 text-[#333333] py-12">
        
        {/* --- PAPAN CERITA PENDAHULUAN (MOBILE) --- */}
        <div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-black mb-2">Mische Clinic</h2>
          <div
            className="text-[10px] sm:text-sm leading-relaxed text-gray-700 text-justify quill-content [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_em]:italic"
            dangerouslySetInnerHTML={{ __html: deskripsi }}
          />
        </div>

        {/* --- BAGIAN LUKISAN GEDUNG & PRASASTI VISI MISI (MOBILE) --- */}
        {/* Menyusun potret gedung dan tulisan visi misi berdampingan secara merapat */}
        <div className="flex flex-row gap-3 items-start">
          
          {/* Sisi Kiri Mobile (45% lebar layar): Potret Gedung Klinik */}
          <div className="w-[45%] mt-2">
            <img
              src={imageSrc || StoreMische}
              alt="Mische Clinic Building"
              className="w-full h-auto rounded-xl shadow-md object-cover"
            />
          </div>
          
          {/* Sisi Kanan Mobile (55% lebar layar): Tulisan Visi dan Misi */}
          <div className="w-[55%] flex flex-col gap-3">
            <div>
              <h3 className="text-sm sm:text-xl font-bold text-black mb-1 text-left">Visi</h3>
              <div
                className="text-[10px] sm:text-sm text-gray-700 leading-normal text-left quill-content [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_em]:italic"
                dangerouslySetInnerHTML={{ __html: visi }}
              />
            </div>
            <div>
              <h3 className="text-sm sm:text-xl font-bold text-black mb-1 text-left">Misi</h3>
              <div
                className="text-[10px] sm:text-sm text-gray-700 leading-normal text-left quill-content [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_em]:italic"
                dangerouslySetInnerHTML={{ __html: misi }}
              />
            </div>
          </div>
        </div>

        {/* --- DUA PILAR INDIKATOR PELAYANAN (MOBILE) --- */}
        {/* Dibagi rata 50-50 agar muat di layar handphone yang sempit */}
        <div className="flex flex-row gap-4 mt-4 justify-between">
          
          {/* Kotak Kiri Mobile: Jam Operasional */}
          <div className="flex flex-col gap-2 w-1/2">
            <span className="text-xs sm:text-lg font-bold text-black">Jam Operasional</span>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#baf5c6] rounded-full text-[#4BAF3A]">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[12px] sm:text-2xl font-extrabold text-black tracking-tight">
                {jamOperasional}
              </span>
            </div>
          </div>

          {/* Kotak Kanan Mobile: Jumlah Dokter Aktif */}
          <div className="flex flex-col gap-2 w-1/2">
            <span className="text-xs sm:text-lg font-bold text-black">Jumlah Dokter</span>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#baf5c6] rounded-full text-[#4BAF3A]">
                <UserCircle className="w-5 h-5" />
              </div>
              <span className="text-[12px] sm:text-2xl font-extrabold text-black tracking-tight">
                {doctorCount} Dokter Aktif
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutInfoSection;

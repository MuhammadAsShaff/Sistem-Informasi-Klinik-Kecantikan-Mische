import React from 'react';

/**
 * =========================================================================
 * PLANG PENJELAS MANFAAT PRODUK (DescriptionSection)
 * =========================================================================
 * Ibarat plang prasasti besar di tengah taman pameran yang menceritakan
 * keunggulan ramuan rahasia Mische Skincare. Tulisan ini menjelaskan bagaimana
 * produk merawat, melembapkan, dan mencerahkan wajah tamu dengan harga terjangkau.
 */
const DescriptionSection = () => {
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#266E0F] mb-6">
          Rangkaian Produk Skincare Untuk<br className="hidden md:block" /> Lengkapi Kebutuhan Kamu
        </h2>
        <p className="text-[#266E0F] text-sm md:text-base leading-relaxed mb-6 text-justify md:text-center px-2 md:px-0">
          Dengan Rangkaian Produk Yang Diformulasikan Khusus Untuk Perawatan Kulit Wajah, MISCHE Skincare Menghadirkan Manfaat Lengkap Yang Dibutuhkan Kulitmu. Mulai Dari Mencerahkan Warna Kulit, Menjaga Kelembapan Optimal, Hingga Mengatasi Tanda-Tanda Penuaan Dini. Produk Klinik Mische Juga Efektif Dalam Merawat Kulit Berjerawat Dan Membantu Mengembalikan Kilau Alami Wajahmu. Dengan Harga Yang Terjangkau, Klinik Mische Menjadi Pilihan Tepat Bagi Kamu Yang Ingin Merawat Kulit Secara Menyeluruh Dan Tampil Percaya Diri Setiap Hari
        </p>
      </div>
    </section>
  );
};

export default DescriptionSection;

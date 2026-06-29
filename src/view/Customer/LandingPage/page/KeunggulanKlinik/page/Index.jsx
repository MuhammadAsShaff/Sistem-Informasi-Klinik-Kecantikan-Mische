import React from 'react';
import KeunggulanCard from './KeunggulanCard';
import KeunggulanHeader from './KeunggulanHeader';

// Import Icons Assets
import IconHealth from '@/assets/icons/IconHealth.png';
import IconSpesialis from '@/assets/icons/IconSpesialis.png';
import IconDokter from '@/assets/icons/IconDokter (2).png';
import IconMonitoring from '@/assets/icons/IconMonitoring.png';
import IconJari from '@/assets/icons/IconJari.png';

const advantages = [
  {
    id: 1,
    title: "Perawatan Yang Dipersonalisasi Sesuai Kondisi Kulit",
    description: "Untuk Perawatan Lebih Tepat",
    icon: <img src={IconHealth} alt="Health" className="w-12 h-12" />,
  },
  {
    id: 2,
    title: "Spesialisasi Perawatan Kulit Berjerawat",
    description: "Ditangani Oleh Dokter Berpengalaman",
    icon: <img src={IconSpesialis} alt="Spesialis" className="w-12 h-12" />,
  },
  {
    id: 3,
    title: "Menggabungkan Relaksasi (Facial + Totok Wajah)",
    description: "Kesehatan Wajah",
    icon: <img src={IconDokter} alt="Dokter" className="w-12 h-12" />,
  },
  {
    id: 4,
    title: "Pemantauan Hasil Yang Teratur",
    description: "Untuk Perawatan Lebih Tepat",
    icon: <img src={IconMonitoring} alt="Monitoring" className="w-12 h-12" />,
  },
  {
    id: 5,
    title: "Penggunaan Produk Skincare Berkualitas Tinggi",
    description: "Skincare Berkualitas Untuk Hasil Maksimal",
    icon: <img src={IconJari} alt="Jari" className="w-12 h-12" />,
  }
];

/**
 * =========================================================================
 * TUGU PAMERAN LIMA PILAR KEUNGGULAN (KeunggulanKlinik)
 * =========================================================================
 * Ibarat tugu pameran putih bersih di tengah alun-alun klinik yang memamerkan
 * lima piagam emas keunggulan Mische. Pameran ini meyakinkan tamu bahwa klinik
 * ini memiliki layanan personal, dokter ahli, dan produk berkualitas tinggi.
 */
export default function KeunggulanKlinik() {
  return (
    <section className="w-full py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <KeunggulanHeader />

        <div className="grid grid-cols-2 md:grid-cols-2 gap-x-3 md:gap-x-24 gap-y-8 md:gap-y-16 max-w-6xl mx-auto">
          {advantages.map((item) => (
            <KeunggulanCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';

export function useEventData() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua'); // 'Semua', 'Akan Berlangsung', 'Sedang Berlangsung', 'Sudah Selesai'

  useEffect(() => {
    // Generate dummy data
    const dummyEvents = [
      {
        id: 1,
        title: "Seminar Kecantikan DI Politeknik Caltex Riau",
        startDate: "2025-11-23",
        endDate: "2025-11-25",
        location: "Politeknik Caltex Riau",
        description: "Seminar Kecantikan Yang Diselenggarakan Oleh Klinik Kecantikan Mische Akan Berlangsung Di Politeknik Caltex Riau Pada 23-25 November 2025 Dan Ditujukan Bagi Mahasiswa, Tenaga Pendidik, Serta Masyarakat Umum Yang Tertarik Untuk Memperdalam Wawasan Seputar Dunia Kecantikan. Acara Ini Akan Menghadirkan Sesi Edukatif Mengenai Perawatan Kulit Yang Tepat, Pengenalan Teknologi Terbaru Dalam Estetika, Tips Praktis Menjaga Kesehatan Dan Penampilan Sehari-Hari, Serta Diskusi Langsung Dengan Para Ahli Kecantikan Dari Mische. Melalui Kegiatan Ini, Peserta Diharapkan Memperoleh Pengetahuan Dan Keterampilan Yang Dapat Diterapkan Dalam Kehidupan Sehari-Hari Maupun Dunia Profesional Yang Berkaitan Dengan Industri Kecantikan.",
        shortDescription: "Bakal Di Adain Di Kampus Ternama Di Riau Yaitu PCR Untuk Penjelasan Nya....",
        status: "Akan Berlangsung"
      },
      {
        id: 2,
        title: "Beauty Workshop 2025",
        startDate: "2025-12-01",
        endDate: "2025-12-02",
        location: "Hotel Pangeran Pekanbaru",
        description: "Ikuti beauty workshop eksklusif bersama dokter spesialis Mische Aesthetic Clinic.",
        shortDescription: "Workshop kecantikan eksklusif dengan para dokter ahli dari Mische...",
        status: "Akan Berlangsung"
      },
      {
        id: 3,
        title: "Mische Anniversary Sale & Event",
        startDate: "2024-05-10",
        endDate: "2024-05-15",
        location: "Mische Clinic Main Branch",
        description: "Merayakan ulang tahun Mische dengan berbagai acara menarik dan diskon besar-besaran.",
        shortDescription: "Perayaan ulang tahun klinik dengan acara meriah dan diskon...",
        status: "Sudah Selesai"
      },
      {
        id: 4,
        title: "Free Skin Check Campaign",
        startDate: "2026-05-18",
        endDate: "2026-05-22", // Asumsikan hari ini berada di rentang ini
        location: "Mall SKA Pekanbaru",
        description: "Kampanye periksa kulit gratis untuk masyarakat Pekanbaru. Hadirilah booth kami di Mall SKA.",
        shortDescription: "Periksa kondisi kulitmu secara gratis bersama dokter ahli kami di...",
        status: "Sedang Berlangsung"
      }
    ];
    setEvents(dummyEvents);
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'Semua' || event.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getCountByStatus = (status) => {
    return events.filter(e => e.status === status).length;
  };

  return { 
    events: filteredEvents, 
    searchQuery, 
    setSearchQuery, 
    activeFilter, 
    setActiveFilter,
    summary: {
      akanBerlangsung: getCountByStatus('Akan Berlangsung'),
      sedangBerlangsung: getCountByStatus('Sedang Berlangsung'),
      sudahSelesai: getCountByStatus('Sudah Selesai')
    }
  };
}

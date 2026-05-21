import { useState, useEffect } from 'react';

export function useFetchEvent() {
  const [events, setEvents] = useState([]);

  const fetchEvents = () => {
    try {
      const stored = localStorage.getItem('mische_events');
      let data = stored ? JSON.parse(stored) : [];
      
      if (data.length === 0) {
        data = [
          {
            id: 1,
            nama: "Seminar Kecantikan DI Politeknik Caltex Riau",
            tanggalMulai: "2025-11-23",
            tanggalSelesai: "2025-11-25",
            lokasi: "Politeknik Caltex Riau",
            deskripsi: "Seminar Kecantikan Yang Diselenggarakan Oleh Klinik Kecantikan Mische Akan Berlangsung Di Politeknik Caltex Riau...",
          },
          {
            id: 2,
            nama: "Beauty Workshop 2025",
            tanggalMulai: "2025-12-01",
            tanggalSelesai: "2025-12-02",
            lokasi: "Hotel Pangeran Pekanbaru",
            deskripsi: "Ikuti beauty workshop eksklusif bersama dokter spesialis Mische Aesthetic Clinic.",
          }
        ];
        localStorage.setItem('mische_events', JSON.stringify(data));
      }
      setEvents(data);
    } catch (error) {
      console.error("Gagal memuat data event:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, refetch: fetchEvents };
}

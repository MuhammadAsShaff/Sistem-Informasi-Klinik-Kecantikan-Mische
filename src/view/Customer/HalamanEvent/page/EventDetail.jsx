import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import gambarEvent from '@/assets/images/gambar event.png';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  // Fallback to fetch data directly if not using state management
  useEffect(() => {
    window.scrollTo(0, 0);
    // Dummy Data Fetching (simulating useEventData)
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
        description: "Seminar Kecantikan yang diselenggarakan oleh Klinik Kecantikan Mische akan berlangsung di Politeknik Caltex Riau pada 23–25 November 2025 dan ditujukan bagi mahasiswa, tenaga pendidik, serta masyarakat umum yang tertarik untuk memperdalam wawasan seputar dunia kecantikan. Acara ini akan menghadirkan sesi edukatif mengenai perawatan kulit yang tepat, pengenalan teknologi terbaru dalam estetika, tips praktis menjaga kesehatan dan penampilan sehari-hari, serta diskusi langsung dengan para ahli kecantikan dari Mische. Melalui kegiatan ini, peserta diharapkan memperoleh pengetahuan dan keterampilan yang dapat diterapkan dalam kehidupan sehari-hari maupun dunia profesional yang berkaitan dengan industri kecantikan.",
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
        endDate: "2026-05-22",
        location: "Mall SKA Pekanbaru",
        description: "Kampanye periksa kulit gratis untuk masyarakat Pekanbaru. Hadirilah booth kami di Mall SKA.",
        shortDescription: "Periksa kondisi kulitmu secara gratis bersama dokter ahli kami di...",
        status: "Sedang Berlangsung"
      }
    ];
    
    const found = dummyEvents.find(e => e.id.toString() === id);
    if (found) {
      setEvent(found);
    }
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <p className="text-gray-500 font-medium">Event tidak ditemukan.</p>
      </div>
    );
  }

  const formatTanggal = (dateString) => {
    if (!dateString) return "";
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-10 pb-20">
      <div className="max-w-[1000px] mx-auto px-4 md:px-6">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#56BC36] font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Kembali ke Event
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-tl-[40px] rounded-br-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 md:p-10 mb-8">
          
          {/* Hero Banner */}
          <div className="w-full h-[200px] md:h-[300px] bg-gray-200 rounded-2xl mb-10 overflow-hidden relative">
             <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${gambarEvent})` }}></div>
          </div>

          <h1 className="text-3xl md:text-[40px] leading-tight font-bold text-black mb-8">{event.title}</h1>

          {/* Icon Rows */}
          <div className="flex flex-col md:flex-row md:items-center gap-6 border-b border-gray-100 pb-8">
            
            {/* Calendar */}
            <div className="flex items-center gap-4">
              <div className="text-[#56BC36]"><Calendar size={48} strokeWidth={1.5} /></div>
              <div className="flex items-center gap-3">
                <div className="bg-[#56BC36] text-white px-5 py-2 rounded-full font-semibold shadow-sm">
                  {formatTanggal(event.startDate)}
                </div>
                <div className="font-bold text-3xl text-black">-</div>
                <div className="bg-[#56BC36] text-white px-5 py-2 rounded-full font-semibold shadow-sm">
                  {formatTanggal(event.endDate)}
                </div>
              </div>
            </div>

            {/* Divider for Desktop */}
            <div className="hidden md:block w-px h-12 bg-gray-200 mx-4"></div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <div className="text-[#56BC36]"><MapPin size={48} strokeWidth={1.5} /></div>
              <div className="bg-[#56BC36] text-white px-5 py-2 rounded-full font-semibold shadow-sm">
                {event.location}
              </div>
            </div>
            
          </div>

          {/* Description */}
          <div className="prose max-w-none text-gray-700 text-[16px] leading-relaxed text-justify">
            <p>{event.description}</p>
          </div>

        </div>

      </div>
    </div>
  );
}

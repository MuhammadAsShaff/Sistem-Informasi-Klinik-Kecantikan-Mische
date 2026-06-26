import React from 'react';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import gambarEvent from '@/assets/images/gambar event.png';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';
import { useEventDetail } from '../hooks/useEventDetail';

export default function EventDetail() {
  const { navigate, isLoading, event, formatTanggal } = useEventDetail();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <p className="text-gray-500 font-medium">Memuat...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <p className="text-gray-500 font-medium">Event tidak ditemukan.</p>
      </div>
    );
  }



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
            {event.foto ? (
              <img src={event.foto.startsWith('http') ? event.foto : `${STORAGE_BASE_URL}${String(event.foto).replace(/^(?:public\/|storage\/|\/)+/, '')}`} alt={event.nama} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${gambarEvent})` }}></div>
            )}
          </div>

          <h1 className="text-3xl md:text-[40px] leading-tight font-bold text-black mb-8">{event.nama || event.title}</h1>

          {/* Icon Rows */}
          <div className="flex flex-col md:flex-row md:items-center gap-6 border-b border-gray-100 pb-8">

            {/* Calendar */}
            <div className="flex items-center gap-4">
              <div className="text-[#56BC36]"><Calendar size={48} strokeWidth={1.5} /></div>
              <div className="flex items-center gap-3">
                <div className="bg-[#56BC36] text-white px-5 py-2 rounded-full font-semibold shadow-sm">
                  {formatTanggal(event.tanggalMulai || event.startDate)}
                </div>
                <div className="font-bold text-3xl text-black">-</div>
                <div className="bg-[#56BC36] text-white px-5 py-2 rounded-full font-semibold shadow-sm">
                  {formatTanggal(event.tanggalSelesai || event.endDate)}
                </div>
              </div>
            </div>

            {/* Divider for Desktop */}
            <div className="hidden md:block w-px h-12 bg-gray-200 mx-4"></div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <div className="text-[#56BC36]"><MapPin size={48} strokeWidth={1.5} /></div>
              <div className="bg-[#56BC36] text-white px-5 py-2 rounded-full font-semibold shadow-sm">
                {event.lokasi || event.location}
              </div>
            </div>

          </div>

          {/* Description */}
          <div className="prose max-w-none text-gray-700 text-[16px] leading-relaxed text-justify mt-8 whitespace-pre-line">
            <p>{event.deskripsi || event.description}</p>
          </div>

        </div>

      </div>
    </div>
  );
}

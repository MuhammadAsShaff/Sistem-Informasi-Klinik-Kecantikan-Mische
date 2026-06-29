import React from 'react';
import { Search } from 'lucide-react';
import { useEventData } from '../hooks/useEventData';
import EventCard from './EventCard';
import logomischee from '@/assets/images/LogoMischee.png'
import bgEvent from '@/assets/images/gambar event yang berlangsung.png'
import CustomerLoading from '@/components/CustomerLoading';

/**
 * =========================================================================
 * BALAI ALUN-ALUN ACARA KLINIK (HalamanEvent)
 * =========================================================================
 * Ibarat alun-alun taman festival tempat seluruh kegiatan klinik dipaparkan.
 * Bagian atas menampilkan spanduk penyambutan megah. Di sekelilingnya terdapat
 * deretan Brosur Acara (EventCard) dan Papan Statistik (SummaryCard), dengan
 * arahan dari Mandor Acara (useEventData).
 */
export default function HalamanEvent() {
  const { events, searchQuery, setSearchQuery, activeFilter, setActiveFilter, summary, isLoading } = useEventData();

  const filters = ['Akan Berlangsung', 'Sudah Selesai', 'Sedang Berlangsung'];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-10 pb-20">
      <div className="max-w-[1300px] mx-auto px-4 md:px-6">

        {/* Hero Banner */}
        <div className="relative w-full bg-gradient-to-r from-[#56bc36] from-[55%] to-[#C6FFD1] rounded-tl-[30px] rounded-br-[30px] overflow-hidden mb-12 flex items-center min-h-[160px] md:min-h-[200px] p-8 shadow-sm">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-xl md:text-5xl font-bold text-white leading-tight">
              Event Yang Akan <br /> Diselenggarakan
            </h1>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 sm:w-1/4 pointer-events-none flex items-center justify-end p-4 sm:p-12 z-10">
            <img
              src={logomischee}
              alt="Mische Logo"
              className="h-2/3 sm:h-full w-auto object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* Filter & Search Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-lg text-black mr-2">Event:</span>
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(activeFilter === filter ? 'Semua' : filter)}
                className={`px-5 py-2.5 rounded-tl-[10px] rounded-br-[10px] font-semibold text-sm transition-all duration-300
                  ${activeFilter === filter
                    ? 'bg-[#56BC36] text-white shadow-md'
                    : 'bg-[#56BC36]/90 text-white hover:bg-[#56BC36] hover:shadow-md'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64 lg:w-70">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-full shadow-sm focus:ring-2 focus:ring-[#56BC36] outline-none text-gray-700 font-medium transition-all"
            />
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Grid (Left Side) */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <CustomerLoading text="Memuat daftar event..." />
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 rounded-3xl text-center shadow-sm border border-gray-100">
                <p className="text-gray-500 text-lg font-medium">Tidak ada event yang ditemukan.</p>
              </div>
            )}
          </div>

          {/* Sidebar / Summary Cards (Right Side) */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <SummaryCard
              title="Event Yang Akan Di Selenggarakan"
              count={summary.akanBerlangsung}
              suffix="Yang Akan Berlangsung"
              style={{ backgroundImage: `url(${bgEvent})` }} />
            <SummaryCard
              title="Event Yang Sudah Di Selenggarakan"
              count={summary.sudahSelesai}
              suffix="Yang Sudah Berlangsung"
              style={{ backgroundImage: `url(${bgEvent})` }}
            />
            <SummaryCard
              title="Event Yang Sedang Di Selenggarakan"
              count={summary.sedangBerlangsung}
              suffix="Yang Sedang Berlangsung"
              style={{ backgroundImage: `url(${bgEvent})` }} />
          </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponent for Sidebar Summary Cards
function SummaryCard({ title, count, suffix, style }) {
  return (
    <div className="relative w-full h-[140px] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gray-800">
        <div className="w-full h-full bg-cover bg-center duration-500 opacity-62"
          style={style || { backgroundImage: `url(${bgEvent})` }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center p-6 text-white">
        <h3 className="text-xl font-bold leading-tight mb-2 pr-4">{title}</h3>
        <p className="text-xs font-medium text-gray-200">
          Terdapat <span className="font-bold text-white">{count} Event</span> {suffix}
        </p>
      </div>
    </div>
  );
}

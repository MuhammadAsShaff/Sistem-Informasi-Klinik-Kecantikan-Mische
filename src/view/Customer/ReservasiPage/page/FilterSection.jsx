import React from 'react';
import { Calendar } from 'lucide-react';

// --- SUB-KOMPONEN UNTUK DROPDOWN ---
const DropdownItem = ({ label, value, options, isOpen, onToggle, onSelect }) => (
  <div className="relative">
    <div 
      onClick={onToggle}
      className="bg-white rounded-full px-8 py-4 shadow-sm border border-gray-100 flex items-center justify-center gap-2 group transition-colors cursor-pointer hover:border-[#56BC36]"
    >
      <span className="text-gray-900 text-sm md:text-base font-regular">
        {label} : <span className="font-bold">{value}</span>
      </span>
      <div className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
        <svg viewBox="0 0 24 24" fill="#56BC36"><path d="M12 21l-12-18h24z" /></svg>
      </div>
    </div>
    {isOpen && (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
        {options.map((opt) => (
          <div key={opt} onClick={() => onSelect(opt)} className="px-8 py-3 hover:bg-green-50 cursor-pointer text-sm text-gray-700 transition-colors">
            {opt}
          </div>
        ))}
      </div>
    )}
  </div>
);

// --- SUB-KOMPONEN UNTUK INFO KOTAK ---
const InfoItem = ({ label, value }) => (
  <div className="bg-white rounded-full px-4 py-3 md:py-4 shadow-sm border border-gray-100 flex items-center justify-center">
    <span className="text-gray-900 text-sm md:text-base text-center font-regular">
      {label} : <span className="font-bold">{value}</span>
    </span>
  </div>
);

// --- KOMPONEN UTAMA FILTER ---
export default function FilterSection({ 
  treatment, setTreatment, 
  doctor, setDoctor, 
  selectedDate, setSelectedDate,
  openDropdown, setOpenDropdown,
  getHari, formatTgl,
  doctorsList = [],
  countKosong = 0,
  countTerisi = 0
}) {
  const treatments = ["Acne Treatment", "Facial Rejuvenation", "Laser Therapy", "Brightening Therapy"];
  
  // Filter dokter yang statusnya "Tersedia"
  const availableDoctors = doctorsList.filter(d => (d.status || "Tersedia") === "Tersedia");
  
  // Jika ada dokter tersedia, tampilkan namanya. Jika tidak, hanya tampilkan "-"
  const doctors = availableDoctors.length > 0 
    ? availableDoctors.map(d => d.nama) 
    : ["-"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <DropdownItem 
          label="Jenis Treatment" value={treatment} options={treatments}
          isOpen={openDropdown === 't'}
          onToggle={() => setOpenDropdown(openDropdown === 't' ? null : 't')}
          onSelect={(v) => { setTreatment(v); setOpenDropdown(null); }}
        />
        <DropdownItem 
          label="Dokter Yang Menghandle" value={doctor} options={doctors}
          isOpen={openDropdown === 'd'}
          onToggle={() => setOpenDropdown(openDropdown === 'd' ? null : 'd')}
          onSelect={(v) => { setDoctor(v); setOpenDropdown(null); }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <InfoItem label="Jadwal Kosong" value={countKosong} />
        <InfoItem label="Jadwal Terisi" value={countTerisi} />
      </div>
    </div>
  );
}

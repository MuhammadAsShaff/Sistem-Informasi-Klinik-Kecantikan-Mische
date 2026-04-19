import React, { useState } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Tabel from "./Tabel";
import Pagination from "./Pagination";
import ModalTambahJadwal from "./ModalTambahJadwal";
import ModalPerbaruiJadwal from "./ModalPerbaruiJadwal";
import ModalHapusJadwal from "./ModalHapusJadwal";

export default function KelolaJadwalReservasiTreatment() {
  const [dataJadwal] = useState([
    { id: 1, jamMulai: "09:00", jamSelesai: "10:00" },
    { id: 2, jamMulai: "10:00", jamSelesai: "11:00" },
    { id: 3, jamMulai: "11:00", jamSelesai: "12:00" },
    { id: 4, jamMulai: "13:00", jamSelesai: "14:00" },
    { id: 5, jamMulai: "14:00", jamSelesai: "15:00" },
  ]);
  
  // State untuk Modal
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState(null);

  // Handlers
  const handleEdit = (jadwal) => {
    setSelectedJadwal(jadwal);
    setIsEditOpen(true);
  };

  const handleDelete = (jadwal) => {
    setSelectedJadwal(jadwal);
    setIsHapusOpen(true);
  };

  const confirmDelete = () => {
    console.log('Jadwal dihapus:', selectedJadwal);
    setIsHapusOpen(false);
  };

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        {/* HEADER DAN SEARCH */}
        <Header />
        <SearchBar onOpenTambah={() => setIsTambahOpen(true)} />
        
        {/* TABLE DATA */}
        <Tabel 
          data={dataJadwal} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />

        {/* PAGINATION */}
        <Pagination />

        {/* MODALS */}
        <ModalTambahJadwal 
          isOpen={isTambahOpen} 
          onClose={() => setIsTambahOpen(false)} 
        />
        
        <ModalPerbaruiJadwal 
          isOpen={isEditOpen} 
          onClose={() => setIsEditOpen(false)} 
          jadwalData={selectedJadwal}
        />

        <ModalHapusJadwal 
          isOpen={isHapusOpen} 
          onClose={() => setIsHapusOpen(false)} 
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}

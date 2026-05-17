import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Tabel from "./Tabel";
import Pagination from "./Pagination";
import ModalTambahJadwal from "./ModalTambahJadwal";
import ModalPerbaruiJadwal from "./ModalPerbaruiJadwal";
import ModalHapusJadwal from "./ModalHapusJadwal";
import ToastAlert from '@/view/components/ToastAlert';

export default function KelolaJadwalReservasiTreatment() {
  const [dataJadwal, setDataJadwal] = useState([]);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
  
  // State untuk Modal
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8000/api/admin/schedules', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setDataJadwal(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setToast({ isOpen: true, message: 'Gagal memuat jadwal.', type: 'error' });
    }
  };

  // Handlers
  const handleEdit = (jadwal) => {
    setSelectedJadwal(jadwal);
    setIsEditOpen(true);
  };

  const handleDelete = (jadwal) => {
    setSelectedJadwal(jadwal);
    setIsHapusOpen(true);
  };

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen animate-in fade-in duration-700">
      <ToastAlert isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({...toast, isOpen: false})} />
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        <Header />
        <SearchBar onOpenTambah={() => setIsTambahOpen(true)} />
        
        <Tabel 
          data={dataJadwal}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Pagination />

        <ModalTambahJadwal
          isOpen={isTambahOpen} 
          onClose={() => setIsTambahOpen(false)}
          existingSchedules={dataJadwal}
          onSuccess={() => {
            setIsTambahOpen(false);
            fetchSchedules();
            setToast({ isOpen: true, message: 'Jadwal berhasil ditambahkan!', type: 'success' });
          }}
        />
        
        <ModalPerbaruiJadwal 
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)} 
          existingSchedules={dataJadwal}
          jadwalData={selectedJadwal}
          onSuccess={() => {
            setIsEditOpen(false);
            fetchSchedules();
            setToast({ isOpen: true, message: 'Jadwal berhasil diperbarui!', type: 'success' });
          }}
        />

        <ModalHapusJadwal 
          isOpen={isHapusOpen}
          onClose={() => setIsHapusOpen(false)}
          jadwalData={selectedJadwal}
          onSuccess={() => {
            setIsHapusOpen(false);
            fetchSchedules();
            setToast({ isOpen: true, message: 'Jadwal berhasil dihapus!', type: 'success' });
          }}
        />
      </div>
    </div>
  );
}


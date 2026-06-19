import React, { useState } from "react";
import { useFetchJadwal } from "../hooks/useFetchJadwal";
import { useTambahJadwal } from "../hooks/useTambahJadwal";
import { useEditJadwal } from "../hooks/useEditJadwal";
import { useHapusJadwal } from "../hooks/useHapusJadwal";

import Header from "./Header";
import SearchBar from '@/components/SearchBar';
import { Plus } from "lucide-react";
import Tabel from "./Tabel";
import Pagination from '@/components/Pagination';
import ModalTambahJadwal from "./ModalTambahJadwal";
import ModalPerbaruiJadwal from "./ModalPerbaruiJadwal";
import ModalHapusJadwal from "./ModalHapusJadwal";
import ToastAlert from "@/view/components/ToastAlert";

export default function KelolaJadwalReservasiTreatment() {
  // State seleksi jadwal (untuk edit & hapus)
  const [selectedJadwal, setSelectedJadwal] = useState(null);

  // State visibilitas modal
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);

  // State toast notifikasi
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // ─── HOOK: READ ───────────────────────────────────────────────
  const { dataJadwal, isLoading, fetchSchedules } = useFetchJadwal();

  // ─── HOOK: CREATE ─────────────────────────────────────────────
  const tambahJadwal = useTambahJadwal(
    dataJadwal,
    () => {
      setIsTambahOpen(false);
      fetchSchedules();
      showToast("Jadwal berhasil ditambahkan!");
    },
    isTambahOpen
  );

  // ─── HOOK: UPDATE ─────────────────────────────────────────────
  const editJadwal = useEditJadwal(
    selectedJadwal,
    dataJadwal,
    () => {
      setIsEditOpen(false);
      fetchSchedules();
      showToast("Jadwal berhasil diperbarui!");
    },
    isEditOpen
  );

  // ─── HOOK: DELETE ─────────────────────────────────────────────
  const hapusJadwal = useHapusJadwal(
    selectedJadwal,
    () => {
      setIsHapusOpen(false);
      fetchSchedules();
      showToast("Jadwal berhasil dihapus!");
    },
    showToast
  );

  // Handler buka modal edit
  const handleEdit = (jadwal) => {
    setSelectedJadwal(jadwal);
    setIsEditOpen(true);
  };

  // Handler buka modal hapus
  const handleDelete = (jadwal) => {
    setSelectedJadwal(jadwal);
    setIsHapusOpen(true);
  };

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(dataJadwal.length / ITEMS_PER_PAGE);

  const paginatedJadwal = dataJadwal.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen animate-in fade-in duration-700">
      {toast && (
        <ToastAlert
          isOpen={true}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        <Header />
        <SearchBar 
          rightComponents={
            <button 
              onClick={() => setIsTambahOpen(true)}
              className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={20} />
            </button>
          }
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-gray-500 font-bold">
            Mengambil data dari server...
          </div>
        ) : (
          <Tabel isLoading={isLoading}
            data={paginatedJadwal}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        )}

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />

        <ModalTambahJadwal
          isOpen={isTambahOpen}
          onClose={() => setIsTambahOpen(false)}
          hook={tambahJadwal}
        />

        <ModalPerbaruiJadwal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          hook={editJadwal}
        />

        <ModalHapusJadwal
          isOpen={isHapusOpen}
          onClose={() => setIsHapusOpen(false)}
          hook={hapusJadwal}
        />
      </div>
    </div>
  );
}

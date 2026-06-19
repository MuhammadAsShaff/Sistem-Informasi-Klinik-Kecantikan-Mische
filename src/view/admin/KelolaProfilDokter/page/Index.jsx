import React, { useState } from "react";
import { useFetchDokter } from "../hooks/useFetchDokter";
import { useTambahDokter } from "../hooks/useTambahDokter";
import { useEditDokter } from "../hooks/useEditDokter";
import { useHapusDokter } from "../hooks/useHapusDokter";

import Header from "./Header";
import SearchBar from '@/components/SearchBar';
import { Plus } from "lucide-react";
import Tabel from "./Tabel";
import ModalTambahDokter from "./ModalTambahDokter";
import ModalPerbaruiDokter from "./ModalPerbaruiDokter";
import ModalHapusDokter from "./ModalHapusDokter";
import ToastAlert from "@/view/components/ToastAlert";
import Pagination from '@/components/Pagination';

export default function KelolaProfilDokter() {
  // State seleksi dokter (untuk edit & hapus)
  const [selectedDokter, setSelectedDokter] = useState(null);

  // State visibilitas modal
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);

  // State toast notifikasi
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // ─── HOOK: READ & SEARCH ───────────────────────────────────────
  const {
    dataDokter,
    searchQuery,
    setSearchQuery,
    isLoading,
    fetchDokter,
    startIndex,
  } = useFetchDokter();

  // ─── HOOK: CREATE ─────────────────────────────────────────────
  const tambahDokter = useTambahDokter(
    () => { 
      setIsTambahOpen(false); 
      fetchDokter(); 
    },
    showToast
  );

  // ─── HOOK: UPDATE ─────────────────────────────────────────────
  const editDokter = useEditDokter(
    selectedDokter,
    () => { 
      setIsEditOpen(false); 
      fetchDokter(); 
    },
    showToast
  );

  // ─── HOOK: DELETE & STATUS ────────────────────────────────────
  const { confirmDelete, updateStatusDokter } = useHapusDokter(
    selectedDokter,
    () => { 
      fetchDokter(); 
    },
    showToast
  );

  // Handler buka modal edit
  const handleEdit = (dokter) => {
    setSelectedDokter(dokter);
    setIsEditOpen(true);
  };

  // Handler buka modal hapus
  const handleDelete = (dokter) => {
    setSelectedDokter(dokter);
    setIsHapusOpen(true);
  };

  // Handler update status
  const handleStatusChange = (id, newStatus) => {
    updateStatusDokter(id, newStatus);
  };

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(dataDokter.length / ITEMS_PER_PAGE);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedDokter = dataDokter.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER DAN SEARCH */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
        <Header />
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          rightComponents={
            <button 
              onClick={() => setIsTambahOpen(true)}
              className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={20} />
            </button>
          }
        />
      </div>

      {/* TABLE DATA */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-gray-500 font-bold">
          Mengambil data dokter...
        </div>
      ) : (
        <Tabel isLoading={isLoading}
          data={paginatedDokter}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />

      {/* MODALS */}
      <ModalTambahDokter
        isOpen={isTambahOpen}
        onClose={() => setIsTambahOpen(false)}
        hook={tambahDokter}
      />

      <ModalPerbaruiDokter
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        hook={editDokter}
      />

      <ModalHapusDokter
        isOpen={isHapusOpen}
        onClose={() => setIsHapusOpen(false)}
        onConfirm={() => confirmDelete(() => setIsHapusOpen(false))}
      />

      {/* TOAST NOTIFICATION */}
      <ToastAlert
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
}

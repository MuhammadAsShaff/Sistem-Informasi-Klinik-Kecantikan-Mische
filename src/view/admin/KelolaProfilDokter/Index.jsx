import React, { useState } from "react";
import { useFetchDokter } from "./hooks/useFetchDokter";
import { useTambahDokter } from "./hooks/useTambahDokter";
import { useEditDokter } from "./hooks/useEditDokter";
import { useHapusDokter } from "./hooks/useHapusDokter";

import Header from "./page/Header";
import SearchBar from "./page/SearchBar";
import Tabel from "./page/Tabel";
import ModalTambahDokter from "./page/ModalTambahDokter";
import ModalPerbaruiDokter from "./page/ModalPerbaruiDokter";
import ModalHapusDokter from "./page/ModalHapusDokter";
import ToastAlert from "@/view/components/ToastAlert";
import Pagination from "../components/Pagination";

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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER DAN SEARCH */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
        <Header />
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          onOpenTambah={() => setIsTambahOpen(true)} 
        />
      </div>

      {/* TABLE DATA */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-gray-500 font-bold">
          Mengambil data dokter...
        </div>
      ) : (
        <Tabel
          data={dataDokter}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          startIndex={startIndex || 1}
        />
      )}

      <Pagination />

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

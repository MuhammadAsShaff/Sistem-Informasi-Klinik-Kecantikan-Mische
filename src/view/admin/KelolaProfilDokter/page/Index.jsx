import React from "react";
import Header from "./Header";
import SearchBar from '@/components/SearchBar';
import { Plus } from "lucide-react";
import Tabel from "./Tabel";
import ModalTambahDokter from "./ModalTambahDokter";
import ModalPerbaruiDokter from "./ModalPerbaruiDokter";
import ModalHapusDokter from "./ModalHapusDokter";
import ToastAlert from "@/view/components/ToastAlert/page/Index";
import Pagination from '@/components/Pagination';
import { useKelolaProfilDokter } from "../hooks/useKelolaProfilDokter";

export default function KelolaProfilDokter() {
  const {
    isTambahOpen,
    setIsTambahOpen,
    isEditOpen,
    setIsEditOpen,
    isHapusOpen,
    setIsHapusOpen,
    toast,
    setToast,
    searchQuery,
    setSearchQuery,
    isLoading,
    tambahDokter,
    editDokter,
    confirmDelete,
    handleEdit,
    handleDelete,
    handleStatusChange,
    currentPage,
    setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    paginatedDokter
  } = useKelolaProfilDokter();

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

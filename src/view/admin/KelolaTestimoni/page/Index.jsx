import React from "react";
import Tabel from "./Tabel";
import ModalTambah from "./ModalTambah";
import ModalEdit from "./ModalEdit";
import ModalHapus from "./ModalHapus";
import Pagination from '@/components/Pagination';
import ToastAlert from "@/view/components/ToastAlert/page/Index";
import { useKelolaTestimoni } from "../hooks/useKelolaTestimoni";

export default function KelolaTestimoni() {
  const {
    isTambahOpen,
    setIsTambahOpen,
    isEditOpen,
    setIsEditOpen,
    isHapusOpen,
    setIsHapusOpen,
    selectedData,
    toast,
    setToast,
    showToast,
    searchTerm,
    setSearchTerm,
    isLoading,
    refetch,
    currentPage,
    setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    paginatedTestimoni,
    handleEdit,
    handleDelete
  } = useKelolaTestimoni();

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen animate-in fade-in duration-700">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6 font-poppins">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-2 gap-4">
          <div>
            <h1 className="text-3xl font-medium text-black tracking-tight mb-2">Testimoni Customer</h1>
            <p className="text-gray-800 text-[11px] max-w-3xl">
              Halaman ini menampilkan dan mengelola Testimoni Customer yang tersedia di klinik.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="flex items-center">
              <input 
                type="text"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#f3f4f6] text-sm px-4 py-2 outline-none w-48 lg:w-64 border border-transparent focus:border-gray-300"
              />
              <button className="bg-[#56BC36] hover:bg-[#469e2c] p-2 transition-colors text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </div>

            {/* Tambah Button */}
            <button 
              onClick={() => setIsTambahOpen(true)}
              className="bg-[#56BC36] hover:bg-[#469e2c] text-white text-sm py-2 px-3 shadow-sm hover:shadow transition-all flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
        </div>

        <div>
          <Tabel
            isLoading={isLoading}
            data={paginatedTestimoni}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />

          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>

        <ModalTambah
          isOpen={isTambahOpen}
          onClose={() => setIsTambahOpen(false)}
          refetch={refetch}
          showToast={showToast}
        />

        <ModalEdit
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          data={selectedData}
          refetch={refetch}
          showToast={showToast}
        />

        <ModalHapus
          isOpen={isHapusOpen}
          onClose={() => setIsHapusOpen(false)}
          data={selectedData}
          refetch={refetch}
          showToast={showToast}
        />

        <ToastAlert
          isOpen={toast.isOpen}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, isOpen: false })}
        />
      </div>
    </div>
  );
}

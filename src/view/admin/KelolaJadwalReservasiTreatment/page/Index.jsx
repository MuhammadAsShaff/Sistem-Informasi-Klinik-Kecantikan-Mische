import React from "react";
import Header from "./Header";
import SearchBar from '@/components/SearchBar';
import { Plus } from "lucide-react";
import Tabel from "./Tabel";
import Pagination from '@/components/Pagination';
import ModalTambahJadwal from "./ModalTambahJadwal";
import ModalPerbaruiJadwal from "./ModalPerbaruiJadwal";
import ModalHapusJadwal from "./ModalHapusJadwal";
import ToastAlert from "@/view/components/ToastAlert/page/Index";
import { useKelolaJadwal } from "../hooks/useKelolaJadwal";

export default function KelolaJadwalReservasiTreatment() {
  const {
    isLoading,
    paginatedJadwal,
    currentPage,
    setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    isTambahOpen,
    setIsTambahOpen,
    isEditOpen,
    setIsEditOpen,
    isHapusOpen,
    setIsHapusOpen,
    toast,
    setToast,
    tambahJadwal,
    editJadwal,
    hapusJadwal,
    handleEdit,
    handleDelete
  } = useKelolaJadwal();

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen animate-in fade-in duration-700">
      {toast && toast.isOpen && (
        <ToastAlert
          isOpen={toast.isOpen}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, isOpen: false })}
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

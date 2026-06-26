import React from "react";
import Header from "./Header";
import SearchBar from '@/components/SearchBar';
import { Plus } from "lucide-react";
import Tabel from "./Tabel";
import Pagination from '@/components/Pagination';
import ModalTambahUser from "./ModalTambahUser";
import ModalPerbaruiUser from "./ModalPerbaruiUser";
import ModalHapusUser from "./ModalHapusUser";
import ModalDetailUser from "./ModalDetailUser";
import ToastAlert from "@/view/components/ToastAlert/page/Index";
import { useKelolaUser } from "../hooks/useKelolaUser";

export default function KelolaUser() {
  const {
    selectedUser,
    isTambahOpen,
    setIsTambahOpen,
    isEditOpen,
    setIsEditOpen,
    isHapusOpen,
    setIsHapusOpen,
    isDetailOpen,
    setIsDetailOpen,
    toast,
    setToast,
    dataUser,
    isLoading,
    currentPage,
    lastPage,
    startIndex,
    handlePageChange,
    tambahUser,
    editUser,
    confirmDelete,
    handleEdit,
    handleDetail,
    handleDelete
  } = useKelolaUser();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER DAN SEARCH */}
      <div className="flex flex-col gap-2">
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
      </div>

      {/* TABLE DATA */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-gray-500 font-bold">
          Mengambil data dari server...
        </div>
      ) : (
        <Tabel isLoading={isLoading} 
          data={dataUser} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onDetail={handleDetail}
          startIndex={startIndex}
        />
      )}

      {/* COMPONENT PAGINATION */}
      {dataUser.length > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={lastPage} 
          onPageChange={handlePageChange} 
        />
      )}

      {/* MODALS */}
      <ModalTambahUser 
        isOpen={isTambahOpen} 
        onClose={() => setIsTambahOpen(false)} 
        hook={tambahUser}
      />
      
      <ModalDetailUser
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        user={selectedUser}
      />

      <ModalPerbaruiUser 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        hook={editUser}
      />

      <ModalHapusUser
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

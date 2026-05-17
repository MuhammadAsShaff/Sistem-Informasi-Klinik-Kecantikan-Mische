import React from "react";
import { useKelolaUser } from "../hooks/useKelolaUser";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Tabel from "./Tabel";
import Pagination from "./Pagination";
import ModalTambahUser from "./ModalTambahUser";
import ModalPerbaruiUser from "./ModalPerbaruiUser";
import ModalHapusUser from "./ModalHapusUser";
import ToastAlert from "@/view/components/ToastAlert";

export default function KelolaUser() {
  const {
    dataUser,
    selectedUser,
    isLoading,
    currentPage,
    lastPage,
    startIndex,
    isTambahOpen,
    setIsTambahOpen,
    isEditOpen,
    setIsEditOpen,
    isHapusOpen,
    setIsHapusOpen,
    toast,
    setToast,
    handlePageChange,
    handleTambahSubmit,
    handleEditSubmit,
    confirmDelete,
    handleEdit,
    handleDelete
  } = useKelolaUser();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER DAN SEARCH */}
      <div className="flex flex-col gap-2">
        <Header />
        <SearchBar onOpenTambah={() => setIsTambahOpen(true)} />
      </div>

      {/* TABLE DATA */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-gray-500 font-bold">
          Mengambil data dari server...
        </div>
      ) : (
        <Tabel 
          data={dataUser} 
          startIndex={startIndex}
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}

      {/* PAGINATION */}
      <Pagination 
        currentPage={currentPage} 
        lastPage={lastPage} 
        onPageChange={handlePageChange} 
      />

      {/* MODALS */}
      <ModalTambahUser 
        isOpen={isTambahOpen} 
        onClose={() => setIsTambahOpen(false)} 
        onSubmit={handleTambahSubmit}
      />
      
      <ModalPerbaruiUser 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        userData={selectedUser}
        onSubmit={handleEditSubmit}
      />

      <ModalHapusUser 
        isOpen={isHapusOpen} 
        onClose={() => setIsHapusOpen(false)} 
        onConfirm={confirmDelete}
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

import React, { useState } from "react";
import { useFetchUser } from "../hooks/useFetchUser";
import { useTambahUser } from "../hooks/useTambahUser";
import { useEditUser } from "../hooks/useEditUser";
import { useHapusUser } from "../hooks/useHapusUser";

import Header from "./Header";
import SearchBar from "./SearchBar";
import Tabel from "./Tabel";
import Pagination from "./Pagination";
import ModalTambahUser from "./ModalTambahUser";
import ModalPerbaruiUser from "./ModalPerbaruiUser";
import ModalHapusUser from "./ModalHapusUser";
import ToastAlert from "@/view/components/ToastAlert";

export default function KelolaUser() {
  // State seleksi user (untuk edit & hapus)
  const [selectedUser, setSelectedUser] = useState(null);

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
  const {
    dataUser,
    isLoading,
    currentPage,
    lastPage,
    startIndex,
    fetchUsers,
    setCurrentPage,
    handlePageChange,
  } = useFetchUser();

  // ─── HOOK: CREATE ─────────────────────────────────────────────
  const tambahUser = useTambahUser(
    () => { setIsTambahOpen(false); fetchUsers(currentPage); },
    showToast
  );

  // ─── HOOK: UPDATE ─────────────────────────────────────────────
  const editUser = useEditUser(
    selectedUser,
    () => { setIsEditOpen(false); fetchUsers(currentPage); },
    showToast
  );

  // ─── HOOK: DELETE ─────────────────────────────────────────────
  const { confirmDelete } = useHapusUser(
    selectedUser,
    currentPage,
    dataUser.length,
    fetchUsers,
    setCurrentPage,
    showToast
  );

  // Handler buka modal edit
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  // Handler buka modal hapus
  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsHapusOpen(true);
  };

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
        hook={tambahUser}
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

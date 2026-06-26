import { useState } from "react";
import { useFetchUser } from "./useFetchUser";
import { useTambahUser } from "./useTambahUser";
import { useEditUser } from "./useEditUser";
import { useHapusUser } from "./useHapusUser";

export const useKelolaUser = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

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

  const tambahUser = useTambahUser(
    () => { setIsTambahOpen(false); fetchUsers(currentPage); },
    showToast
  );

  const editUser = useEditUser(
    selectedUser,
    () => { setIsEditOpen(false); fetchUsers(currentPage); },
    showToast
  );

  const { confirmDelete } = useHapusUser(
    selectedUser,
    currentPage,
    dataUser.length,
    fetchUsers,
    setCurrentPage,
    showToast
  );

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDetail = (user) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsHapusOpen(true);
  };

  return {
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
    showToast,
    dataUser,
    isLoading,
    currentPage,
    lastPage,
    startIndex,
    fetchUsers,
    setCurrentPage,
    handlePageChange,
    tambahUser,
    editUser,
    confirmDelete,
    handleEdit,
    handleDetail,
    handleDelete
  };
};

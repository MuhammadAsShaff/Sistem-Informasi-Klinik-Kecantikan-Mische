import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export function useKelolaUser() {
  const [dataUser, setDataUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);

  // State untuk Modal
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);

  // State untuk Toast Alert
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ isOpen: true, message, type });
  };

  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(`${endpoints.admin.users}?page=${page}`);
      
      if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
        setDataUser(response.data.data.data);
        setCurrentPage(response.data.data.current_page || 1);
        setLastPage(response.data.data.last_page || 1);
        setStartIndex(response.data.data.from || 1);
      } else if (response.data && Array.isArray(response.data.data)) {
        setDataUser(response.data.data);
      } else if (Array.isArray(response.data)) {
        setDataUser(response.data);
      } else {
        setDataUser([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const handleTambahSubmit = async (formData) => {
    try {
      await axiosClient.post(endpoints.admin.users, formData);
      showToast("User berhasil ditambahkan!");
      setIsTambahOpen(false);
      fetchUsers(currentPage);
    } catch (error) {
      console.error("Gagal menambah user:", error);
      let errorMessage = "Gagal menambahkan user. Silakan coba lagi.";
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, "error");
    }
  };

  const handleEditSubmit = async (formData) => {
    if (!selectedUser) return;
    try {
      const idUser = selectedUser.idUser || selectedUser.id;
      await axiosClient.put(`${endpoints.admin.users}/${idUser}`, formData);
      showToast("Data user berhasil diperbarui!");
      setIsEditOpen(false);
      fetchUsers(currentPage);
    } catch (error) {
      console.error("Gagal memperbarui user:", error);
      let errorMessage = "Gagal memperbarui data user.";
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, "error");
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      const idUser = selectedUser.idUser || selectedUser.id;
      await axiosClient.delete(`${endpoints.admin.users}/${idUser}`);
      showToast("User berhasil dihapus!");
      setIsHapusOpen(false);
      
      if (dataUser.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchUsers(currentPage);
      }
    } catch (error) {
      console.error("Gagal menghapus user:", error);
      let errorMessage = "Terjadi kesalahan saat menghapus user.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, "error");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsHapusOpen(true);
  };

  return {
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
  };
}

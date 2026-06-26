import { useState, useEffect } from "react";
import { useFetchDokter } from "./useFetchDokter";
import { useTambahDokter } from "./useTambahDokter";
import { useEditDokter } from "./useEditDokter";
import { useHapusDokter } from "./useHapusDokter";

export const useKelolaProfilDokter = () => {
  const [selectedDokter, setSelectedDokter] = useState(null);
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  const {
    dataDokter,
    searchQuery,
    setSearchQuery,
    isLoading,
    fetchDokter,
  } = useFetchDokter();

  const tambahDokter = useTambahDokter(
    () => { 
      setIsTambahOpen(false); 
      fetchDokter(); 
    },
    showToast
  );

  const editDokter = useEditDokter(
    selectedDokter,
    () => { 
      setIsEditOpen(false); 
      fetchDokter(); 
    },
    showToast
  );

  const { confirmDelete, updateStatusDokter } = useHapusDokter(
    selectedDokter,
    () => { 
      fetchDokter(); 
    },
    showToast
  );

  const handleEdit = (dokter) => {
    setSelectedDokter(dokter);
    setIsEditOpen(true);
  };

  const handleDelete = (dokter) => {
    setSelectedDokter(dokter);
    setIsHapusOpen(true);
  };

  const handleStatusChange = (id, newStatus) => {
    updateStatusDokter(id, newStatus);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(dataDokter.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedDokter = dataDokter.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
    selectedDokter,
    setSelectedDokter,
    isTambahOpen,
    setIsTambahOpen,
    isEditOpen,
    setIsEditOpen,
    isHapusOpen,
    setIsHapusOpen,
    toast,
    setToast,
    showToast,
    dataDokter,
    searchQuery,
    setSearchQuery,
    isLoading,
    tambahDokter,
    editDokter,
    confirmDelete,
    updateStatusDokter,
    handleEdit,
    handleDelete,
    handleStatusChange,
    currentPage,
    setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    paginatedDokter
  };
};

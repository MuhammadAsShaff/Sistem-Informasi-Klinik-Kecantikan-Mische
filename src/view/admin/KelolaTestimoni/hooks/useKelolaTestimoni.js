import { useState, useEffect } from "react";
import { useFetchTestimoni } from "./useFetchTestimoni";

export const useKelolaTestimoni = () => {
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  
  const [selectedData, setSelectedData] = useState(null);
  
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const { testimoni, isLoading, refetch } = useFetchTestimoni();

  const filteredTestimoni = testimoni.filter(item => 
    (item.namaTester?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.deskripsi?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.jenisTestimoni?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredTestimoni.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginatedTestimoni = filteredTestimoni.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (item) => {
    setSelectedData(item);
    setIsEditOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedData(item);
    setIsHapusOpen(true);
  };

  return {
    isTambahOpen,
    setIsTambahOpen,
    isEditOpen,
    setIsEditOpen,
    isHapusOpen,
    setIsHapusOpen,
    selectedData,
    setSelectedData,
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
  };
};

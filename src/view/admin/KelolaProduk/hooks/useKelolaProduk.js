import { useState, useEffect } from 'react';
import { useFetchProduk } from './useFetchProduk';
import { useUpdateStok } from './useUpdateStok';

export const useKelolaProduk = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDetailCategory, setSelectedDetailCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { products, refetch, updateLocalStock, isLoading } = useFetchProduk();
  const { updateStok } = useUpdateStok(updateLocalStock);

  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  const filteredCategories = products.filter(product =>
    (product.nama?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (product.deskripsi?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (product.kategori?.nama?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDetailClick = (category) => {
    setSelectedDetailCategory(category);
    setIsDetailModalOpen(true);
  };

  return {
    isLoading,
    refetch,
    updateStok,
    searchQuery,
    setSearchQuery,
    paginatedCategories,
    currentPage,
    setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    isModalOpen,
    setIsModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    deleteId,
    selectedCategory,
    selectedDetailCategory,
    toast,
    setToast,
    showToast,
    handleDeleteClick,
    handleEditClick,
    handleDetailClick
  };
};

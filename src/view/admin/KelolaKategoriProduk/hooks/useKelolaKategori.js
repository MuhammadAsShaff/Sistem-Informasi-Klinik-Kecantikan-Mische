import { useState, useEffect } from 'react';
import { useFetchKategori } from './useFetchKategori';

export const useKelolaKategori = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { categories, refetch, isLoading } = useFetchKategori();

  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ isOpen: true, message, type });
  };

  const filteredCategories = categories.filter(category =>
    (category.nama?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (category.deskripsi?.toLowerCase() || '').includes(searchQuery.toLowerCase())
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

  return {
    isLoading,
    refetch,
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
    deleteId,
    selectedCategory,
    toast,
    setToast,
    showToast,
    handleDeleteClick,
    handleEditClick
  };
};

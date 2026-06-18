import React, { useState } from 'react';
import HeaderSection from './HeaderSection';
import SearchBar from '../../components/SearchBar';
import { ChevronDown, Plus } from 'lucide-react';
import TableSection from './TableSection';
import { useFetchKategori } from '../hooks/useFetchKategori';
import ModalTambahKategori from './ModalTambahKategori';
import ModalPerbaruiKategori from './ModalPerbaruiKategori';
import ModalHapusKategori from './ModalHapusKategori';
import Pagination from '../../components/Pagination';
import ToastAlert from '@/view/components/ToastAlert';

const KelolaKategoriProduk = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { categories, refetch, isLoading } = useFetchKategori();

  const filteredCategories = categories.filter(category =>
    (category.nama?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (category.deskripsi?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ isOpen: true, message, type });
  };

  return (
    <div className="p-8 font-sans w-full bg-[#f8f9fa] min-h-screen relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      <HeaderSection />
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
        rightComponents={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={20} />
          </button>
        }
      />
      <TableSection isLoading={isLoading} 
        categories={paginatedCategories} 
        onDeleteClick={(id) => {
          setDeleteId(id);
          setIsDeleteModalOpen(true);
        }} 
        onEditClick={(category) => {
          setSelectedCategory(category);
          setIsEditModalOpen(true);
        }}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />
      
      <ModalTambahKategori 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        refetch={refetch}
        showToast={showToast}
      />

      {/* Modal Perbarui */}
      <ModalPerbaruiKategori 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        categoryData={selectedCategory}
        refetch={refetch}
        showToast={showToast}
      />

      {/* Modal Hapus */}
      <ModalHapusKategori 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        dataId={deleteId}
        refetch={refetch}
        showToast={showToast}
      />

      <ToastAlert 
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
};

export default KelolaKategoriProduk;

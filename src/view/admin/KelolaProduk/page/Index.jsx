import React, { useState } from 'react';
import HeaderSection from './HeaderSection';
import SearchBar from '@/components/SearchBar';
import { ChevronDown, Plus } from 'lucide-react';
import TableSection from './TableSection';
import { useFetchProduk } from '../hooks/useFetchProduk';
import { useUpdateStok } from '../hooks/useUpdateStok';
import ModalTambahProduk from './ModalTambahProduk';
import ModalPerbaruiProduk from './ModalPerbaruiProduk';
import ModalHapusProduk from './ModalHapusProduk';
import ModalDetailProduk from './ModalDetailProduk';
import Pagination from '@/components/Pagination';
import ToastAlert from '@/view/components/ToastAlert';

const KelolaProduk = () => {
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

  const filteredCategories = products.filter(product =>
    (product.nama?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (product.deskripsi?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (product.kategori?.nama?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
        onDetailClick={(category) => {
          setSelectedDetailCategory(category);
          setIsDetailModalOpen(true);
        }}
        onUpdateStock={updateStok}
        showToast={showToast}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />
      
      <ModalTambahProduk 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        refetch={refetch}
        showToast={showToast}
      />

      <ModalPerbaruiProduk 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        categoryData={selectedCategory}
        refetch={refetch}
        showToast={showToast}
      />

      <ModalHapusProduk 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        dataId={deleteId}
        refetch={refetch}
        showToast={showToast}
      />
      
      <ModalDetailProduk
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedDetailCategory}
      />

      {toast && toast.isOpen && (
        <ToastAlert
          isOpen={toast.isOpen}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, isOpen: false })}
        />
      )}
    </div>
  );
};

export default KelolaProduk;

import React from 'react';
import HeaderSection from './HeaderSection';
import SearchBar from '@/components/SearchBar';
import { Plus } from 'lucide-react';
import TableSection from './TableSection';
import ModalTambahProduk from './ModalTambahProduk';
import ModalPerbaruiProduk from './ModalPerbaruiProduk';
import ModalHapusProduk from './ModalHapusProduk';
import ModalDetailProduk from './ModalDetailProduk';
import Pagination from '@/components/Pagination';
import ToastAlert from '@/view/components/ToastAlert/page/Index';
import { useKelolaProduk } from '../hooks/useKelolaProduk';

const KelolaProduk = () => {
  const {
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
  } = useKelolaProduk();

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
        onDeleteClick={handleDeleteClick} 
        onEditClick={handleEditClick}
        onDetailClick={handleDetailClick}
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

      <ToastAlert
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
};

export default KelolaProduk;

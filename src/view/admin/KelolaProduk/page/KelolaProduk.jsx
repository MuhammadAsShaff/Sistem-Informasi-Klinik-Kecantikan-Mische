import React, { useState } from 'react';
import HeaderSection from './HeaderSection';
import ActionSection from './ActionSection';
import TableSection from './TableSection';
import { useFetchProduk } from '../hooks/useFetchProduk';
import { useUpdateStok } from '../hooks/useUpdateStok';
import ModalTambahProduk from './ModalTambahProduk';
import ModalPerbaruiProduk from './ModalPerbaruiProduk';
import ModalHapusProduk from './ModalHapusProduk';
import Pagination from '../../components/Pagination';
import ToastAlert from '@/view/components/ToastAlert';

const KelolaProduk = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { products, refetch, updateLocalStock } = useFetchProduk();
  const { updateStok } = useUpdateStok(updateLocalStock);

  const filteredCategories = products.filter(product =>
    product.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.kategori?.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  return (
    <div className="p-8 font-sans w-full bg-[#f8f9fa] min-h-screen relative">
      <HeaderSection />
      <ActionSection 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onAddClick={() => setIsModalOpen(true)}
      />
      <TableSection 
        categories={filteredCategories} 
        onDeleteClick={(id) => {
          setDeleteId(id);
          setIsDeleteModalOpen(true);
        }} 
        onEditClick={(category) => {
          setSelectedCategory(category);
          setIsEditModalOpen(true);
        }}
        onUpdateStock={updateStok}
        showToast={showToast}
      />
      
      <Pagination />
      
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

      {/* Toast Notification */}
      {toast && (
        <ToastAlert
          isOpen={true}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default KelolaProduk;

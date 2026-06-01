import React, { useState } from 'react';
import HeaderSection from './HeaderSection';
import ActionSection from './ActionSection';
import TableSection from './TableSection';
import { useKategoriProduk } from '../hooks/useKategoriProduk';
import ModalTambahKategori from './ModalTambahKategori';
import ModalPerbaruiKategori from './ModalPerbaruiKategori';
import ModalHapusKategori from './ModalHapusKategori';

const KelolaKategoriProduk = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { searchQuery, setSearchQuery, filteredCategories, handleDelete, handleEdit, handleAdd } = useKategoriProduk();

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
      />
      
      {/* Modal Tambah */}
      <ModalTambahKategori 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={(newData) => {
          handleAdd(newData);
          setIsModalOpen(false);
        }}
      />

      {/* Modal Perbarui */}
      <ModalPerbaruiKategori 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        categoryData={selectedCategory}
        onSave={(id, updatedData) => {
          handleEdit(id, updatedData);
          setIsEditModalOpen(false);
        }}
      />

      {/* Modal Hapus */}
      <ModalHapusKategori 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          handleDelete(deleteId);
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
};

export default KelolaKategoriProduk;

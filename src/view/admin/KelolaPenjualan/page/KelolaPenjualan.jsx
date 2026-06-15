import React, { useState } from 'react';
import HeaderSection from './HeaderSection';
import ModalHapus from './ModalHapus';
import ModalExportExcel from './ModalExportExcel';
import ActionSection from './ActionSection';
import TableSection from './TableSection';
import Pagination from '../../components/Pagination';
import { useKelolaPenjualan } from '../hooks/useKelolaPenjualan';

const KelolaPenjualan = () => {
  const {
    searchQuery,
    setSearchQuery,
    filterProduk,
    setFilterProduk,
    filteredPenjualan
  } = useKelolaPenjualan();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredPenjualan.length / ITEMS_PER_PAGE);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterProduk]);

  const paginatedPenjualan = filteredPenjualan.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDeleteClick = () => setIsDeleteModalOpen(true);
  const handleExportClick = () => setIsExportModalOpen(true);

  const handleConfirmDelete = () => {
    // Implementasi delete data
    setIsDeleteModalOpen(false);
  };

  const handleConfirmExport = () => {
    // Implementasi export excel
    setIsExportModalOpen(false);
  };

  return (
    <div className="p-8 font-sans w-full bg-[#f8f9fa] min-h-screen relative">
      <HeaderSection />
      <ActionSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterProduk={filterProduk}
        setFilterProduk={setFilterProduk}
        onExportClick={handleExportClick}
      />
      <TableSection 
        data={paginatedPenjualan} 
        onDeleteClick={handleDeleteClick}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />

      <ModalHapus 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onDelete={handleConfirmDelete} 
      />
      
      <ModalExportExcel 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        onExport={handleConfirmExport} 
      />
    </div>
  );
};

export default KelolaPenjualan;

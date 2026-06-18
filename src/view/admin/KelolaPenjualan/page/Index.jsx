import React, { useState } from 'react';
import HeaderSection from './HeaderSection';
import ModalHapus from './ModalHapus';
import ModalExportExcel from './ModalExportExcel';
import ModalDetailPenjualan from './ModalDetailPenjualan';
import ModalResi from './ModalResi';
import SearchBar from '../../components/SearchBar';
import { ChevronDown, FileSpreadsheet } from 'lucide-react';
import TableSection from './TableSection';
import Pagination from '../../components/Pagination';
import { useKelolaPenjualan } from '../hooks/useKelolaPenjualan';

import ToastAlert from '@/view/components/ToastAlert';

const KelolaPenjualan = () => {
  const {
    searchQuery,
    setSearchQuery,
    filterProduk,
    setFilterProduk,
    activeTab,
    setActiveTab,
    filteredPenjualan,
    isLoading,
    error,
    updateStatus,
    inputResi,
    hapusPenjualan,
    exportExcelPenjualan
  } = useKelolaPenjualan();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isResiModalOpen, setIsResiModalOpen] = useState(false);
  
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToDetail, setItemToDetail] = useState(null);
  const [itemToResi, setItemToResi] = useState(null);
  
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);

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

  const displayToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDetailClick = (item) => {
    setItemToDetail(item);
    setIsDetailModalOpen(true);
  };

  const handleResiClick = (item) => {
    setItemToResi(item);
    setIsResiModalOpen(true);
  };

  const handleExportClick = () => setIsExportModalOpen(true);

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      const res = await hapusPenjualan(itemToDelete);
      if (res.success) {
        displayToast(res.message, "success");
      } else {
        displayToast(res.message, "error");
      }
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleConfirmExport = async (filters) => {
    const res = await exportExcelPenjualan(filters);
    if (res.success) {
      displayToast('Laporan berhasil diunduh', "success");
      setIsExportModalOpen(false);
    } else {
      displayToast(res.message || 'Gagal mengunduh laporan', "error");
    }
  };

  const handleStatusChange = async (idPenjualan, newStatus) => {
    const res = await updateStatus(idPenjualan, newStatus);
    if (res.success) {
      displayToast(res.message, "success");
    } else {
      displayToast(res.message, "error");
    }
  };

  const handleConfirmResi = async (idPenjualan, nomorResi) => {
    const res = await inputResi(idPenjualan, nomorResi);
    if (res.success) {
      displayToast(res.message, "success");
      setIsResiModalOpen(false);
      setItemToResi(null);
    } else {
      displayToast(res.message, "error");
    }
  };

  return (
    <div className="p-8 font-sans w-full bg-[#f8f9fa] min-h-screen relative">
      <ToastAlert 
        isOpen={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />

      <HeaderSection />
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-lg">
          {error}
        </div>
      )}

        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        rightComponents={
          <button 
            onClick={handleExportClick}
            className="bg-[#56BC36] text-white p-2.5 px-4 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm flex items-center justify-center gap-2 text-sm font-medium"
          >
            <FileSpreadsheet size={20} /> Excel
          </button>
        }
      />

      {/* Tabs Section */}
      <div className="flex border-b border-gray-200 mb-6">
        {['Semua', 'pending', 'diproses', 'dikirim', 'selesai', 'dibatalkan'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-[#56BC36] text-[#56BC36]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab === 'Semua' ? 'Semua' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <TableSection 
        data={paginatedPenjualan} 
        onDeleteClick={handleDeleteClick}
        onDetailClick={handleDetailClick}
        onResiClick={handleResiClick}
        onStatusChange={handleStatusChange}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        isLoading={isLoading}
      />
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />

      <ModalHapus 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }} 
        onDelete={handleConfirmDelete} 
      />
      
      <ModalExportExcel 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        onExport={handleConfirmExport} 
      />

      <ModalDetailPenjualan
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setItemToDetail(null);
        }}
        data={itemToDetail}
      />

      <ModalResi
        isOpen={isResiModalOpen}
        onClose={() => {
          setIsResiModalOpen(false);
          setItemToResi(null);
        }}
        data={itemToResi}
        onSave={handleConfirmResi}
      />
    </div>
  );
};

export default KelolaPenjualan;

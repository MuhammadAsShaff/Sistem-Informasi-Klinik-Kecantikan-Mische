import React from 'react';
import HeaderSection from './HeaderSection';
import ModalHapus from './ModalHapus';
import ModalExportExcel from './ModalExportExcel';
import ModalDetailPenjualan from './ModalDetailPenjualan';
import ModalResi from './ModalResi';
import SearchBar from '@/components/SearchBar';
import { FileSpreadsheet } from 'lucide-react';
import TableSection from './TableSection';
import Pagination from '@/components/Pagination';
import { useKelolaPenjualan } from '../hooks/useKelolaPenjualan';
import ToastAlert from '@/view/components/ToastAlert/page/Index';

/**
 * =========================================================================
 * BALAI AULA KENDALI DATA PENJUALAN (Index)
 * =========================================================================
 * Ibarat ruangan balai pengawasan luas tempat memantau seluruh uang masuk dan paket keluar.
 * Di dalam ruangan megah ini terpasang papan panji judul (HeaderSection), meja kaca pembesar
 * untuk menyaring pesanan (SearchBar), rak arsip catatan transaksi (TableSection), serta
 * deretan ruang rapat tertutup (ModalResi, ModalDetailPenjualan, ModalExportExcel) yang siap
 * dibuka kapan saja atas arahan Mandor Kepala Pencatat (useKelolaPenjualan).
 */
const KelolaPenjualan = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    isLoading,
    error,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isExportModalOpen,
    setIsExportModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isResiModalOpen,
    setIsResiModalOpen,
    itemToDetail,
    setItemToDetail,
    itemToResi,
    setItemToResi,
    setItemToDelete,
    toastMessage,
    toastType,
    showToast,
    setShowToast,
    currentPage,
    setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    paginatedPenjualan,
    handleDeleteClick,
    handleDetailClick,
    handleResiClick,
    handleExportClick,
    handleConfirmDelete,
    handleConfirmExport,
    handleStatusChange,
    handleConfirmResi
  } = useKelolaPenjualan();

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
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto custom-scrollbar">
        {['Semua', 'Sudah Bayar', 'Belum Bayar', 'pending', 'diproses', 'dikirim', 'selesai', 'dibatalkan'].map((tab) => (
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

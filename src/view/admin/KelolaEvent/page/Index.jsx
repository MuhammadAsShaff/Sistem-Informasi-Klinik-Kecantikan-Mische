import React from 'react';
import Header from './Header';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import { Plus } from 'lucide-react';
import Tabel from './Tabel';
import ModalTambahEvent from './ModalTambahEvent';
import ModalPerbaruiEvent from './ModalPerbaruiEvent';
import ModalHapusEvent from './ModalHapusEvent';
import ModalDetailEvent from './ModalDetailEvent';
import ModalDistribusiEvent from './ModalDistribusiEvent';
import ToastAlert from '@/view/components/ToastAlert/page/Index';
import { useKelolaEvent } from '../hooks/useKelolaEvent';

export default function KelolaEvent() {
  const {
    isLoading,
    refetch,
    searchQuery,
    setSearchQuery,
    paginatedEvents,
    currentPage,
    setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    isTambahOpen,
    setIsTambahOpen,
    isEditOpen,
    setIsEditOpen,
    isHapusOpen,
    setIsHapusOpen,
    isDetailOpen,
    setIsDetailOpen,
    isDistribusiOpen,
    setIsDistribusiOpen,
    selectedEvent,
    setSelectedEvent,
    toast,
    setToast,
    showToast,
    handleView,
    handleEdit,
    handleDelete,
    handleSend
  } = useKelolaEvent();

  return (
    <div className="min-h-screen bg-[#F4F7F6] p-4 md:p-8 ml-0 lg:ml-64 pt-24 lg:pt-8 transition-all duration-300">
      
      {/* Main Container */}
      <div className="max-w-6xl mx-auto">
        <Header />
        
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          rightComponents={
            <button 
              onClick={() => setIsTambahOpen(true)}
              className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={20} />
            </button>
          }
        />
        
        <Tabel isLoading={isLoading} 
          events={paginatedEvents} 
          onView={handleView}
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onSend={handleSend}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
        />
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>

      {/* Modals */}
      <ModalTambahEvent 
        isOpen={isTambahOpen} 
        onClose={() => setIsTambahOpen(false)} 
        refetch={refetch}
        showToast={showToast}
      />
      
      <ModalPerbaruiEvent 
        isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false);
          setSelectedEvent(null);
        }} 
        refetch={refetch}
        showToast={showToast}
        event={selectedEvent}
      />
      
      <ModalHapusEvent 
        isOpen={isHapusOpen} 
        onClose={() => {
          setIsHapusOpen(false);
          setSelectedEvent(null);
        }} 
        refetch={refetch}
        showToast={showToast}
        event={selectedEvent}
      />
      
      <ModalDetailEvent 
        isOpen={isDetailOpen} 
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedEvent(null);
        }} 
        event={selectedEvent}
      />

      <ModalDistribusiEvent
        isOpen={isDistribusiOpen}
        onClose={() => {
          setIsDistribusiOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        showToast={showToast}
      />

      {/* Toast Notification */}
      <ToastAlert
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
}

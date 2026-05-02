import React, { useState } from 'react';
import Header from './Header';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import { ChevronDown, Plus } from 'lucide-react';
import Tabel from './Tabel';
import ModalTambahEvent from './ModalTambahEvent';
import ModalPerbaruiEvent from './ModalPerbaruiEvent';
import ModalHapusEvent from './ModalHapusEvent';
import ModalDetailEvent from './ModalDetailEvent';
import ModalDistribusiEvent from './ModalDistribusiEvent';
import ToastAlert from '@/view/components/ToastAlert';
import { useFetchEvent } from '../hooks/useFetchEvent';

export default function KelolaEvent() {
  const { events, refetch, isLoading } = useFetchEvent();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDistribusiOpen, setIsDistribusiOpen] = useState(false);
  
  // Selected Event
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Filter Data
  const filteredEvents = events.filter(event => 
    (event.nama?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (event.lokasi?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (event.deskripsi?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleView = (event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsEditOpen(true);
  };

  const handleDelete = (event) => {
    setSelectedEvent(event);
    setIsHapusOpen(true);
  };

  const handleSend = (event) => {
    setSelectedEvent(event);
    setIsDistribusiOpen(true);
  };

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
}

import React, { useState } from 'react';
import Header from './page/Header';
import SearchBar from './page/SearchBar';
import Tabel from './page/Tabel';
import Pagination from './page/Pagination';
import ModalTambahEvent from './page/ModalTambahEvent';
import ModalPerbaruiEvent from './page/ModalPerbaruiEvent';
import ModalHapusEvent from './page/ModalHapusEvent';
import ModalDetailEvent from './page/ModalDetailEvent';
import ModalDistribusiEvent from './page/ModalDistribusiEvent';
import ToastAlert from '@/view/components/ToastAlert';
import { useFetchEvent } from './hooks/useFetchEvent';

export default function KelolaEvent() {
  const { events, refetch } = useFetchEvent();
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
    event.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
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
          onAdd={() => setIsTambahOpen(true)} 
        />
        
        <Tabel 
          events={filteredEvents} 
          onView={handleView}
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onSend={handleSend}
        />
        
        <Pagination />
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
}

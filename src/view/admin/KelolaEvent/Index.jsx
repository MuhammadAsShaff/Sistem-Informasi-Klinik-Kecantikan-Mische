import React, { useState } from 'react';
import Header from './page/Header';
import SearchBar from './page/SearchBar';
import Tabel from './page/Tabel';
import Pagination from './page/Pagination';
import ModalTambahEvent from './page/ModalTambahEvent';
import ModalPerbaruiEvent from './page/ModalPerbaruiEvent';
import ModalHapusEvent from './page/ModalHapusEvent';
import ModalDetailEvent from './page/ModalDetailEvent';
import { useFetchEvent } from './hooks/useFetchEvent';

export default function KelolaEvent() {
  const { events, refetch } = useFetchEvent();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Selected Event
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
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
    // Implement push notification or email logic here if needed
    showToast(`Notifikasi untuk event "${event.nama}" dikirim!`);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] p-4 md:p-8 ml-0 lg:ml-64 pt-24 lg:pt-8 transition-all duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-8 z-50 bg-white border-l-4 border-[#56BC36] shadow-lg px-6 py-4 rounded-lg flex items-center gap-3 animate-fade-in">
          <div className="bg-[#56BC36] rounded-full p-1 text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <p className="text-gray-800 font-medium text-sm">{toastMessage}</p>
        </div>
      )}

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

    </div>
  );
}

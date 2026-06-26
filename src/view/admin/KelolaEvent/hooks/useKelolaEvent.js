import { useState, useEffect } from 'react';
import { useFetchEvent } from './useFetchEvent';

export const useKelolaEvent = () => {
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
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
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

  useEffect(() => {
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

  return {
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
  };
};

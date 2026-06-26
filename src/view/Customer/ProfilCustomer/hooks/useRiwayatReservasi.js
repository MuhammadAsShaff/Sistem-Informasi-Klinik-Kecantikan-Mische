import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchMyReservasi } from '../../ReservasiPage/hooks/useFetchMyReservasi';

export const useRiwayatReservasi = () => {
  const navigate = useNavigate();
  const { myReservasi, isLoading } = useFetchMyReservasi();
  const [selectedReservasi, setSelectedReservasi] = useState(null);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Selesai': 
      case 'Dikonfirmasi': 
      case 'Konfirmasi':
      case 'Datang':
        return 'bg-[#d1f4cc] text-[#2c7a20]';
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-700';
      case 'Batal':
      case 'Dibatalkan':
      case 'Tidak Datang':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleOpenDetail = (reservasi) => {
    setSelectedReservasi(reservasi);
    setIsModalDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsModalDetailOpen(false);
  };

  return {
    navigate,
    myReservasi,
    isLoading,
    selectedReservasi,
    isModalDetailOpen,
    getStatusColor,
    handleOpenDetail,
    handleCloseDetail
  };
};

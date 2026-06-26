import { useState } from 'react';
import { useFetchProduk } from '../../KelolaProduk/hooks/useFetchProduk';

export const useModalExportExcel = (onExport) => {
  const { products } = useFetchProduk();
  
  const [filters, setFilters] = useState({
    idProduk: 'semua',
    tanggalMulai: '',
    tanggalSelesai: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleExport = () => {
    onExport(filters);
  };

  return {
    products,
    filters,
    handleChange,
    handleExport
  };
};

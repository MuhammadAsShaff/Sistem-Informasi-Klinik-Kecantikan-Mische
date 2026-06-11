import { useState, useEffect } from 'react';

const defaultData = [
  {
    id: 1,
    nama: 'Testimoni 1',
    tanggal: '2023-10-01',
    jenis: 'Treatment',
    deskripsi: 'Pelayanannya sangat memuaskan!',
    foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 2,
    nama: 'Testimoni 2',
    tanggal: '2023-10-02',
    jenis: 'Produk',
    deskripsi: 'Produknya cocok di kulit saya.',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80'
  }
];

export const useTestimoni = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data dummy testimoni
  const [dataTestimoni, setDataTestimoni] = useState(() => {
    const savedData = localStorage.getItem('dataTestimoni');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        return defaultData;
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem('dataTestimoni', JSON.stringify(dataTestimoni));
  }, [dataTestimoni]);

  // Fungsi pencarian
  const filteredTestimoni = dataTestimoni.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setDataTestimoni(dataTestimoni.filter(item => item.id !== id));
  };

  const handleEdit = (id, updatedData) => {
    setDataTestimoni(dataTestimoni.map(item => 
      item.id === id ? { ...item, ...updatedData } : item
    ));
  };

  const handleAdd = (newData) => {
    const newId = dataTestimoni.length > 0 ? Math.max(...dataTestimoni.map(c => c.id)) + 1 : 1;
    setDataTestimoni([...dataTestimoni, { id: newId, ...newData }]);
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredTestimoni,
    handleDelete,
    handleEdit,
    handleAdd
  };
};

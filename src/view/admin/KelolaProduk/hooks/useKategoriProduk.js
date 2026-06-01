import { useState } from 'react';

export const useKategoriProduk = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data dummy kategori produk
  const [categories, setCategories] = useState([
    { id: 1, name: 'Acne', description: 'Produk khusus untuk merawat kulit berjerawat', count: 5 },
    { id: 2, name: 'Whitening', description: 'Rangkaian produk untuk mencerahkan kulit wajah', count: 8 },
    { id: 3, name: 'Anti Aging', description: 'Produk untuk mencegah tanda-tanda penuaan', count: 4 },
  ]);

  // Fungsi pencarian
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleEdit = (id, updatedData) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, ...updatedData } : cat
    ));
  };

  const handleAdd = (newData) => {
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    setCategories([...categories, { id: newId, ...newData, count: 0 }]);
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredCategories,
    handleDelete,
    handleEdit,
    handleAdd
  };
};

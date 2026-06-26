import { useState } from 'react';

export const useModalKelolaAlamat = (tambahAlamat, hapusAlamat) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [alamatToDelete, setAlamatToDelete] = useState(null);

  const handleSaveBaru = async (formData) => {
    const success = await tambahAlamat(formData);
    if (success) {
      setIsFormOpen(false);
    }
    return success;
  };

  const handleHapus = (id) => {
    setAlamatToDelete(id);
  };

  const confirmHapus = async () => {
    if (alamatToDelete) {
      await hapusAlamat(alamatToDelete);
      setAlamatToDelete(null);
    }
  };

  return {
    isFormOpen,
    setIsFormOpen,
    alamatToDelete,
    setAlamatToDelete,
    handleSaveBaru,
    handleHapus,
    confirmHapus
  };
};

import { useState, useEffect } from "react";
import { PROVINCES, CITIES } from "@/core/utils/rajaOngkirData";

export const useModalPerbaruiUser = (hook) => {
  const { formData, setFormData, showPassword, setShowPassword, handleChange, handleSubmit } = hook;

  const [isModalAlamatOpen, setIsModalAlamatOpen] = useState(false);
  const [localCities, setLocalCities] = useState([]);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
  const [alamatList, setAlamatList] = useState([]);

  useEffect(() => {
    if (formData.alamat_lengkap && Array.isArray(formData.alamat_lengkap)) {
      setAlamatList(formData.alamat_lengkap);
    } else {
      setAlamatList([]);
    }
  }, [formData.alamat_lengkap]);

  const fetchCities = (provinceId) => {
    if (!provinceId) {
      setLocalCities([]);
      return;
    }
    setLocalCities(CITIES[provinceId] || []);
  };

  const syncToFormData = (newList) => {
    setFormData(prev => ({
      ...prev,
      alamat_lengkap: newList,
      alamat: newList.length > 0 ? `${newList.length} Alamat Tersimpan` : ''
    }));
  };

  const dummyHookKelolaAlamat = {
    alamatList,
    isLoading: false,
    provinces: PROVINCES,
    cities: localCities,
    fetchCities,
    tambahAlamat: async (alamatData) => {
       const newAlamat = { ...alamatData, id: Date.now(), is_utama: alamatList.length === 0 };
       const newList = [...alamatList, newAlamat];
       setAlamatList(newList);
       syncToFormData(newList);
       return true;
    },
    hapusAlamat: async (id) => {
       const newList = alamatList.filter(a => a.id !== id);
       if (newList.length > 0 && !newList.some(a => a.is_utama)) {
          newList[0].is_utama = true;
       }
       setAlamatList(newList);
       syncToFormData(newList);
       return true;
    },
    jadikanUtama: async (id) => {
       const newList = alamatList.map(a => ({ ...a, is_utama: a.id === id }));
       setAlamatList(newList);
       syncToFormData(newList);
       return true;
    }
  };

  const handleAlamatClick = () => {
    if (formData.role.toLowerCase() !== 'customer') {
      setToast({ isOpen: true, message: 'Pengisian alamat lengkap hanya dikhususkan untuk Customer.', type: 'warning' });
      return;
    }
    setIsModalAlamatOpen(true);
  };

  return {
    formData,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
    isModalAlamatOpen,
    setIsModalAlamatOpen,
    toast,
    setToast,
    dummyHookKelolaAlamat,
    handleAlamatClick
  };
};

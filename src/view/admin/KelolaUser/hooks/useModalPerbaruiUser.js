import { useState, useEffect } from "react";
import { PROVINCES, CITIES } from "@/core/utils/rajaOngkirData";

/**
 * =========================================================================
 * ASISTEN PENGAWAL MEJA PERUBAHAN BIODATA (useModalPerbaruiUser)
 * =========================================================================
 * Ibarat asisten cekatan yang berjaga di meja koreksi biodata anggota.
 * Asisten ini menyodorkan kertas kerja (hook) yang dipegang Juru Tulis (useEditUser),
 * menyiapkan kunci gembok laci alamat lengkap, dan meneliti apakah anggota ini adalah 
 * seorang "Customer" sebelum mengizinkannya membuka buku alamat.
 */
export const useModalPerbaruiUser = (hook) => {
  // Mengambil pena, laci isian, dan saklar senter dari Juru Tulis Perubahan
  const { formData, setFormData, showPassword, setShowPassword, handleChange, handleSubmit } = hook;

  // Gembok pembuka laci meja khusus pengelolaan alamat lengkap
  const [isModalAlamatOpen, setIsModalAlamatOpen] = useState(false);
  // Laci penyimpan daftar kota/kabupaten sesuai provinsi yang ditunjuk
  const [localCities, setLocalCities] = useState([]);
  // TOA pengumuman kecil di meja kerja
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
  // Daftar kumpulan alamat yang dimiliki pelanggan ini
  const [alamatList, setAlamatList] = useState([]);

  /**
   * EFEK SAMPING: MENATA BUKU ALAMAT KETIKA BERKAS DIBUKA
   * Begitu ada rincian alamat di dalam formulir, asisten menatanya ke dalam daftar meja.
   */
  useEffect(() => {
    if (formData.alamat_lengkap && Array.isArray(formData.alamat_lengkap)) {
      setAlamatList(formData.alamat_lengkap);
    } else {
      setAlamatList([]);
    }
  }, [formData.alamat_lengkap]);

  /**
   * TUGAS MEMBUKA DAFTAR KOTA (fetchCities)
   * Ketika pimpinan menunjuk provinsi, asisten membuka peta dan menjabarkan kota-kotanya.
   */
  const fetchCities = (provinceId) => {
    if (!provinceId) {
      setLocalCities([]);
      return;
    }
    setLocalCities(CITIES[provinceId] || []);
  };

  /**
   * PENYELARAS TULISAN BUKU ALAMAT KE FORMULIR UTAMA (syncToFormData)
   * Setiap kali alamat ditambah atau dicoret, asisten menuliskan rekapannya ke kertas isian utama.
   */
  const syncToFormData = (newList) => {
    setFormData(prev => ({
      ...prev,
      alamat_lengkap: newList,
      alamat: newList.length > 0 ? `${newList.length} Alamat Tersimpan` : ''
    }));
  };

  // Pengurus arsip bayangan untuk melayani meja kelola alamat
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

  /**
   * PEMERIKSA STATUS CUSTOMER (handleAlamatClick)
   * Jika anggota ini bukan "Customer", asisten melarang keras pimpinan membuka buku alamat.
   */
  const handleAlamatClick = () => {
    if (formData.role.toLowerCase() !== 'customer') {
      setToast({ isOpen: true, message: 'Pengisian alamat lengkap hanya dikhususkan untuk Customer.', type: 'warning' });
      return;
    }
    setIsModalAlamatOpen(true);
  };

  // Asisten menyerahkan seluruh alat kerja kepada bilik meja koreksi (view)
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

import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { PROVINCES, CITIES } from "@/core/utils/rajaOngkirData";
import { getUser, saveUser } from "@/core/utils/authStorage";

/**
 * =========================================================================
 * MANDOR KEPALA BUKU ALAMAT PENGIRIMAN (useKelolaAlamat)
 * =========================================================================
 * Ibarat juru tulis di bagian ekspedisi klinik yang tugasnya mencatat daftar alamat
 * pengiriman tamu:
 * 1. Mengambil seluruh daftar alamat dari brankas arsip (fetchAlamat).
 * 2. Menandai mana alamat rumah utama dan mana alamat cadangan.
 * 3. Mengatur penambahan alamat baru atau membuang alamat lama.
 */
export function useKelolaAlamat(showToast) {
  const [alamatList, setAlamatList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch semua alamat
  const fetchAlamat = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(endpoints.customer.alamat);
      if (response.data?.status === 'success' || response.data?.success) {
        const rawAlamat = response.data.data || [];
        const user = getUser() || {};
        
        // Map is_utama berdasarkan user.idAlamatUtama dari session/storage
        const mappedAlamat = rawAlamat.map(a => ({
          ...a,
          is_utama: a.id === user.idAlamatUtama
        }));
        
        setAlamatList(mappedAlamat);
      }
    } catch (error) {
      console.error("Gagal mengambil alamat:", error);
      showToast("Gagal mengambil data alamat", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Muat data provinsi dari lokal
  const fetchProvinces = () => {
    setProvinces(PROVINCES);
  };

  // Muat data kota dari lokal berdasarkan provinceId
  const fetchCities = (provinceId) => {
    if (!provinceId) {
      setCities([]);
      return;
    }
    const cityList = CITIES[provinceId] || [];
    setCities(cityList);
  };

  // Tambah alamat baru
  const tambahAlamat = async (data) => {
    try {
      const response = await axiosClient.post(endpoints.customer.alamat, data);
      if (response.data?.success || response.data?.status === 'success') {
        showToast("Alamat berhasil ditambahkan", "success");
        await fetchAlamat();
        return true;
      }
    } catch (error) {
      console.error("Gagal tambah alamat:", error);
      showToast(error.response?.data?.message || "Gagal menambah alamat", "error");
      return false;
    }
  };

  // Hapus alamat
  const hapusAlamat = async (id) => {
    try {
      const response = await axiosClient.delete(`${endpoints.customer.alamat}/${id}`);
      if (response.data?.success || response.data?.status === 'success') {
        showToast("Alamat berhasil dihapus", "success");
        await fetchAlamat();
        return true;
      }
    } catch (error) {
      console.error("Gagal hapus alamat:", error);
      showToast("Gagal menghapus alamat", "error");
      return false;
    }
  };

  // Jadikan alamat utama
  const jadikanUtama = async (id) => {
    // Optimistic update
    setAlamatList(prev => prev.map(a => ({ ...a, is_utama: a.id === id })));
    
    try {
      const response = await axiosClient.patch(endpoints.customer.setAlamatUtama, {
        idAlamat: id
      });
      if (response.data?.success || response.data?.status === 'success') {
        // Update user storage so other parts of the app know the new primary address
        const user = getUser() || {};
        if (response.data?.data?.idAlamatUtama) {
          user.idAlamatUtama = response.data.data.idAlamatUtama;
        } else {
          user.idAlamatUtama = id;
        }
        saveUser(user);

        showToast("Alamat utama berhasil diubah", "success");
        await fetchAlamat();
        return true;
      }
    } catch (error) {
      console.error("Gagal set alamat utama:", error);
      showToast(error.response?.data?.message || "Gagal mengatur alamat utama", "error");
      // Revert if failed
      await fetchAlamat();
      return false;
    }
  };

  useEffect(() => {
    fetchAlamat();
    fetchProvinces();
  }, []);

  return {
    alamatList,
    isLoading,
    provinces,
    cities,
    fetchCities,
    tambahAlamat,
    hapusAlamat,
    jadikanUtama,
    refreshAlamat: fetchAlamat
  };
}

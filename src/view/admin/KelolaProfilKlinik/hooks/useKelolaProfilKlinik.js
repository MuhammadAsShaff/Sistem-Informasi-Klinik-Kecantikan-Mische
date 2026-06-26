import { useState } from "react";
import { useFetchProfilKlinik } from "./useFetchProfilKlinik";
import { useUpdateProfilKlinik } from "./useUpdateProfilKlinik";
import { useHapusProfilKlinik } from "./useHapusProfilKlinik";
import { useFetchKegiatan } from "./useFetchKegiatan";
import { useTambahKegiatan } from "./useTambahKegiatan";
import { useEditKegiatan } from "./useEditKegiatan";
import { useHapusKegiatan } from "./useHapusKegiatan";

export const useKelolaProfilKlinik = () => {
  const [isModalHapusPengaturanOpen, setIsModalHapusPengaturanOpen] = useState(false);
  const [isModalTambahKegiatanOpen, setIsModalTambahKegiatanOpen] = useState(false);
  const [isModalEditKegiatanOpen, setIsModalEditKegiatanOpen] = useState(false);
  const [isModalHapusKegiatanOpen, setIsModalHapusKegiatanOpen] = useState(false);

  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => setToast({ isOpen: true, message, type });

  const { profileData, setProfileData, fetchProfile, isLoading } = useFetchProfilKlinik();
  const { handleUpdateProfile } = useUpdateProfilKlinik(profileData, showToast, fetchProfile);
  const { handleDeleteProfile } = useHapusProfilKlinik(profileData, showToast, setProfileData);

  const { kegiatanList, fetchKegiatan } = useFetchKegiatan();

  const tambahKegiatan = useTambahKegiatan(() => {
    setIsModalTambahKegiatanOpen(false);
    fetchKegiatan();
    showToast("Berhasil menambahkan kegiatan klinik");
  });

  const editKegiatan = useEditKegiatan(
    isModalEditKegiatanOpen || null,
    !!isModalEditKegiatanOpen,
    () => {
      setIsModalEditKegiatanOpen(false);
      fetchKegiatan();
      showToast("Berhasil memperbarui kegiatan klinik");
    }
  );

  const hapusKegiatan = useHapusKegiatan(
    isModalHapusKegiatanOpen || null,
    () => {
      setIsModalHapusKegiatanOpen(false);
      fetchKegiatan();
      showToast("Berhasil menghapus kegiatan klinik");
    },
    showToast
  );

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(kegiatanList.length / ITEMS_PER_PAGE);

  const paginatedKegiatan = kegiatanList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
    isModalHapusPengaturanOpen,
    setIsModalHapusPengaturanOpen,
    isModalTambahKegiatanOpen,
    setIsModalTambahKegiatanOpen,
    isModalEditKegiatanOpen,
    setIsModalEditKegiatanOpen,
    isModalHapusKegiatanOpen,
    setIsModalHapusKegiatanOpen,
    toast,
    setToast,
    showToast,
    profileData,
    isLoading,
    handleUpdateProfile,
    handleDeleteProfile,
    kegiatanList,
    tambahKegiatan,
    editKegiatan,
    hapusKegiatan,
    currentPage,
    setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    paginatedKegiatan
  };
};

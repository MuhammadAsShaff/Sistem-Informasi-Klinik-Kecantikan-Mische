import { useState } from "react";
import { useFetchProfilKlinik } from "./useFetchProfilKlinik";
import { useUpdateProfilKlinik } from "./useUpdateProfilKlinik";
import { useHapusProfilKlinik } from "./useHapusProfilKlinik";
import { useFetchKegiatan } from "./useFetchKegiatan";
import { useTambahKegiatan } from "./useTambahKegiatan";
import { useEditKegiatan } from "./useEditKegiatan";
import { useHapusKegiatan } from "./useHapusKegiatan";

/**
 * MANDOR PENGATUR RUANGAN PROFIL KLINIK (useKelolaProfilKlinik)
 * Ibarat mandor besar yang memimpin dua area penting sekaligus: 
 * 1. Area Buku Riwayat & Visi-Misi Klinik.
 * 2. Area Papan Mading Kegiatan Klinik.
 * Mandor ini memegang saklar untuk membuka semua jendela pop-up, memimpin semua asisten pencatat, 
 * serta membagi tumpukan pengumuman mading ke beberapa halaman (Pagination).
 */
export const useKelolaProfilKlinik = () => {
  // Saklar pembuka jendela pop-up untuk buku riwayat & mading kegiatan
  const [isModalHapusPengaturanOpen, setIsModalHapusPengaturanOpen] = useState(false);
  const [isModalTambahKegiatanOpen, setIsModalTambahKegiatanOpen] = useState(false);
  const [isModalEditKegiatanOpen, setIsModalEditKegiatanOpen] = useState(false);
  const [isModalHapusKegiatanOpen, setIsModalHapusKegiatanOpen] = useState(false);

  // TOA Pengumuman (Toast Alert) jika ada proses sukses atau gagal
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => setToast({ isOpen: true, message, type });

  // --- 1. MEMANGGIL ASISTEN AREA BUKU RIWAYAT KLINIK ---
  const { profileData, setProfileData, fetchProfile, isLoading } = useFetchProfilKlinik();
  const { handleUpdateProfile } = useUpdateProfilKlinik(profileData, showToast, fetchProfile);
  const { handleDeleteProfile } = useHapusProfilKlinik(profileData, showToast, setProfileData);

  // --- 2. MEMANGGIL ASISTEN AREA PAPAN MADING KEGIATAN ---
  const { kegiatanList, fetchKegiatan } = useFetchKegiatan();

  // Asisten pendaftaran kegiatan baru
  const tambahKegiatan = useTambahKegiatan(() => {
    setIsModalTambahKegiatanOpen(false); // Tutup meja pendaftaran
    fetchKegiatan(); // Segarkan papan mading
    showToast("Berhasil menambahkan kegiatan klinik");
  });

  // Asisten koreksi kegiatan lama
  const editKegiatan = useEditKegiatan(
    isModalEditKegiatanOpen || null, // Catatan nomor kegiatan yang diperbaiki
    !!isModalEditKegiatanOpen, // Tanda mejanya dibuka
    () => {
      setIsModalEditKegiatanOpen(false); // Tutup meja koreksi
      fetchKegiatan(); // Segarkan papan mading
      showToast("Berhasil memperbarui kegiatan klinik");
    }
  );

  // Petugas pencabut lembar kegiatan mading
  const hapusKegiatan = useHapusKegiatan(
    isModalHapusKegiatanOpen || null, // Catatan nomor kegiatan yang dicabut
    () => {
      setIsModalHapusKegiatanOpen(false); // Tutup plang peringatan
      fetchKegiatan(); // Segarkan papan mading
      showToast("Berhasil menghapus kegiatan klinik");
    },
    showToast
  );

  // --- 3. SISTEM PEMBAGIAN HALAMAN MADING (PAGINATION) ---
  // Menentukan bahwa satu halaman mading maksimal memajang 6 pengumuman kegiatan
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(kegiatanList.length / ITEMS_PER_PAGE);

  // Menggunting daftar pengumuman sesuai nomor halaman yang sedang dibuka
  const paginatedKegiatan = kegiatanList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Mandor membagikan seluruh saklar, asisten, dan alat potong ini ke ruangan utama
  return {
    isModalHapusPengaturanOpen, setIsModalHapusPengaturanOpen,
    isModalTambahKegiatanOpen, setIsModalTambahKegiatanOpen,
    isModalEditKegiatanOpen, setIsModalEditKegiatanOpen,
    isModalHapusKegiatanOpen, setIsModalHapusKegiatanOpen,
    toast, setToast, showToast,
    profileData,
    isLoading,
    handleUpdateProfile,
    handleDeleteProfile,
    kegiatanList,
    tambahKegiatan,
    editKegiatan,
    hapusKegiatan,
    currentPage, setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    paginatedKegiatan
  };
};

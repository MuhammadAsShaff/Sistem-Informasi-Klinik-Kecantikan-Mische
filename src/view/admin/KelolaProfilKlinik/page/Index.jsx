import React, { useState } from "react";
import { useFetchProfilKlinik } from "../hooks/useFetchProfilKlinik";
import { useUpdateProfilKlinik } from "../hooks/useUpdateProfilKlinik";
import { useHapusProfilKlinik } from "../hooks/useHapusProfilKlinik";
import { useFetchKegiatan } from "../hooks/useFetchKegiatan";
import { useTambahKegiatan } from "../hooks/useTambahKegiatan";
import { useEditKegiatan } from "../hooks/useEditKegiatan";
import { useHapusKegiatan } from "../hooks/useHapusKegiatan";

import Header from "./Header";
import PengaturanTentangKami from "./PengaturanTentangKami";
import GaleriKegiatan from "./GaleriKegiatan";
import ModalHapusPengaturan from "./ModalHapusPengaturan";
import ModalTambahKegiatanBaru from "./ModalTambahKegiatanBaru";
import ModalEditKegiatan from "./ModalPerbaruiKegiatan";
import ModalHapusKegiatan from "./ModalHapusKegiatan";
import ToastAlert from "@/view/components/ToastAlert";
import Pagination from '@/components/Pagination';

const KelolaProfilKlinik = () => {
  // State modal
  const [isModalHapusPengaturanOpen, setIsModalHapusPengaturanOpen] = useState(false);
  const [isModalTambahKegiatanOpen, setIsModalTambahKegiatanOpen] = useState(false);
  const [isModalEditKegiatanOpen, setIsModalEditKegiatanOpen] = useState(false);
  const [isModalHapusKegiatanOpen, setIsModalHapusKegiatanOpen] = useState(false);

  // Toast notifikasi
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => setToast({ isOpen: true, message, type });

  // ─── HOOK: PROFIL KLINIK ──────────────────────────────────────
  const { profileData, setProfileData, fetchProfile, isLoading } = useFetchProfilKlinik();
  const { handleUpdateProfile } = useUpdateProfilKlinik(profileData, showToast, fetchProfile);
  const { handleDeleteProfile } = useHapusProfilKlinik(profileData, showToast, setProfileData);

  // ─── HOOK: KEGIATAN ───────────────────────────────────────────
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

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(kegiatanList.length / ITEMS_PER_PAGE);

  const paginatedKegiatan = kegiatanList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-8 bg-[#f4f6f9] min-h-screen font-sans">
      <ToastAlert
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
      <Header />

      <PengaturanTentangKami
        data={profileData}
        onSimpan={handleUpdateProfile}
        onError={(msg) => showToast(msg, "error")}
        onHapusClick={() => setIsModalHapusPengaturanOpen(true)}
      />

      <GaleriKegiatan
        data={paginatedKegiatan}
        onTambahClick={() => setIsModalTambahKegiatanOpen(true)}
        onPerbaruiClick={(id) => setIsModalEditKegiatanOpen(id)}
        onHapusClick={(id) => setIsModalHapusKegiatanOpen(id)}
      />
      
      <div className="mt-6">
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>

      <ModalHapusPengaturan
        isOpen={isModalHapusPengaturanOpen}
        onClose={() => setIsModalHapusPengaturanOpen(false)}
        onConfirm={() => handleDeleteProfile(() => setIsModalHapusPengaturanOpen(false))}
      />

      <ModalTambahKegiatanBaru
        isOpen={isModalTambahKegiatanOpen}
        onClose={() => setIsModalTambahKegiatanOpen(false)}
        hook={tambahKegiatan}
      />

      <ModalEditKegiatan
        isOpen={!!isModalEditKegiatanOpen}
        onClose={() => setIsModalEditKegiatanOpen(false)}
        hook={editKegiatan}
      />

      <ModalHapusKegiatan
        isOpen={!!isModalHapusKegiatanOpen}
        onClose={() => setIsModalHapusKegiatanOpen(false)}
        hook={hapusKegiatan}
      />
    </div>
  );
};

export default KelolaProfilKlinik;

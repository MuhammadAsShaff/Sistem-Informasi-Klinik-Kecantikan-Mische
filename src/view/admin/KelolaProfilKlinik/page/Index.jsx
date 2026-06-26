import React from "react";
import Header from "./Header";
import PengaturanTentangKami from "./PengaturanTentangKami";
import GaleriKegiatan from "./GaleriKegiatan";
import ModalHapusPengaturan from "./ModalHapusPengaturan";
import ModalTambahKegiatanBaru from "./ModalTambahKegiatanBaru";
import ModalEditKegiatan from "./ModalPerbaruiKegiatan";
import ModalHapusKegiatan from "./ModalHapusKegiatan";
import ToastAlert from "@/view/components/ToastAlert/page/Index";
import Pagination from '@/components/Pagination';
import { useKelolaProfilKlinik } from "../hooks/useKelolaProfilKlinik";

const KelolaProfilKlinik = () => {
  const {
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
    handleUpdateProfile,
    handleDeleteProfile,
    tambahKegiatan,
    editKegiatan,
    hapusKegiatan,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedKegiatan
  } = useKelolaProfilKlinik();

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

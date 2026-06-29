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

/**
 * RUANGAN UTAMA MANAJEMEN PROFIL KLINIK (KelolaProfilKlinik)
 * Ibarat balai agung tempat admin mengatur seluruh identitas klinik. Di dalam balai ini terdapat:
 * 1. Papan Plang Nama (Header).
 * 2. Meja Buku Riwayat & Visi-Misi (PengaturanTentangKami).
 * 3. Rak Lemari Mading Kegiatan (GaleriKegiatan).
 * 4. Papan Nomor Halaman Mading (Pagination).
 * 5. Empat bilik meja pop-up rahasia untuk menambah, mengoreksi, atau mencabut data.
 * Ruangan ini dipimpin penuh oleh Mandor Besar (useKelolaProfilKlinik).
 */
const KelolaProfilKlinik = () => {
  // Memanggil sang Mandor Besar untuk memegang seluruh saklar dan asisten
  const {
    isModalHapusPengaturanOpen, setIsModalHapusPengaturanOpen,
    isModalTambahKegiatanOpen, setIsModalTambahKegiatanOpen,
    isModalEditKegiatanOpen, setIsModalEditKegiatanOpen,
    isModalHapusKegiatanOpen, setIsModalHapusKegiatanOpen,
    toast, setToast, showToast,
    profileData,
    handleUpdateProfile,
    handleDeleteProfile,
    tambahKegiatan,
    editKegiatan,
    hapusKegiatan,
    currentPage, setCurrentPage,
    totalPages,
    paginatedKegiatan
  } = useKelolaProfilKlinik();

  return (
    <div className="p-8 bg-[#f4f6f9] min-h-screen font-sans">
      {/* TOA Pengumuman di atap balai */}
      <ToastAlert
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
      
      {/* Papan Plang Nama Ruangan */}
      <Header />

      {/* Meja Buku Riwayat & Visi-Misi Klinik */}
      <PengaturanTentangKami
        data={profileData}
        onSimpan={handleUpdateProfile}
        onError={(msg) => showToast(msg, "error")}
        onHapusClick={() => setIsModalHapusPengaturanOpen(true)}
      />

      {/* Rak Lemari Mading Kegiatan Klinik */}
      <GaleriKegiatan
        data={paginatedKegiatan}
        onTambahClick={() => setIsModalTambahKegiatanOpen(true)}
        onPerbaruiClick={(id) => setIsModalEditKegiatanOpen(id)}
        onHapusClick={(id) => setIsModalHapusKegiatanOpen(id)}
      />
      
      {/* Papan Nomor Halaman Mading */}
      <div className="mt-6">
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>

      {/* --- EMPAT BILIK MEJA POP-UP RAHASIA --- */}
      
      {/* Bilik Peringatan Pemusnahan Buku Riwayat */}
      <ModalHapusPengaturan
        isOpen={isModalHapusPengaturanOpen}
        onClose={() => setIsModalHapusPengaturanOpen(false)}
        onConfirm={() => handleDeleteProfile(() => setIsModalHapusPengaturanOpen(false))}
      />

      {/* Bilik Meja Pendaftaran Kegiatan Baru */}
      <ModalTambahKegiatanBaru
        isOpen={isModalTambahKegiatanOpen}
        onClose={() => setIsModalTambahKegiatanOpen(false)}
        hook={tambahKegiatan}
      />

      {/* Bilik Meja Koreksi Kegiatan Lama */}
      <ModalEditKegiatan
        isOpen={!!isModalEditKegiatanOpen}
        onClose={() => setIsModalEditKegiatanOpen(false)}
        hook={editKegiatan}
      />

      {/* Bilik Peringatan Pencabutan Lembar Kegiatan Mading */}
      <ModalHapusKegiatan
        isOpen={!!isModalHapusKegiatanOpen}
        onClose={() => setIsModalHapusKegiatanOpen(false)}
        hook={hapusKegiatan}
      />
    </div>
  );
};

export default KelolaProfilKlinik;

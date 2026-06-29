import React from "react";
import Header from "./Header";
import SearchBar from '@/components/SearchBar';
import { Plus } from "lucide-react";
import Tabel from "./Tabel";
import ModalTambahPromo from "./ModalTambahPromo";
import ModalPerbaruiPromo from "./ModalPerbaruiPromo";
import ModalHapusPromo from "./ModalHapusPromo";
import ModalDetailPromo from "./ModalDetailPromo";
import ModalDistribusiPromo from "./ModalDistribusiPromo";
import ToastAlert from "@/view/components/ToastAlert/page/Index";
import { useKelolaPromoHook } from "../hooks/useKelolaPromoHook";

/**
 * RUANGAN UTAMA MANAJEMEN PROFIL PROMO (KelolaPromo)
 * Ibarat balai megah tempat pengatur taktik penjualan klinik berkumpul. Di dalam balai ini terdapat:
 * 1. Papan Plang Pengumuman (Header).
 * 2. Lensa Pembesar & Tombol Pendaftaran Baru (SearchBar & tombol Plus).
 * 3. Meja Pameran Daftar Promo (Tabel).
 * 4. TOA Pengumuman di atap balai (ToastAlert).
 * 5. Lima bilik meja pop-up rahasia (Tambah, Edit, Hapus, Detail, Distribusi).
 * Ruangan ini dikomandoi langsung oleh Mandor Besar (useKelolaPromoHook).
 */
export default function KelolaPromo() {
  // Memanggil sang Mandor Besar untuk memegang seluruh saklar, kunci, dan asisten
  const {
    isTambahOpen, setIsTambahOpen,
    isEditOpen, setIsEditOpen,
    isHapusOpen, setIsHapusOpen,
    isDetailOpen, setIsDetailOpen,
    isDistribusiOpen, setIsDistribusiOpen,
    selectedPromo,
    toast, setToast, showToast,
    dataPromo,
    searchQuery, setSearchQuery,
    isLoading,
    formTambah, handleInputTambah, submitTambahPromo, isSubmittingTambah, errorTambah, resetFormTambah,
    formEdit, handleInputEdit, submitEditPromo, isSubmittingEdit, errorEdit,
    confirmDelete,
    updateStatusPromo,
    handleOpenEdit,
    handleOpenDetail,
    handleOpenDelete,
    handleSendPromo
  } = useKelolaPromoHook();

  return (
    <div className="flex-1 w-full bg-[#F9FAFB] relative">
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Papan Plang Pengumuman Balai Promo */}
        <Header />
        
        {/* Lensa Pembesar & Tombol Plus Pendaftaran */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          rightComponents={
            <button 
              onClick={() => {
                resetFormTambah(); // Mandor menggelar kertas pendaftaran kosong baru
                setIsTambahOpen(true); // Membuka bilik pendaftaran
              }}
              className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={20} />
            </button>
          }
        />

        {/* Meja Pameran Daftar Promo */}
        <Tabel 
          isLoading={isLoading}
          data={dataPromo}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onDetail={handleOpenDetail}
          onSend={handleSendPromo}
          updateStatus={updateStatusPromo}
        />

        {/* --- LIMA BILIK MEJA POP-UP RAHASIA --- */}
        
        {/* Bilik Meja Pendaftaran Promo Baru */}
        <ModalTambahPromo
          isOpen={isTambahOpen}
          onClose={() => setIsTambahOpen(false)}
          formData={formTambah}
          handleInputChange={handleInputTambah}
          submitTambahPromo={submitTambahPromo}
          isSubmitting={isSubmittingTambah}
          error={errorTambah}
        />

        {/* Bilik Meja Koreksi Promo Lama */}
        <ModalPerbaruiPromo
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          formData={formEdit}
          handleInputChange={handleInputEdit}
          submitEditPromo={submitEditPromo}
          isSubmitting={isSubmittingEdit}
          error={errorEdit}
        />

        {/* Plang Peringatan Pemusnahan Promo */}
        <ModalHapusPromo
          isOpen={isHapusOpen}
          onClose={() => setIsHapusOpen(false)}
          onConfirm={() => confirmDelete(() => setIsHapusOpen(false))}
        />

        {/* Bilik Pameran Rincian Detail Promo */}
        <ModalDetailPromo
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          promo={selectedPromo}
        />

        {/* Meja Kerja Kurir Pengantar Selebaran Promo */}
        <ModalDistribusiPromo
          isOpen={isDistribusiOpen}
          onClose={() => setIsDistribusiOpen(false)}
          promo={selectedPromo}
          showToast={showToast}
        />

        {/* TOA Pengumuman di Atap Balai */}
        <ToastAlert
          isOpen={toast.isOpen}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, isOpen: false })}
        />
      </div>
    </div>
  );
}

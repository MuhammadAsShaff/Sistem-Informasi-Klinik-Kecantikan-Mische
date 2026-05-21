import React, { useState } from "react";
import { useFetchPromo } from "./hooks/useFetchPromo";
import { useTambahPromo } from "./hooks/useTambahPromo";
import { useEditPromo } from "./hooks/useEditPromo";
import { useHapusPromo } from "./hooks/useHapusPromo";

import Header from "./page/Header";
import SearchBar from "./page/SearchBar";
import Tabel from "./page/Tabel";
import ModalTambahPromo from "./page/ModalTambahPromo";
import ModalPerbaruiPromo from "./page/ModalPerbaruiPromo";
import ModalHapusPromo from "./page/ModalHapusPromo";
import ModalDetailPromo from "./page/ModalDetailPromo";
import ToastAlert from "@/view/components/ToastAlert";

export default function KelolaPromo() {
  // ─── STATE MODAL ──────────────────────────────────────────────────
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);

  // ─── STATE TOAST ──────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // ─── HOOKS DATA ───────────────────────────────────────────────────
  const { dataPromo, searchQuery, setSearchQuery, fetchPromo } = useFetchPromo();

  const {
    formData: formTambah,
    handleInputChange: handleInputTambah,
    submitTambahPromo,
    isSubmitting: isSubmittingTambah,
    error: errorTambah,
    resetForm: resetFormTambah,
  } = useTambahPromo(() => {
    setIsTambahOpen(false);
    fetchPromo();
  }, showToast);

  const {
    formData: formEdit,
    handleInputChange: handleInputEdit,
    submitEditPromo,
    isSubmitting: isSubmittingEdit,
    error: errorEdit,
  } = useEditPromo(selectedPromo, () => {
    setIsEditOpen(false);
    fetchPromo();
  }, showToast);

  const { confirmDelete, updateStatusPromo } = useHapusPromo(
    selectedPromo,
    () => fetchPromo(),
    showToast
  );

  // ─── HANDLERS MODAL ───────────────────────────────────────────────
  const handleOpenEdit = (promo) => {
    setSelectedPromo(promo);
    setIsEditOpen(true);
  };

  const handleOpenDetail = (promo) => {
    setSelectedPromo(promo);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (promo) => {
    setSelectedPromo(promo);
    setIsHapusOpen(true);
  };

  const handleSendPromo = (promo) => {
    // Simulasi kirim promo
    showToast("Promo ini berhasil dikirim!", "success");
  };

  return (
    <div className="flex-1 w-full bg-[#F9FAFB]">
      <div className="max-w-[1400px] mx-auto w-full">
        <Header />
        
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddClick={() => {
            resetFormTambah();
            setIsTambahOpen(true);
          }}
        />

        <Tabel
          data={dataPromo}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onDetail={handleOpenDetail}
          onSend={handleSendPromo}
          updateStatus={updateStatusPromo}
        />

        {/* MODALS */}
        <ModalTambahPromo
          isOpen={isTambahOpen}
          onClose={() => setIsTambahOpen(false)}
          formData={formTambah}
          handleInputChange={handleInputTambah}
          submitTambahPromo={submitTambahPromo}
          isSubmitting={isSubmittingTambah}
          error={errorTambah}
        />

        <ModalPerbaruiPromo
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          formData={formEdit}
          handleInputChange={handleInputEdit}
          submitEditPromo={submitEditPromo}
          isSubmitting={isSubmittingEdit}
          error={errorEdit}
        />

        <ModalHapusPromo
          isOpen={isHapusOpen}
          onClose={() => setIsHapusOpen(false)}
          onConfirm={() => confirmDelete(() => setIsHapusOpen(false))}
        />

        <ModalDetailPromo
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          promo={selectedPromo}
        />

        {/* TOAST NOTIFICATION */}
        {toast && (
          <ToastAlert
            isOpen={true}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

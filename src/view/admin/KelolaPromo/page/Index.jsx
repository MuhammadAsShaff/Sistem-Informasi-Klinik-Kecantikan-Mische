import React, { useState } from "react";
import { useFetchPromo } from "../hooks/useFetchPromo";
import { useTambahPromo } from "../hooks/useTambahPromo";
import { useEditPromo } from "../hooks/useEditPromo";
import { useHapusPromo } from "../hooks/useHapusPromo";

import Header from "./Header";
import SearchBar from '@/components/SearchBar';
import { ChevronDown, Plus } from "lucide-react";
import Tabel from "./Tabel";
import ModalTambahPromo from "./ModalTambahPromo";
import ModalPerbaruiPromo from "./ModalPerbaruiPromo";
import ModalHapusPromo from "./ModalHapusPromo";
import ModalDetailPromo from "./ModalDetailPromo";
import ModalDistribusiPromo from "./ModalDistribusiPromo";
import ToastAlert from "@/view/components/ToastAlert";

export default function KelolaPromo() {
  // ─── STATE MODAL ──────────────────────────────────────────────────
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDistribusiOpen, setIsDistribusiOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);

  // ─── STATE TOAST ──────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // ─── HOOKS DATA ───────────────────────────────────────────────────
  const { dataPromo, searchQuery, setSearchQuery, fetchPromo, isLoading } = useFetchPromo();

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
    setSelectedPromo(promo);
    setIsDistribusiOpen(true);
  };

  return (
    <div className="flex-1 w-full bg-[#F9FAFB] relative">
      <div className="max-w-[1400px] mx-auto w-full">
        <Header />
        
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          rightComponents={
            <button 
              onClick={() => {
                resetFormTambah();
                setIsTambahOpen(true);
              }}
              className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={20} />
            </button>
          }
        />

        <Tabel isLoading={isLoading}
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

        <ModalDistribusiPromo
          isOpen={isDistribusiOpen}
          onClose={() => setIsDistribusiOpen(false)}
          promo={selectedPromo}
          showToast={showToast}
        />

        {/* TOAST NOTIFICATION */}
        {toast && toast.isOpen && (
          <ToastAlert
            isOpen={toast.isOpen}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, isOpen: false })}
          />
        )}
      </div>
    </div>
  );
}

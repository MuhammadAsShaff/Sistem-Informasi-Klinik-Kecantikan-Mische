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

export default function KelolaPromo() {
  const {
    isTambahOpen,
    setIsTambahOpen,
    isEditOpen,
    setIsEditOpen,
    isHapusOpen,
    setIsHapusOpen,
    isDetailOpen,
    setIsDetailOpen,
    isDistribusiOpen,
    setIsDistribusiOpen,
    selectedPromo,
    toast,
    setToast,
    showToast,
    dataPromo,
    searchQuery,
    setSearchQuery,
    isLoading,
    formTambah,
    handleInputTambah,
    submitTambahPromo,
    isSubmittingTambah,
    errorTambah,
    resetFormTambah,
    formEdit,
    handleInputEdit,
    submitEditPromo,
    isSubmittingEdit,
    errorEdit,
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

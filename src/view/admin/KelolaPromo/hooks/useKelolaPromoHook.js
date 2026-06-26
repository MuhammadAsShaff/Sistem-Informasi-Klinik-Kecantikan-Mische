import { useState } from "react";
import { useFetchPromo } from "./useFetchPromo";
import { useTambahPromo } from "./useTambahPromo";
import { useEditPromo } from "./useEditPromo";
import { useHapusPromo } from "./useHapusPromo";

export const useKelolaPromoHook = () => {
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDistribusiOpen, setIsDistribusiOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);

  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

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

  return {
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
    setSelectedPromo,
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
  };
};

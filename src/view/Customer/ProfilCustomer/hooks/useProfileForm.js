import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfilCustomer } from "./useProfilCustomer";
import { useUbahPasswordCustomer } from "./useUbahPasswordCustomer";
import { useKelolaAlamat } from "./useKelolaAlamat";

/**
 * =========================================================================
 * ASISTEN PENGHUBUNG MEJA KELOLA PROFIL (useProfileForm)
 * =========================================================================
 * Ibarat kepala pelayan yang berdiri di meja kelola profil untuk mengoordinasikan
 * mandor ubah password, mandor buku alamat, dan mandor data identitas sekaligus.
 */
export const useProfileForm = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => setToast({ isOpen: true, message, type });

  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);
  const [isModalAlamatOpen, setIsModalAlamatOpen] = useState(false);

  const hookKelolaAlamat = useKelolaAlamat(showToast);
  const { formData, handleChange, handleUpdate, handleLogout } = useProfilCustomer(showToast, navigate);

  const passwordHook = useUbahPasswordCustomer(formData, (updatedUser) => {
    showToast("Password berhasil diperbarui!", "success");
    setIsModalPasswordOpen(false);
  });

  const closeToast = () => setToast({ ...toast, isOpen: false });

  return {
    toast,
    closeToast,
    isModalPasswordOpen,
    setIsModalPasswordOpen,
    isModalAlamatOpen,
    setIsModalAlamatOpen,
    hookKelolaAlamat,
    formData,
    handleChange,
    handleUpdate,
    handleLogout,
    passwordHook
  };
};

import { useState } from "react";
import { useUbahPasswordAdmin } from "./useUbahPasswordAdmin";

export const useProfilForm = (formData, showToast, onUserUpdated) => {
  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);

  const passwordHook = useUbahPasswordAdmin(
    formData,
    (updatedUser) => {
      showToast("Password berhasil diperbarui!", "success");
      setIsModalPasswordOpen(false);
      onUserUpdated && onUserUpdated(updatedUser);
    }
  );

  return {
    isModalPasswordOpen,
    setIsModalPasswordOpen,
    passwordHook
  };
};

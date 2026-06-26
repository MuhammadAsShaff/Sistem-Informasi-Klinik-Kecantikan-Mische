import { useState } from "react";
import { useFetchProfilAdmin } from "./useFetchProfilAdmin";
import { useUpdateProfilAdmin } from "./useUpdateProfilAdmin";

export const useProfilAdminPage = () => {
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  const { userData, setUserData, isLoading } = useFetchProfilAdmin();

  const profilHook = useUpdateProfilAdmin(
    userData,
    showToast,
    (updatedUser) => setUserData(updatedUser)
  );

  return {
    toast,
    setToast,
    showToast,
    userData,
    setUserData,
    isLoading,
    profilHook
  };
};

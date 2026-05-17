import React, { useState } from "react";
import { useFetchProfilAdmin } from "../hooks/useFetchProfilAdmin";
import { useUpdateProfilAdmin } from "../hooks/useUpdateProfilAdmin";

import Header from "./Header";
import Banner from "./Banner";
import ProfilForm from "./ProfilForm";
import ToastAlert from "@/view/components/ToastAlert";

export default function KelolaProfilAdmin() {
  // State toast notifikasi
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // ─── HOOK: READ ───────────────────────────────────────────────
  const { userData, setUserData } = useFetchProfilAdmin();

  // ─── HOOK: UPDATE ─────────────────────────────────────────────
  const profilHook = useUpdateProfilAdmin(
    userData,
    showToast,
    (updatedUser) => setUserData(updatedUser)
  );

  return (
    <div className="w-full bg-white p-6 md:p-10">
      <ToastAlert
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
      <div className="max-w-5xl mx-auto">
        <Header />
        <Banner user={userData} />
        <ProfilForm
          hook={profilHook}
          user={userData}
          showToast={showToast}
          onUserUpdated={(updatedUser) => setUserData(updatedUser)}
        />
      </div>
    </div>
  );
}

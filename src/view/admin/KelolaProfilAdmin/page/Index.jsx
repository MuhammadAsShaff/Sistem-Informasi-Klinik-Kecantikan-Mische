import React from "react";
import Header from "./Header";
import Banner from "./Banner";
import ProfilForm from "./ProfilForm";
import ToastAlert from "@/view/components/ToastAlert/page/Index";
import { useProfilAdminPage } from "../hooks/useProfilAdminPage";

export default function KelolaProfilAdmin() {
  const {
    toast,
    setToast,
    showToast,
    userData,
    setUserData,
    profilHook
  } = useProfilAdminPage();

  return (
    <div className="w-full bg-white p-6 md:p-10">
      {toast && toast.isOpen && (
        <ToastAlert
          isOpen={toast.isOpen}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, isOpen: false })}
        />
      )}
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

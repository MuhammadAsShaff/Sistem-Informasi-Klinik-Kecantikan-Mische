import React from "react";
import Header from "./Header";
import Banner from "./Banner";
import ProfilForm from "./ProfilForm";
import ToastAlert from "@/view/components/ToastAlert/page/Index";
import { useProfilAdminPage } from "../hooks/useProfilAdminPage";

/**
 * RUANGAN UTAMA KELOLA PROFIL ADMIN (Index)
 * Ibarat ruangan besar yang tenang tempat admin memperbarui identitasnya. Di ruangan ini, 
 * mandor utama (useProfilAdminPage) telah menyusun segala perabotan: plang nama di atas (Header), 
 * papan foto sambutan (Banner), meja panjang berisi formulir isian (ProfilForm), serta 
 * TOA pengumuman (ToastAlert) yang berbunyi jika data berhasil disimpan.
 */
export default function KelolaProfilAdmin() {
  // Memanggil mandor utama yang memegang catatan biodata dan TOA pengumuman
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
      
      {/* TOA Pengumuman (ToastAlert) jika sukses / gagal menyimpan */}
      {toast && toast.isOpen && (
        <ToastAlert
          isOpen={toast.isOpen}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, isOpen: false })}
        />
      )}

      {/* Meja Karpet Tengah Ruangan */}
      <div className="max-w-5xl mx-auto">
        
        {/* Papan Nama Ruangan (Header) */}
        <Header />
        
        {/* Papan Sambutan dan Foto Wajah (Banner) */}
        <Banner user={userData} />
        
        {/* Meja Formulir Isian Biodata (ProfilForm) */}
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

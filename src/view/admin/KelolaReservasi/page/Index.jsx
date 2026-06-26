import React from "react";
import Tabel from "./Tabel";
import ModalUbahStatus from "./ModalUbahStatus";
import ModalDetail from "./ModalDetail";
import ModalHapus from "./ModalHapus";
import ModalTambahReservasi from "./ModalTambahReservasi";
import ModalExportExcel from "./ModalExportExcel";
import ToastAlert from "@/view/components/ToastAlert/page/Index";
import { useKelolaReservasi } from "../hooks/useKelolaReservasi";

export default function KelolaReservasi() {
  const {
    selectedReservasi,
    isStatusOpen,
    setIsStatusOpen,
    isDetailOpen,
    setIsDetailOpen,
    isHapusOpen,
    setIsHapusOpen,
    isTambahOpen,
    setIsTambahOpen,
    isExcelOpen,
    setIsExcelOpen,
    toast,
    setToast,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    filteredReservasi,
    meta,
    isLoading,
    ubahStatusHook,
    hapusHook,
    isTambahSubmitting,
    handleEditStatus,
    handleDetail,
    handleDelete,
    handleTambahSubmit
  } = useKelolaReservasi();

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen animate-in fade-in duration-700">
      <ToastAlert
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />

      <div className="max-w-[1440px] mx-auto flex flex-col gap-6 font-poppins">
        
        {/* Header Sederhana */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-2 gap-4">
          <div>
            <h1 className="text-3xl font-medium text-black tracking-tight">Data Reservasi Treatment</h1>
            <p className="text-gray-500 mt-2 text-[11px] max-w-3xl">
              Menampilkan data reservasi treatment lengkap dengan jadwal dan informasi pengguna. Admin dapat melakukan pencarian, edit, dan hapus data.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="flex items-center">
              <input 
                type="text"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#f3f4f6] text-sm px-4 py-2 outline-none w-48 lg:w-64 border border-transparent focus:border-gray-300"
              />
              <button className="bg-[#56BC36] hover:bg-[#469e2c] p-2 transition-colors text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </div>

            {/* Export Excel Button */}
            <button 
              onClick={() => setIsExcelOpen(true)}
              className="bg-[#56BC36] hover:bg-[#469e2c] text-white text-sm py-2 px-4 shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Excel
            </button>

            {/* Tambah Button */}
            <button 
              onClick={() => setIsTambahOpen(true)}
              className="bg-[#56BC36] hover:bg-[#469e2c] text-white text-sm py-2 px-3 shadow-sm hover:shadow transition-all flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-gray-500 font-bold">
            Mengambil data reservasi dari server...
          </div>
        ) : (
          <Tabel isLoading={isLoading}
            data={filteredReservasi}
            meta={meta}
            page={page}
            setPage={setPage}
            onDetail={handleDetail}
            onEditStatus={handleEditStatus}
            onDelete={handleDelete}
          />
        )}

        <ModalUbahStatus
          isOpen={isStatusOpen}
          onClose={() => setIsStatusOpen(false)}
          selectedReservasi={selectedReservasi}
          hook={ubahStatusHook}
        />

        <ModalDetail
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          selectedReservasi={selectedReservasi}
        />

        <ModalHapus
          isOpen={isHapusOpen}
          onClose={() => setIsHapusOpen(false)}
          hook={hapusHook}
        />

        <ModalTambahReservasi
          isOpen={isTambahOpen}
          onClose={() => setIsTambahOpen(false)}
          onSubmit={handleTambahSubmit}
          isSubmitting={isTambahSubmitting}
        />

        <ModalExportExcel
          isOpen={isExcelOpen}
          onClose={() => setIsExcelOpen(false)}
        />
      </div>
    </div>
  );
}

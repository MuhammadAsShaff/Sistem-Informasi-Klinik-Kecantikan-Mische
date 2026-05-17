import React, { useState } from "react";
import { useFetchJadwal } from "../hooks/useFetchJadwal";
import { useTambahJadwal } from "../hooks/useTambahJadwal";
import { useEditJadwal } from "../hooks/useEditJadwal";
import { useHapusJadwal } from "../hooks/useHapusJadwal";

import Header from "./Header";
import SearchBar from "./SearchBar";
import Tabel from "./Tabel";
import Pagination from "./Pagination";
import ModalTambahJadwal from "./ModalTambahJadwal";
import ModalPerbaruiJadwal from "./ModalPerbaruiJadwal";
import ModalHapusJadwal from "./ModalHapusJadwal";
import ToastAlert from "@/view/components/ToastAlert";

export default function KelolaJadwalReservasiTreatment() {
  // State seleksi jadwal (untuk edit & hapus)
  const [selectedJadwal, setSelectedJadwal] = useState(null);

  // State visibilitas modal
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);

  // State toast notifikasi
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // ─── HOOK: READ ───────────────────────────────────────────────
  const { dataJadwal, isLoading, fetchSchedules } = useFetchJadwal();

  // ─── HOOK: CREATE ─────────────────────────────────────────────
  const tambahJadwal = useTambahJadwal(
    dataJadwal,
    () => {
      setIsTambahOpen(false);
      fetchSchedules();
      showToast("Jadwal berhasil ditambahkan!");
    },
    isTambahOpen
  );

  // ─── HOOK: UPDATE ─────────────────────────────────────────────
  const editJadwal = useEditJadwal(
    selectedJadwal,
    dataJadwal,
    () => {
      setIsEditOpen(false);
      fetchSchedules();
      showToast("Jadwal berhasil diperbarui!");
    },
    isEditOpen
  );

  // ─── HOOK: DELETE ─────────────────────────────────────────────
  const hapusJadwal = useHapusJadwal(
    selectedJadwal,
    () => {
      setIsHapusOpen(false);
      fetchSchedules();
      showToast("Jadwal berhasil dihapus!");
    },
    showToast
  );

  // Handler buka modal edit
  const handleEdit = (jadwal) => {
    setSelectedJadwal(jadwal);
    setIsEditOpen(true);
  };

  // Handler buka modal hapus
  const handleDelete = (jadwal) => {
    setSelectedJadwal(jadwal);
    setIsHapusOpen(true);
  };

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen animate-in fade-in duration-700">
      <ToastAlert
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />

      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        <Header />
        <SearchBar onOpenTambah={() => setIsTambahOpen(true)} />

        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-gray-500 font-bold">
            Mengambil data dari server...
          </div>
        ) : (
          <Tabel
            data={dataJadwal}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <Pagination />

        <ModalTambahJadwal
          isOpen={isTambahOpen}
          onClose={() => setIsTambahOpen(false)}
          hook={tambahJadwal}
        />

        <ModalPerbaruiJadwal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          hook={editJadwal}
        />

        <ModalHapusJadwal
          isOpen={isHapusOpen}
          onClose={() => setIsHapusOpen(false)}
          hook={hapusJadwal}
        />
      </div>
    </div>
  );
}

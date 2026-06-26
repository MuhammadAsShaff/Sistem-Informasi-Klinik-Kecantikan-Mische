import { useState } from "react";
import { useFetchJadwal } from "./useFetchJadwal";
import { useTambahJadwal } from "./useTambahJadwal";
import { useEditJadwal } from "./useEditJadwal";
import { useHapusJadwal } from "./useHapusJadwal";

export const useKelolaJadwal = () => {
  const [selectedJadwal, setSelectedJadwal] = useState(null);
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  const { dataJadwal, isLoading, fetchSchedules } = useFetchJadwal();

  const tambahJadwal = useTambahJadwal(
    dataJadwal,
    () => {
      setIsTambahOpen(false);
      fetchSchedules();
      showToast("Jadwal berhasil ditambahkan!");
    },
    isTambahOpen
  );

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

  const hapusJadwal = useHapusJadwal(
    selectedJadwal,
    () => {
      setIsHapusOpen(false);
      fetchSchedules();
      showToast("Jadwal berhasil dihapus!");
    },
    showToast
  );

  const handleEdit = (jadwal) => {
    setSelectedJadwal(jadwal);
    setIsEditOpen(true);
  };

  const handleDelete = (jadwal) => {
    setSelectedJadwal(jadwal);
    setIsHapusOpen(true);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(dataJadwal.length / ITEMS_PER_PAGE);

  const paginatedJadwal = dataJadwal.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
    isLoading,
    paginatedJadwal,
    currentPage,
    setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    isTambahOpen,
    setIsTambahOpen,
    isEditOpen,
    setIsEditOpen,
    isHapusOpen,
    setIsHapusOpen,
    toast,
    setToast,
    tambahJadwal,
    editJadwal,
    hapusJadwal,
    handleEdit,
    handleDelete
  };
};

import { useState } from "react";
import { useFetchReservasi } from "./useFetchReservasi";
import { useUbahStatusReservasi } from "./useUbahStatusReservasi";
import { useHapusReservasi } from "./useHapusReservasi";
import { useTambahReservasi } from "./useTambahReservasi";

export const useKelolaReservasi = () => {
  const [selectedReservasi, setSelectedReservasi] = useState(null);

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isExcelOpen, setIsExcelOpen] = useState(false);

  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { dataReservasi, meta, isLoading, fetchReservasi } = useFetchReservasi(page);

  const filteredReservasi = dataReservasi.filter(item => 
    (item.namaCustomer?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.jenisTreatment?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.dokter?.nama?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.nomorWa?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const ubahStatusHook = useUbahStatusReservasi(
    selectedReservasi,
    () => {
      setIsStatusOpen(false);
      fetchReservasi();
      showToast("Berhasil memperbarui reservasi");
    },
    isStatusOpen
  );

  const hapusHook = useHapusReservasi(
    selectedReservasi,
    () => {
      setIsHapusOpen(false);
      fetchReservasi();
      showToast("Berhasil menghapus reservasi");
    },
    showToast
  );

  const { tambahReservasi, isSubmitting: isTambahSubmitting } = useTambahReservasi(
    (msg) => {
      setIsTambahOpen(false);
      fetchReservasi();
      showToast("Berhasil menambahkan reservasi");
    },
    (errMsg) => {
      showToast(errMsg, "error");
    }
  );

  const handleEditStatus = (item) => {
    setSelectedReservasi(item);
    setIsStatusOpen(true);
  };

  const handleDetail = (item) => {
    setSelectedReservasi(item);
    setIsDetailOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedReservasi(item);
    setIsHapusOpen(true);
  };

  const handleTambahSubmit = (payload) => {
    tambahReservasi(payload);
  };

  return {
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
    showToast,
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
  };
};

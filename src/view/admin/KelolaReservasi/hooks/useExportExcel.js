import { useState } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * CUSTOM HOOK: useExportExcel
 * =========================================================================
 * Hook ini mengelola logika untuk mengunduh laporan reservasi dalam format Excel:
 * 1. Menyimpan state parameter tanggal dan jenis treatment.
 * 2. Mengirim request unduhan ke backend dengan format file Blob (Binary Large Object).
 * 3. Membuat tautan unduhan dinamis di browser dan membersihkan memorinya.
 */
export function useExportExcel(onClose) {
  const [jenisTreatment, setJenisTreatment] = useState('semua'); // State pilihan jenis treatment
  const [tanggalMulai, setTanggalMulai] = useState(''); // Tanggal awal filter
  const [tanggalSelesai, setTanggalSelesai] = useState(''); // Tanggal akhir filter
  const [isExporting, setIsExporting] = useState(false); // Status loading unduh file
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' }); // Toast notifikasi

  // Fungsi memicu unduhan file Excel
  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Kirim request GET ke endpoint laporan excel dengan parameter tanggal & filter
      const response = await axiosClient.get(endpoints.admin.report.reservasi, {
        params: {
          jenisTreatment: jenisTreatment === 'semua' ? '' : jenisTreatment,
          tanggalMulai,
          tanggalSelesai
        },
        responseType: 'blob' // Wajib diset 'blob' agar Axios membaca response sebagai file biner
      });

      // Membuat URL biner temporer dari data biner (blob) yang dikirim backend
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Membuat elemen tautan HTML <a> dinamis di memori browser
      const link = document.createElement('a');
      link.href = url;
      
      // Susun nama file unduhan (misal: Laporan_Reservasi_2026-06-22.xlsx)
      const dateStr = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `Laporan_Reservasi_${dateStr}.xlsx`);
      
      // Masukkan tautan ke halaman DOM, picu klik unduhan otomatis, lalu hapus kembali
      document.body.appendChild(link);
      link.click();
      
      // Bersihkan elemen & cabut URL biner dari memori browser agar tidak bocor memory
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      onClose(); // Tutup modal setelah unduhan berhasil dipicu
    } catch (error) {
      console.error("Gagal melakukan export excel:", error);
      setToast({ isOpen: true, message: "Terjadi kesalahan saat mengunduh file Excel.", type: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    jenisTreatment,
    setJenisTreatment,
    tanggalMulai,
    setTanggalMulai,
    tanggalSelesai,
    setTanggalSelesai,
    isExporting,
    toast,
    setToast,
    handleExport
  };
}

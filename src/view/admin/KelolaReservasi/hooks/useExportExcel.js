import { useState } from 'react';
import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * ASISTEN PEREKAP & PENCETAK BUKU LAPORAN EXCEL (useExportExcel)
 * =========================================================================
 * Ibarat asisten khusus di meja arsip yang bertugas menyalin data kehadiran tamu 
 * dan menyusunnya menjadi buku besar berformat Excel.
 * Tugas utama asisten ini meliputi:
 * 1. Mengingat batas tanggal mulai, tanggal selesai, dan jenis perawatan yang dipilih pimpinan.
 * 2. Mengutus kurir ke kantor pusat untuk meminta bungkusan file biner (Blob).
 * 3. Menyiapkan jembatan penyeberangan sementara di peramban (browser) untuk mengunduh file, 
 *    lalu merobohkan jembatannya kembali agar tidak memenuhi ingatan mesin.
 */
export function useExportExcel(onClose) {
  // Laci penyimpan pilihan jenis perawatan (bisa semua atau satu jenis saja)
  const [jenisTreatment, setJenisTreatment] = useState('semua'); 
  // Kotak kalender penanda tanggal awal pencatatan
  const [tanggalMulai, setTanggalMulai] = useState(''); 
  // Kotak kalender penanda tanggal akhir pencatatan
  const [tanggalSelesai, setTanggalSelesai] = useState(''); 
  // Rambu penanda asisten sedang sibuk menyusun dan mengetik laporan
  const [isExporting, setIsExporting] = useState(false); 
  // Rambu toa pengumuman jika pencetakan buku berhasil atau kandas
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' }); 

  /**
   * TUGAS MEMICU PENCETAKAN BUKU EXCEL (handleExport)
   * Asisten mengemas semua persyaratan kalender lalu meminta kantor pusat mengirim berkas utuh.
   */
  const handleExport = async () => {
    try {
      setIsExporting(true); // Nyalakan lampu tanda mesin pencetak sedang berputar
      
      // Mengutus kurir mengambil bungkusan biner (blob) dari gudang arsip
      const response = await axiosClient.get(endpoints.admin.report.reservasi, {
        params: {
          jenisTreatment: jenisTreatment === 'semua' ? '' : jenisTreatment,
          tanggalMulai,
          tanggalSelesai
        },
        responseType: 'blob' // Wajib diset 'blob' agar sistem menerima paket dalam bentuk buku biner utuh
      });

      // Membuat jembatan penyeberangan sementara (URL) dari paket biner yang diterima
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Menyiapkan kereta gantung (tautan HTML <a>) di memori bayangan
      const link = document.createElement('a');
      link.href = url;
      
      // Memberi stempel nama pada buku laporan (contoh: Laporan_Reservasi_2026-06-22.xlsx)
      const dateStr = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `Laporan_Reservasi_${dateStr}.xlsx`);
      
      // Meluncurkan kereta gantung ke layar utama, menekan tombol unduh, lalu menyingkirkannya
      document.body.appendChild(link);
      link.click();
      
      // Membereskan sisa potongan kabel dan jembatan agar memori komputer tetap lega dan bersih
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      onClose(); // Menutup meja kerja rekapitulasi setelah unduhan meluncur
    } catch (error) {
      console.error("Gagal melakukan export excel:", error);
      setToast({ isOpen: true, message: "Terjadi kesalahan saat mengunduh file Excel.", type: "error" });
    } finally {
      setIsExporting(false); // Matikan lampu tanda mesin pencetak berputar
    }
  };

  // Asisten menyerahkan seluruh laci isian dan saklar pencetak kepada meja kerja utama (view)
  return {
    jenisTreatment, setJenisTreatment,
    tanggalMulai, setTanggalMulai,
    tanggalSelesai, setTanggalSelesai,
    isExporting,
    toast, setToast,
    handleExport
  };
}

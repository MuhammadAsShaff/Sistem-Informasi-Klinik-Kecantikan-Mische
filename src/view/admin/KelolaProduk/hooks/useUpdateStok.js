import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * ASISTEN PENGATUR CEPAT ANGKA STOK (useUpdateStok)
 * Ibarat petugas cekatan yang mengurus tombol tambah (+) dan kurang (-) pada jumlah stok barang.
 * Agar admin tidak menunggu lama, petugas ini langsung mencoret angka lama di etalase dan menggantinya 
 * dengan angka baru (disebut Optimistic Update), sambil mengirim laporan resmi ke gudang pusat di latar belakang.
 */
export function useUpdateStok(updateLocalStock) {
  // Fungsi untuk mengubah angka stok pada suatu barang
  const updateStok = async (id, stock) => {
    // 1. LANGSUNG GANTI ANGKA DI ETALASE (Optimistic UI Update)
    // Tanpa menunggu surat resmi dari gudang pusat, langsung ganti angka di layar agar terasa sangat cepat
    if (updateLocalStock) updateLocalStock(id, stock);
    
    try {
      // 2. MENGIRIM LAPORAN RESMI KE GUDANG PUSAT
      // Petugas mengirim catatan perubahan angka stok ke gudang pusat
      const res = await axiosClient.patch(`${endpoints.admin.products}/${id}`, { stock });
      
      if (res.data?.status === 'success' || res.data?.success) {
        return { success: true, message: res.data.message || 'Berhasil memperbarui stok' };
      }
      return { success: false, message: 'Gagal memperbarui stok' };
    } catch (error) {
      console.error("Gagal update stok:", error);
      // Jika ternyata gudang pusat menolak (misal: koneksi terputus), catat pesan kesalahannya
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui stok';
      return { success: false, message: typeof errorMessage === 'string' ? errorMessage : 'Validasi gagal', errors: error.response?.data?.errors || error.response?.data?.message };
    }
  };

  return { updateStok };
}

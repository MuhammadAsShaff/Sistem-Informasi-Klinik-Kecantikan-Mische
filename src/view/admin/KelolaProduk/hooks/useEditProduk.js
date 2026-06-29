import axiosClient from '@/core/api/axiosClient';
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * ASISTEN PENGUBAH DATA PRODUK (useEditProduk)
 * =========================================================================
 * Ibarat asisten atau kurir khusus di bagian administrasi gudang yang bertugas 
 * membawa map berisi perubahan data barang (nama baru, harga baru, atau foto baru) 
 * untuk diserahkan ke sistem pencatatan pusat (server).
 */
export function useEditProduk(refetch) {
  /*
    FUNGSI MENGIRIM PERUBAHAN KE SERVER (editProduk):
    Menerima nomor ID barang dan berkas formulir lengkap (formData) dari meja admin.
  */
  const editProduk = async (id, formData) => {
    try {
      // Menempelkan stiker khusus '_method = PUT' agar satpam gudang pusat tahu ini adalah berkas pembaruan, bukan barang baru
      formData.append('_method', 'PUT'); 
      
      // Mengirimkan kurir membawa berkas formulir ke alamat server gudang
      const res = await axiosClient.post(`${endpoints.admin.products}/${id}`, formData, {
        headers: {
          // Kotak penanda pengiriman berkas formulir (multipart/form-data)
        },
      });
      
      // Jika gudang pusat menjawab 'success' (berhasil diubah)
      if (res.data?.status === 'success' || res.data?.success) {
        // Beri tahu mandor tabel untuk menyegarkan tampilan (refetch) agar perubahan langsung terlihat
        if (refetch) refetch();
        return { success: true, message: res.data.message || 'Berhasil memperbarui produk' };
      }
      return { success: false, message: 'Gagal memperbarui produk' };
    } catch (error) {
      console.error("Gagal edit produk:", error);
      // Jika terjadi penolakan dari gudang pusat (misal: harga salah atau foto terlalu besar), catat alasannya
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui produk';
      return { success: false, message: typeof errorMessage === 'string' ? errorMessage : 'Validasi gagal', errors: error.response?.data?.errors || error.response?.data?.message };
    }
  };

  return { editProduk };
}


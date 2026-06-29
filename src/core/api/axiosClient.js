import axios from 'axios';
import { API_BASE_URL } from './endpoints';
import { getToken, clearAuth } from '@/core/utils/authStorage';

/* 
 * =========================================================================
 * KONFIGURASI AXIOS CLIENT (SANG KURIR PENGANTAR DATA)
 * =========================================================================
 * File ini adalah pusat pengaturan "Kurir" (Axios) yang bertugas 
 * bolak-balik mengantar data dari Frontend (Mische) ke Backend (Laravel).
 */

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

/* 
 * =========================================================================
 * 1. PENCEGATAN SAAT BERANGKAT (REQUEST INTERCEPTOR)
 * =========================================================================
 * Fungsi ini bertindak sebagai "Satpam Pintu Keluar".
 * Sebelum si kurir berangkat ke Backend, Satpam ini akan menghentikannya 
 * sejenak untuk menitipkan "KTP/Tiket Login" (Token JWT) ke dalam tas si kurir.
 */
axiosClient.interceptors.request.use(
  (config) => {
    // Cek apakah di dompet browser (localStorage) ada Tiket Login (Token)
    const token = getToken();
    
    // Jika ada tiketnya, masukkan tiket tersebut ke dalam tas kurir (Authorization Header)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Silakan berangkat, kurir!
    return config;
  },
  (error) => {
    // Jika kurirnya error sebelum berangkat, laporkan errornya.
    return Promise.reject(error);
  }
);

/* 
 * =========================================================================
 * 2. PENCEGATAN SAAT PULANG (RESPONSE INTERCEPTOR)
 * =========================================================================
 * Fungsi ini bertindak sebagai "Satpam Pintu Masuk".
 * Saat si kurir pulang membawa jawaban dari Backend, Satpam ini akan 
 * mengecek apakah jawabannya sukses atau error.
 */
axiosClient.interceptors.response.use(
  (response) => {
    // Jika sukses (paket sampai dengan selamat), langsung berikan paketnya ke halaman web.
    return response;
  },
  (error) => {
    // Jika kurir pulang membawa laporan ERROR (Gagal)
    if (error.response) {
      const status = error.response.status;

      // ERROR 401 (Ditolak / Sesi Habis):
      // Backend bilang "Tiket Login-nya sudah basi/kedaluwarsa!".
      if (status === 401) {
        console.warn('[Axios] Sesi berakhir. Melakukan auto-logout...');
        
        // Hapus tiket basi dari dompet browser (Logout Paksa)
        clearAuth();

        // Daftar ruangan (halaman) yang wajib pakai tiket
        const protectedPaths = ['/ProfilCustomer', '/reservasi', '/keranjang', '/admin'];
        
        // Cek apakah saat ini kita sedang berada di dalam ruangan wajib tiket tersebut
        const isProtectedPath = protectedPaths.some(path => window.location.pathname.startsWith(path));

        // Jika iya, segera usir (kembalikan) ke halaman Login untuk beli tiket baru
        if (isProtectedPath && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // ERROR 403 (Dilarang Masuk): Misalnya Customer memaksa masuk ke ruang Admin
      if (status === 403) {
        console.warn('[Axios] Anda tidak punya izin (Hak Akses) ke sini.');
      }

      // ERROR 404 (Nyasar): Data atau alamat yang dicari kurir tidak ada di Backend
      if (status === 404) {
        console.warn('[Axios] Alamat atau data tidak ditemukan (404).');
      }

      // ERROR 500 (Server Rusak): Komputer Backend sedang bermasalah/mati
      if (status >= 500) {
        console.error('[Axios] Gawat! Server Backend sedang rusak/down.');
      }
    } else if (error.request) {
      // Jika kurir sudah berangkat tapi Backend sama sekali tidak merespon (Mungkin internet putus)
      console.error('[Axios] Tidak ada sinyal/koneksi. Server tidak merespon.');
    }

    // Kembalikan status Error ini ke halaman supaya bisa dimunculkan Notifikasi Gagal.
    return Promise.reject(error);
  }
);

export default axiosClient;

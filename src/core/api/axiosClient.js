import axios from 'axios';
import { API_BASE_URL } from './endpoints';
import { getToken, clearAuth } from '@/core/utils/authStorage';

/**
 * Konfigurasi Global Axios Client
 * 
 * Scalability features:
 * 1. Base URL terpusat (mudah diubah antara DEV dan PROD)
 * 2. Request Interceptor otomatis menyisipkan Authorization Token (JWT) di setiap request
 * 3. Response Interceptor menangani error secara global (contoh: Token Expired 401)
 */

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
  // timeout: 10000, // Opsional: Batas waktu timeout jika server lambat
});

// === REQUEST INTERCEPTOR ===
// Dipanggil SEBELUM request dikirim ke backend
axiosClient.interceptors.request.use(
  (config) => {
    // Selalu ambil token terbaru setiap kali request dilakukan
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Tangani error sebelum request dikirim
    return Promise.reject(error);
  }
);

// === RESPONSE INTERCEPTOR ===
// Dipanggil SETELAH response diterima dari backend (atau jika terjadi error jaringan/status)
axiosClient.interceptors.response.use(
  (response) => {
    // Lanjutkan response jika sukses (Status 2xx)
    return response;
  },
  (error) => {
    // Global Error Handling
    if (error.response) {
      const status = error.response.status;

      // Sesi Habis / Tidak Valid (Unauthorized)
      if (status === 401) {
        console.warn('[Axios] Sesi berakhir atau token tidak valid. Melakukan auto-logout...');
        // Hapus data dari storage
        clearAuth();

        // Hanya arahkan ke halaman login jika user berada di halaman yang wajib login
        // agar pengunjung di halaman publik (seperti Landing Page, Promo) tidak terganggu.
        const protectedPaths = ['/ProfilCustomer', '/reservasi', '/keranjang', '/admin'];
        const isProtectedPath = protectedPaths.some(path => window.location.pathname.startsWith(path));

        if (isProtectedPath && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // Akses Ditolak (Forbidden)
      if (status === 403) {
        console.warn('[Axios] Anda tidak memiliki hak akses untuk endpoint ini.');
      }

      // Data Tidak Ditemukan (Not Found)
      if (status === 404) {
        console.warn('[Axios] Data atau endpoint yang diminta tidak ditemukan.');
      }

      // Server Error
      if (status >= 500) {
        console.error('[Axios] Terjadi kesalahan fatal pada server backend.');
      }
    } else if (error.request) {
      // Tidak ada response dari server (Misal: Server mati atau koneksi putus)
      console.error('[Axios] Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

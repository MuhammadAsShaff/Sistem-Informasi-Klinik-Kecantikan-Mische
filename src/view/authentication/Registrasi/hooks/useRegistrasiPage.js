import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * =========================================================================
 * ASISTEN PENGAMAT LOKET PENDAFTARAN (useRegistrasiPage)
 * =========================================================================
 * Ibarat petugas tata tertib di depan tenda pendaftaran. Jika ada tamu
 * yang ternyata sudah terdaftar dan memegang tiket resmi (token aktif),
 * petugas ini langsung menyuruhnya melangkah masuk ke balai utama, tanpa perlu ikut antrean mendaftar lagi.
 */
export const useRegistrasiPage = () => {
  // Penunjuk arah untuk memutar haluan tamu
  const navigate = useNavigate();

  // ─── PROSES SIDAK TIKET OTOMATIS (useEffect) ──────────────────────────────
  // Berjalan instan saat tamu melangkah mendekati meja registrasi
  useEffect(() => {
    // Memeriksa brankas saku (localStorage) untuk mencari kunci token
    const token = localStorage.getItem('token');
    
    // Jika tamu tersebut nyata-nyata mengantongi kunci token
    if (token) {
      // Periksa kertas identitas di saku tamu
      const userStr = localStorage.getItem('user');
      // Seragam bawaan jika jabatannya tidak terbaca adalah pengunjung (customer)
      let role = 'customer';
      
      // Jika kertas identitas ditemukan
      if (userStr) {
        try {
          // Buka lipatan kertas identitas
          const user = JSON.parse(userStr);
          // Mengambil gelar jabatan dari kertas
          role = user.role || 'customer';
        } catch (e) {
          // Jika tulisan luntur, biarkan bergelar customer biasa
        }
      }
      
      // Jika pemegang tiket ini adalah seorang Pejabat (admin)
      if (role === 'admin') {
        // Persilakan menuju Balai Kerja Pejabat (/admin)
        navigate('/admin');
      } else {
        // Jika pemegang tiket adalah pengunjung biasa, arahkan ke Beranda utama (/)
        navigate('/');
      }
    }
  }, [navigate]);

  // Serahkan alat penunjuk arah (navigate) ke halaman utama registrasi
  return { navigate };
};


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * =========================================================================
 * ASISTEN PENJAGA PINTU POS MASUK (useLoginPage)
 * =========================================================================
 * Ibarat petugas satpam cerdik yang berjaga di luar pintu masuk utama.
 * Jika ada tamu yang mendekati pos login tapi ternyata di lehernya sudah tergantung
 * kalung tanda pengenal resmi (token aktif), satpam ini langsung melarangnya
 * mengisi formulir lagi dan menyuruhnya masuk langsung ke gedung utama.
 */
export const useLoginPage = () => {
  // Alat navigasi untuk mengarahkan langkah tamu
  const navigate = useNavigate();

  // ─── TUGAS PENGAMATAN INSTAN (useEffect) ──────────────────────────────────
  // Dijalankan seketika saat tamu menginjakkan kaki di halaman login
  useEffect(() => {
    // Mengintip saku tamu (localStorage) apakah ada kunci token yang sah
    const token = localStorage.getItem('token');
    
    // Jika tamu ternyata membawa kunci token
    if (token) {
      // Periksa kartu identitas tambahan di saku tamu
      const userStr = localStorage.getItem('user');
      // Seragam bawaan jika tidak tahu jabatannya adalah pengunjung biasa (customer)
      let role = 'customer';
      
      // Jika kartu identitas ditemukan
      if (userStr) {
        try {
          // Buka lipatan kertas identitas (JSON parse)
          const user = JSON.parse(userStr);
          // Ambil nama jabatan (role) dari kertas tersebut
          role = user.role || 'customer';
        } catch (e) {
          // Jika tulisan di kertas luntur, abaikan dan anggap customer biasa
        }
      }
      
      // Jika jabatannya adalah Pejabat (admin)
      if (role === 'admin') {
        // Persilakan langsung melangkah ke Ruang Pejabat (/admin)
        navigate('/admin');
      } else {
        // Jika jabatannya pengunjung biasa, persilakan masuk ke Beranda (/)
        navigate('/');
      }
    }
  }, [navigate]);

  // Serahkan alat pemandu langkah (navigate) ke halaman utama login
  return { navigate };
};


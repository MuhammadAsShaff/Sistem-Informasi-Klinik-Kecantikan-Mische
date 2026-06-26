import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { saveAuth } from "@/core/utils/authStorage";

// BATAS MAKSIMAL PERCOBAAN LOGIN GAGAL (Rate Limiting)
const MAX_ATTEMPTS = 3;
// WAKTU TUNGGU JIKA TERKUNCI (60 Detik dalam Milidetik)
const LOCKOUT_DURATION = 60 * 1000;

/**
 * =========================================================================
 * CUSTOM HOOK: useLogin
 * =========================================================================
 * Hook ini mengelola seluruh logika bisnis untuk halaman login, meliputi:
 * 1. Penyimpanan input form (email, password).
 * 2. Fitur Keamanan Rate Limiting (Membatasi percobaan login gagal & lockout timer).
 * 3. Kirim request login ke Laravel API & verifikasi role user (Admin/Customer).
 * 
 * Hook ini akan dipanggil oleh LoginForm.jsx untuk mendapatkan data state dan fungsi aksi.
 */
export function useLogin() {
  const navigate = useNavigate();
  // --- 1. STATE INPUT & UI STATUS ---
  const [email, setEmail] = useState(""); // Menyimpan email yang diketik user
  const [password, setPassword] = useState(""); // Menyimpan password yang diketik user
  const [showPassword, setShowPassword] = useState(false); // Menyimpan status tampilkan/sembunyikan password
  const [isLoading, setIsLoading] = useState(false); // Efek loading saat tombol masuk ditekan
  const [errorMessage, setErrorMessage] = useState(""); // Menyimpan pesan kesalahan untuk ditampilkan di UI

  // --- 2. STATE UNTUK RATE LIMIT (PENGUNCIAN AKUN) ---
  const [attempts, setAttempts] = useState(0); // Menghitung berapa kali login gagal
  const [lockoutTime, setLockoutTime] = useState(null); // Menyimpan timestamp kapan akun dikunci
  const [timeLeft, setTimeLeft] = useState(0); // Menghitung detik mundur sisa waktu terkunci

  /**
   * DAUR HIDUP (useEffect) PERTAMA: Inisialisasi awal
   * Membaca history percobaan gagal & status lockout yang tersimpan di localStorage browser.
   * Supaya jika halaman di-refresh, user yang sedang terkunci tetap tidak bisa langsung login.
   */
  useEffect(() => {
    const savedAttempts = parseInt(localStorage.getItem("login_attempts")) || 0;
    const savedLockout = localStorage.getItem("login_lockout_time");
    setAttempts(savedAttempts);
    if (savedLockout) setLockoutTime(parseInt(savedLockout));
  }, []);

  /**
   * DAUR HIDUP (useEffect) KEDUA: Timer Hitung Mundur Lockout
   * Berjalan setiap detik ketika `lockoutTime` (akun terkunci) aktif.
   */
  useEffect(() => {
    let timer;
    if (lockoutTime) {
      timer = setInterval(() => {
        const diff = lockoutTime - Date.now();
        if (diff <= 0) {
          // Jika waktu tunggu sudah habis, reset semua status kunci ke awal
          setLockoutTime(null);
          setAttempts(0);
          setTimeLeft(0);
          localStorage.removeItem("login_lockout_time");
          localStorage.setItem("login_attempts", "0");
          setErrorMessage("");
        } else {
          // Hitung sisa detik mundur (pembulatan ke atas)
          setTimeLeft(Math.ceil(diff / 1000));
        }
      }, 1000);
    }
    // Bersihkan timer ketika komponen di-unmount agar tidak terjadi kebocoran memori
    return () => clearInterval(timer);
  }, [lockoutTime]);

  /**
   * --- 3. FUNGSI UTAMA: handleLogin (SAAT FORM LOGIN DISUBMIT) ---
   */
  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah reload halaman bawaan form HTML

    // Jika user masih dalam masa hukuman/lockout, tolak login dan infokan sisa detik
    if (lockoutTime) {
      setErrorMessage(`Terlalu banyak percobaan gagal. Silakan coba lagi dalam ${timeLeft} detik.`);
      return;
    }

    setErrorMessage(""); // Bersihkan pesan error sebelumnya
    setIsLoading(true); // Tampilkan indikator memproses (loading)

    try {
      // Kirim email & password dalam format JSON ke backend Laravel
      const res = await axiosClient.post(endpoints.auth.login, { email, password });

      // Periksa apakah server merespon dengan token (akses login)
      const hasToken = res.data.token || res.data.access_token || res.data.data?.token;
      const isSuccess = res.data.success !== false;

      if (hasToken && isSuccess) {
        // --- LOGIN BERHASIL ---
        // Bersihkan seluruh status percobaan login gagal di local storage
        setAttempts(0);
        localStorage.removeItem("login_attempts");
        localStorage.removeItem("login_lockout_time");

        const token = res.data.token || res.data.access_token || res.data.data?.token;
        
        // Cari objek user di dalam response API (mengatasi struktur response backend yang bervariasi)
        let userData = null;
        if (res.data.user && res.data.user.role) {
          userData = res.data.user;
        } else if (res.data.data?.user && res.data.data.user.role) {
          userData = res.data.data.user;
        } else if (res.data.data && res.data.data.role) {
          userData = res.data.data;
        } else if (res.data.role) {
          userData = res.data;
        }

        // Jika data user & rolenya langsung dikembalikan oleh endpoint login
        if (userData && userData.role) {
          saveAuth(token, userData); // Simpan token & user data ke localStorage
          navigate(userData.role === "admin" ? "/admin" : "/"); // Redirect sesuai Role
        } else {
          // Jika backend hanya memberi token tanpa info user, simpan token dulu...
          localStorage.setItem("token", token);

          // ...lalu buat request tambahan ke endpoint '/auth/me' untuk mengambil profil & role user
          try {
            const profileRes = await axiosClient.get(endpoints.auth.me, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            const fetchedUser = profileRes.data.data || profileRes.data.user || profileRes.data;
            if (fetchedUser && fetchedUser.role) {
              saveAuth(token, fetchedUser); // Simpan data profil lengkap
              navigate(fetchedUser.role === "admin" ? "/admin" : "/"); // Alihkan halaman
            } else {
              setErrorMessage("Gagal memproses role pengguna dari server.");
            }
          } catch (profileError) {
            console.error("Gagal mengambil profil/role:", profileError);
            setErrorMessage("Koneksi berhasil, namun gagal memverifikasi data profil.");
          }
        }
      } else {
        // Jika server merespon sukses HTTP 200 namun sukses bernilai false
        const msg = res.data.message || "Email atau password yang Anda masukkan salah.";
        setErrorMessage(msg);
      }
    } catch (error) {
      // --- LOGIN GAGAL / ERROR API ---
      console.error("Login error:", error);
      
      // Jika error 429 (Too Many Requests), paksa langsung kunci (langsung limit penuh)
      const isRateLimit = error.response?.status === 429;
      let newAttempts = isRateLimit ? MAX_ATTEMPTS : attempts + 1;

      setAttempts(newAttempts);
      localStorage.setItem("login_attempts", newAttempts.toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        // Jika sudah melebihi 3 kali percobaan gagal, kunci login selama 60 detik
        const lockTime = Date.now() + LOCKOUT_DURATION;
        setLockoutTime(lockTime);
        localStorage.setItem("login_lockout_time", lockTime.toString());
        setTimeLeft(60);
        setErrorMessage("Terlalu banyak percobaan gagal. Akses ditangguhkan selama 60 detik.");
      } else {
        // Tampilkan pesan error. Cek rincian error spesifik dari backend (seperti password kurang kompleks)
        let msg = "Terjadi kesalahan pada server.";
        if (error.response?.data) {
          const data = error.response.data;
          if (data.errors) {
            // Ambil rincian validasi pertama yang error (misal password kurang campuran besar-kecil)
            const firstErrorKey = Object.keys(data.errors)[0];
            const firstErrorVal = data.errors[firstErrorKey];
            msg = Array.isArray(firstErrorVal) ? firstErrorVal[0] : firstErrorVal;
          } else {
            msg = data.message || msg;
          }
        }
        setErrorMessage(`${msg} (Sisa percobaan: ${MAX_ATTEMPTS - newAttempts})`);
      }
    } finally {
      setIsLoading(false); // Matikan loading spin
    }
  };

  // Kembalikan semua state & fungsi agar bisa didestruktur dan digunakan di LoginForm.jsx
  return {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    isLoading,
    errorMessage,
    lockoutTime,
    timeLeft,
    handleLogin,
  };
}

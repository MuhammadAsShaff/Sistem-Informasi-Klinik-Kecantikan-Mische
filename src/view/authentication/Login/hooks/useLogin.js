import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { saveAuth } from "@/core/utils/authStorage";

// ─── ATURAN KEDISIPLINAN GERBANG ─────────────────────────────────────────────
// BATAS MAKSIMAL SALAH KETIK: Jika tamu salah menebak sandi hingga 3 kali
const MAX_ATTEMPTS = 3;
// WAKTU GEMBOK OTOMATIS: Durasi gerbang dikunci mati (60 detik dalam satuan milidetik)
const LOCKOUT_DURATION = 60 * 1000;

/**
 * =========================================================================
 * MANDOR GERBANG UTAMA PEMERIKSA KREDENSIAL (useLogin)
 * =========================================================================
 * Ibarat seorang komandan jaga di gerbang benteng kantor yang super ketat:
 * 1. Mengingat kartu pengenal (email) dan kata sandi rahasia (password) yang disodorkan tamu.
 * 2. Memegang stopwatch gembok keamanan (Rate Limiting): jika tamu salah menebak sandi 3 kali, komandan akan menggembok gerbang selama 60 detik penuh.
 * 3. Mengetuk pintu pusat data (API Login Laravel) untuk memeriksa apakah tamu ini Pejabat (Admin) atau Pengunjung Biasa (Customer), lalu mengawalnya ke balai yang tepat.
 */
export function useLogin() {
  // Alat navigasi pengawal tamu menuju ruangan yang benar
  const navigate = useNavigate();

  // ─── 1. LACI PENYIMPANAN ISIAN FORMULIR & STATUS MEJA ───────────────────────
  // Laci untuk mencatat apa yang diketik tamu di kolom email
  const [email, setEmail] = useState(""); 
  // Laci untuk mencatat sandi rahasia yang diketik tamu di kolom password
  const [password, setPassword] = useState(""); 
  // Tuas saklar untuk menyingkap tirai penutup password (agar teks terlihat atau disamarkan)
  const [showPassword, setShowPassword] = useState(false); 
  // Indikator lampu berputar tanda komandan sedang berlari memeriksa data ke arsip pusat
  const [isLoading, setIsLoading] = useState(false); 
  // Papan tulis kecil untuk mencatat pengumuman penolakan jika paspor salah
  const [errorMessage, setErrorMessage] = useState(""); 

  // ─── 2. LACI CATATAN HITUNG MUNDUR (GEMBOK KEDISIPLINAN) ───────────────────
  // Buku penghitung dosa: mencatat berapa kali tamu ini sudah gagal menebak sandi
  const [attempts, setAttempts] = useState(0); 
  // Stempel waktu kapan komandan pertama kali menutup gembok gerbang
  const [lockoutTime, setLockoutTime] = useState(null); 
  // Angka hitung mundur (dalam detik) yang ditunjukkan ke tamu sebelum gerbang dibuka kembali
  const [timeLeft, setTimeLeft] = useState(0); 

  /**
   * ─── ASISTEN PEMERIKSA BUKU TAMU LAMA (useEffect Pertama) ──────────────────
   * Saat tamu mendatangi meja, asisten ini langsung mengintip ke bawah meja (localStorage browser).
   * Gunanya agar tamu yang sedang dihukum gembok tidak bisa mengakali sistem dengan me-refresh halaman.
   */
  useEffect(() => {
    // Mengintip berapa kali tamu ini pernah gagal sebelumnya
    const savedAttempts = parseInt(localStorage.getItem("login_attempts")) || 0;
    // Mengintip stempel waktu kunci gembok jika masih ada
    const savedLockout = localStorage.getItem("login_lockout_time");
    
    // Salin angka kegagalan ke dalam laci state
    setAttempts(savedAttempts);
    // Jika stempel waktu kunci gembok ditemukan, nyalakan kembali status terkunci di laci
    if (savedLockout) setLockoutTime(parseInt(savedLockout));
  }, []);

  /**
   * ─── ASISTEN PEMEGANG STOPWATCH HITUNG MUNDUR (useEffect Kedua) ────────────
   * Bekerja tanpa lelah setiap 1 detik sekali, khusus ketika gembok gerbang (lockoutTime) sedang aktif.
   */
  useEffect(() => {
    let timer;
    // Jika stempel waktu kunci gembok terisi
    if (lockoutTime) {
      // Nyalakan alarm jam berdetak setiap 1000 milidetik (1 detik)
      timer = setInterval(() => {
        // Hitung jarak waktu antara jadwal buka gembok dengan waktu detik ini
        const diff = lockoutTime - Date.now();
        
        // Jika sisa waktu sudah habis (0 atau minus)
        if (diff <= 0) {
          // Buka gembok gerbang (nol-kan stempel waktu)
          setLockoutTime(null);
          // Putihkan kembali buku catatan dosa kegagalan tamu
          setAttempts(0);
          // Reset angka hitung mundur di layar
          setTimeLeft(0);
          // Buang catatan hukuman dari laci bawah meja (localStorage)
          localStorage.removeItem("login_lockout_time");
          localStorage.setItem("login_attempts", "0");
          // Hapus tulisan pesan peringatan di papan pengumuman
          setErrorMessage("");
        } else {
          // Jika masih ada sisa waktu, bulatkan detiknya ke atas dan pajang di layar
          setTimeLeft(Math.ceil(diff / 1000));
        }
      }, 1000);
    }
    // Jika meja form ditutup atau tamu pergi, matikan alarm jam agar tidak bising (memory leak)
    return () => clearInterval(timer);
  }, [lockoutTime]);

  /**
   * ─── 3. TUGAS EKSEKUSI UTAMA: PROSES MENGETUK PINTU (handleLogin) ──────────
   * Fungsi ini dipicu seketika saat tamu menekan tombol "Login" di formulir.
   */
  const handleLogin = async (e) => {
    // Mencegah kebiasaan kuno meja HTML yang gemar memuat ulang seluruh gedung (refresh page)
    e.preventDefault(); 

    // Jika tamu bersikeras memaksa masuk saat gembok masih terpasang
    if (lockoutTime) {
      // Tegur dengan sopan dan pampang sisa detik gembok
      setErrorMessage(`Terlalu banyak percobaan gagal. Silakan coba lagi dalam ${timeLeft} detik.`);
      return;
    }

    // Bersihkan papan tulis pesan error dari sisa ketikan lama
    setErrorMessage(""); 
    // Nyalakan indikator lampu tanda komandan mulai memproses isian formulir
    setIsLoading(true); 

    try {
      // Mengutus kurir khusus (axiosClient) membawa map berisi email dan sandi ke brankas pusat (Laravel API)
      const res = await axiosClient.post(endpoints.auth.login, { email, password });

      // Memeriksa isi tas kurir saat kembali: apakah ada surat izin resmi (token)?
      const hasToken = res.data.token || res.data.access_token || res.data.data?.token;
      // Memeriksa stempel tanda lolos verifikasi dari kantor pusat
      const isSuccess = res.data.success !== false;

      // Jika surat izin resmi (token) tersedia dan stempelnya lolos
      if (hasToken && isSuccess) {
        // ─── TAMU DISAHKAN MASUK (LOGIN BERHASIL) ─────────────────────────────
        
        // Pemutihan seketika: hapus seluruh riwayat kegagalan dan stempel gembok di laci
        setAttempts(0);
        localStorage.removeItem("login_attempts");
        localStorage.removeItem("login_lockout_time");

        // Ambil surat izin resmi (token) dari dalam map surat
        const token = res.data.token || res.data.access_token || res.data.data?.token;
        
        // Membongkar tas kurir untuk mencari identitas lengkap tamu (mengakomodasi variasi format map dari server)
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

        // Jika identitas tamu dan seragam jabatannya (role) sudah ada di dalam tas
        if (userData && userData.role) {
          // Simpan token dan paspor tamu ke brankas permanen di pos penjagaan (localStorage)
          saveAuth(token, userData); 
          // Persilakan tamu masuk ke ruangan sesuai seragam: Ruang Pejabat (/admin) atau Taman Pengunjung (/)
          navigate(userData.role === "admin" ? "/admin" : "/"); 
        } else {
          // Jika kantor pusat hanya mengirim kunci token tanpa rincian nama/jabatan, simpan kuncinya dulu...
          localStorage.setItem("token", token);

          // ...kemudian utus kurir kedua lari kilat ke loket profil ('/auth/me') untuk menanyakan jabatan tamu ini
          try {
            const profileRes = await axiosClient.get(endpoints.auth.me, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            // Ambil rangkuman data diri tamu dari balasan kurir kedua
            const fetchedUser = profileRes.data.data || profileRes.data.user || profileRes.data;
            if (fetchedUser && fetchedUser.role) {
              // Kunci dan amankan paspor lengkap tersebut ke dalam brankas
              saveAuth(token, fetchedUser); 
              // Antar tamu menuju ruangannya yang tepat
              navigate(fetchedUser.role === "admin" ? "/admin" : "/"); 
            } else {
              // Jika data diri tetap samar, sampaikan teguran ke papan tulis
              setErrorMessage("Gagal memproses role pengguna dari server.");
            }
          } catch (profileError) {
            // Jika kurir kedua tersandung di lorong, catat di buku keluhan
            console.error("Gagal mengambil profil/role:", profileError);
            setErrorMessage("Koneksi berhasil, namun gagal memverifikasi data profil.");
          }
        }
      } else {
        // Jika server menerima ketukan pintu namun menyatakan paspor tidak sah
        const msg = res.data.message || "Email atau password yang Anda masukkan salah.";
        setErrorMessage(msg);
      }
    } catch (error) {
      // ─── KETUKAN DITOLAK / KENDALA JALUR DISTRIBUSI ───────────────────────
      console.error("Login error:", error);
      
      // Jika penolakan berupa kode 429 (Lalu lintas Terlalu Padat), anggap pelanggaran berat dan langsung gembok mati
      const isRateLimit = error.response?.status === 429;
      let newAttempts = isRateLimit ? MAX_ATTEMPTS : attempts + 1;

      // Tambahkan angka dosa kegagalan ke dalam laci dan bawah meja
      setAttempts(newAttempts);
      localStorage.setItem("login_attempts", newAttempts.toString());

      // Jika jumlah dosa sudah genap atau melebihi batas maksimal (3 kali)
      if (newAttempts >= MAX_ATTEMPTS) {
        // Pasang stempel waktu gembok terhitung detik ini ditambah 60 detik ke depan
        const lockTime = Date.now() + LOCKOUT_DURATION;
        setLockoutTime(lockTime);
        localStorage.setItem("login_lockout_time", lockTime.toString());
        // Set penghitung waktu ke angka 60
        setTimeLeft(60);
        // Umumkan pengumuman gembok di papan tulis
        setErrorMessage("Terlalu banyak percobaan gagal. Akses ditangguhkan selama 60 detik.");
      } else {
        // Jika masih dalam batas toleransi, periksa alasan spesifik penolakan dari dalam amplop server
        let msg = "Terjadi kesalahan pada server.";
        if (error.response?.data) {
          const data = error.response.data;
          if (data.errors) {
            // Mengutip kalimat omelan pertama dari staf pemeriksa di pusat
            const firstErrorKey = Object.keys(data.errors)[0];
            const firstErrorVal = data.errors[firstErrorKey];
            msg = Array.isArray(firstErrorVal) ? firstErrorVal[0] : firstErrorVal;
          } else {
            msg = data.message || msg;
          }
        }
        // Pajang omelan tersebut beserta jumlah nyawa (sisa percobaan) yang tersisa
        setErrorMessage(`${msg} (Sisa percobaan: ${MAX_ATTEMPTS - newAttempts})`);
      }
    } finally {
      // Seselesainya urusan (baik berhasil masuk maupun ditolak), matikan lampu indikator loading
      setIsLoading(false); 
    }
  };

  // Serahkan seluruh laci penyimpanan dan tuas kendali ke tangan komponen meja (LoginForm.jsx)
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

import { useState, useEffect } from "react";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { saveAuth } from "@/core/utils/authStorage";

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 60 * 1000; // 60 detik

/**
 * Hook untuk mengelola form login (CREATE session).
 * Termasuk: state form, rate limiting + lockout timer, dan submit ke API.
 *
 * @param {Function} navigate - React Router navigate untuk redirect setelah login
 */
export function useLogin(navigate) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ─── Rate Limiting State ───────────────────────────────────────
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Init dari localStorage (persist antar refresh)
  useEffect(() => {
    const savedAttempts = parseInt(localStorage.getItem("login_attempts")) || 0;
    const savedLockout = localStorage.getItem("login_lockout_time");
    setAttempts(savedAttempts);
    if (savedLockout) setLockoutTime(parseInt(savedLockout));
  }, []);

  // Hitung mundur lockout
  useEffect(() => {
    let timer;
    if (lockoutTime) {
      timer = setInterval(() => {
        const diff = lockoutTime - Date.now();
        if (diff <= 0) {
          setLockoutTime(null);
          setAttempts(0);
          setTimeLeft(0);
          localStorage.removeItem("login_lockout_time");
          localStorage.setItem("login_attempts", "0");
          setErrorMessage("");
        } else {
          setTimeLeft(Math.ceil(diff / 1000));
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTime]);

  // ─── Submit ────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();

    if (lockoutTime) {
      setErrorMessage(`Terlalu banyak percobaan gagal. Silakan coba lagi dalam ${timeLeft} detik.`);
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await axiosClient.post(endpoints.auth.login, { email, password });

      if (res.data.success) {
        // Reset rate limit (login_attempts & lockout bukan bagian auth session)
        setAttempts(0);
        localStorage.removeItem("login_attempts");
        localStorage.removeItem("login_lockout_time");

        const token = res.data.token;

        // Ambil profil untuk menentukan role, lalu simpan sekaligus via saveAuth
        try {
          const profileRes = await axiosClient.get(endpoints.auth.me);
          if (profileRes.data.success) {
            const userData = profileRes.data.data;
            saveAuth(token, userData); // simpan token + user + dispatch event
            navigate(userData.role === "admin" ? "/admin" : "/");
          }
        } catch (profileError) {
          console.error("Gagal mengambil profil/role:", profileError);
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      const isRateLimit = error.response?.status === 429;
      let newAttempts = isRateLimit ? MAX_ATTEMPTS : attempts + 1;

      setAttempts(newAttempts);
      localStorage.setItem("login_attempts", newAttempts.toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockTime = Date.now() + LOCKOUT_DURATION;
        setLockoutTime(lockTime);
        localStorage.setItem("login_lockout_time", lockTime.toString());
        setTimeLeft(60);
        setErrorMessage("Terlalu banyak percobaan gagal. Akses ditangguhkan selama 60 detik.");
      } else {
        const msg = error.response?.data?.message || "Terjadi kesalahan pada server.";
        setErrorMessage(`${msg} (Sisa percobaan: ${MAX_ATTEMPTS - newAttempts})`);
      }
    } finally {
      setIsLoading(false);
    }
  };

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

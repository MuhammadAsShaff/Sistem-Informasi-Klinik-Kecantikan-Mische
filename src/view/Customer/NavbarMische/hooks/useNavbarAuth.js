import { useState, useEffect } from "react";
import { getToken, getUser, AUTH_UPDATED_EVENT } from "@/core/utils/authStorage";

/**
 * =========================================================================
 * PETUGAS LOKET PEMERIKSA KARTU IDENTITAS (useNavbarAuth)
 * =========================================================================
 * Ibarat sekuriti berjaga di loket depan pintu masuk utama:
 * 1. Mengintip catatan dompet tamu (authStorage/localStorage) untuk memverifikasi apakah tamu sudah resmi memiliki izin masuk (isLoggedIn).
 * 2. Memastikan apakah tamu adalah pelanggan biasa atau pemegang kunci mahkota (isAdmin).
 * 3. Senantiasa waspada terhadap siaran pergantian giliran kerja (AUTH_UPDATED_EVENT) agar sapaan di meja loket selalu akurat.
 */
export function useNavbarAuth() {
  const [authState, setAuthState] = useState({ isLoggedIn: false, isAdmin: false });

  const readAuth = () => {
    const token = getToken();
    const user  = getUser();

    setAuthState({
      isLoggedIn: token !== null && user !== null,
      isAdmin:    user?.role === "admin",
    });
  };

  useEffect(() => {
    readAuth();
    window.addEventListener(AUTH_UPDATED_EVENT, readAuth);
    return () => window.removeEventListener(AUTH_UPDATED_EVENT, readAuth);
  }, []);

  return authState;
}

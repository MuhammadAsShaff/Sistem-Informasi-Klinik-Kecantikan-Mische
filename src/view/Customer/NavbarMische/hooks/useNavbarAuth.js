import { useState, useEffect } from "react";
import { getToken, getUser, AUTH_UPDATED_EVENT } from "@/core/utils/authStorage";

/**
 * Hook untuk mengecek status login dan role user secara reaktif.
 * Sumber data: authStorage (localStorage) — tidak ada logic baca/parse langsung.
 * Reaktif terhadap event `AUTH_UPDATED_EVENT` sehingga Navbar otomatis update
 * saat user login / logout / ganti profil dari halaman mana pun.
 *
 * @returns {{ isLoggedIn: boolean, isAdmin: boolean }}
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

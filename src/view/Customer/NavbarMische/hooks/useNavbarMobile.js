import { useState, useCallback } from "react";

/**
 * =========================================================================
 * PETUGAS PEMBUKA PINTU LIPAT (useNavbarMobile)
 * =========================================================================
 * Ibarat satpam khusus pemegang remote pintu samping untuk tamu yang datang
 * membawa layar kecil (ponsel):
 * 1. Menjaga kunci gembok pintu lipat (isMobileMenuOpen).
 * 2. Menarik tirai pembuka saat tombol menu diketuk (openMobileMenu).
 * 3. Menutup kembali tirai saat tamu sudah memilih tujuannya (closeMobileMenu).
 */
export function useNavbarMobile() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMobileMenu = useCallback(() => setIsMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return {
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
  };
}

import { useState, useCallback } from "react";

/**
 * Hook untuk mengelola state mobile menu (drawer/slider).
 * Mengisolasi logic buka-tutup agar NavbarMische.jsx tetap bersih.
 *
 * @returns {{
 *   isMobileMenuOpen: boolean,
 *   openMobileMenu: () => void,
 *   closeMobileMenu: () => void,
 * }}
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

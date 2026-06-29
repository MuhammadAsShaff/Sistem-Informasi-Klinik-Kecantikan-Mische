/**
 * =========================================================================
 * BUKU PETUNJUK ARAH RUANGAN KLINIK (useNavbarLinks)
 * =========================================================================
 * Ibarat peta lipat panduan arah di lobi depan yang mendaftarkan seluruh
 * jalur lorong (Beranda, Produk, Promo, Event, Reservasi, Tentang Kami)
 * agar tamu tidak tersesat saat menelusuri istana klinik Mische.
 */
export const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Produk", href: "/produk" },
  { label: "Promo", href: "/promo" },
  { label: "Event", href: "/event" },
  { label: "Reservasi", href: "/reservasi" },
  {
    label: "Tentang Kami",
    href: "/tentang-kami",
    hasDropdown: true,
    subItems: [
      { label: "Tentang Dokter", href: "/tentang-kami/dokter" },
      { label: "Testimoni", href: "/tentang-kami/testimoni" },
    ],
  },
];

/**
 * Hook untuk mengambil daftar link navigasi.
 * Dipisahkan ke hooks/ agar mudah dikembangkan (misal: fetch dari API).
 *
 * @returns {{ navLinks: Array }}
 */
export function useNavbarLinks() {
  return { navLinks: NAV_LINKS };
}

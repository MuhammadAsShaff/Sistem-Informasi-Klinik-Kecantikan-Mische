/**
 * Data statis daftar link navigasi Navbar Mische.
 * Dipisahkan ke hooks/ agar page/ hanya mengurus tampilan (UI murni).
 *
 * Struktur tiap item:
 * - label       : Teks yang ditampilkan
 * - href        : Path tujuan (react-router)
 * - hasDropdown : Tampilkan ikon panah dan dropdown
 * - subItems    : Daftar sub-menu (opsional)
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
      { label: "Cabang", href: "/tentang-kami/cabang" },
      { label: "Kritik & Saran", href: "/tentang-kami/kritik-saran" },
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

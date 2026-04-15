export const NAV_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Produk', href: '/produk' },
  { label: 'Promo', href: '/promo' },
  { label: 'Event', href: '/event' },
  { label: 'Reservasi', href: '/reservasi' },
  { 
    label: 'Tentang Kami', 
    href: '/tentang-kami', 
    hasDropdown: true,
    subItems: [
      { label: 'Cabang', href: '/tentang-kami/cabang' },
      { label: 'Kritik & Saran', href: '/tentang-kami/kritik-saran' },
    ]
  },
];

//href :Link tujuan nya 
//hasDropdown : link itu ada icon aarownya
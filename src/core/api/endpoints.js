export const API_BASE_URL = 'http://127.0.0.1:8000/api';
export const STORAGE_BASE_URL = 'http://127.0.0.1:8000/storage/';

// Sentralisasi endpoint agar tidak ada hardcode URL string di komponen atau hook
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  admin: {
    users: '/admin/users',
    schedules: '/admin/schedules',
    products: '/admin/product',
    kategori: '/admin/kategori',
    kategoriCount: '/admin/kategori/count-products',
    profile: '/admin/profile',
    clinic: '/admin/clinic',
    kegiatan: '/admin/kegiatan',
    doctors: '/admin/doctors',
    reservations: '/admin/reservations',
    promo: '/admin/promo',
    event: '/admin/event',
    distribusi: {
      customers: '/admin/distribusi/customers',
      promo: '/admin/distribusi/promo',
      event: '/admin/distribusi/event',
    },
    testimonials: '/admin/testimonials',
    penjualan: '/admin/penjualan',
    report: {
      reservasi: '/admin/report/reservasi',
      penjualan: '/admin/report/penjualan',
    },
    dashboard: '/admin/dashboard',
  },
  customer: {
    profile: '/customer/profile',
    booking: '/customer/booking',
    history: '/customer/history',
    clinic: '/customer/clinic',
    dokter: '/customer/doctors',
    kegiatan: '/customer/kegiatan',
    schedules: '/customer/schedules',
    reservations: '/customer/reservations',
    promo: '/customer/promo',
    promoCheck: '/customer/promo/check',
    event: '/customer/event',
    testimonials: '/customer/testimonials',
    product: '/customer/product',
    productCategories: '/customer/product/categories',
    cart: '/customer/card', // Menggunakan 'card' sesuai prefix di route PHP
    alamat: '/customer/alamat',
    setAlamatUtama: '/customer/profile/alamat-utama',
    rajaongkirCostByAddress: '/customer/rajaongkir/cost-by-address',
    checkout: '/customer/penjualan/checkout',
    checkStatus: '/customer/penjualan/check-status', // NEW for Midtrans Pull Method
    riwayatPembelian: '/customer/penjualan', // NEW
    konfirmasiDiterima: '/customer/penjualan', // NEW
  },
  public: {
    products: '/products',
    services: '/services',
    promos: '/promos',
  }
};

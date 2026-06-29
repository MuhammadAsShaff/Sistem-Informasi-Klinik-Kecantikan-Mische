/**
 * =========================================================================
 * BUKU INDUK ALAMAT RUTE & KOTAK POS (endpoints)
 * =========================================================================
 * Ibarat buku telepon tebal berkulit emas di meja operator komunikasi klinik.
 * Di dalamnya tersimpan seluruh daftar alamat loket tujuan di kantor pusat (Backend Laravel):
 * - Alamat laci untuk mengambil produk (/admin/product)
 * - Alamat loket untuk memeriksa data tamu (/admin/users)
 * Dengan buku pintar ini, para asisten kurir (Axios) tidak perlu menghafal atau mengetik ulang alamat panjang satu per satu!
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL || 'http://127.0.0.1:8000/storage/';

// Buku alamat pusat (Kamus URL). Semua alamat API dikumpulkan di sini supaya kita tidak perlu mengetik ulang alamat yang sama satu per satu di setiap halaman.
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

export const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
    products: '/admin/products',
    profile: '/admin/profile',
    clinic: '/admin/clinic',
    kegiatan: '/admin/kegiatan',
    // Tambahkan endpoint admin lainnya di sini...
  },
  customer: {
    profile: '/customer/profile',
    booking: '/customer/booking',
    history: '/customer/history',
    clinic: '/customer/clinic',
    dokter: '/customer/dokter',
    kegiatan: '/customer/kegiatan',
  },
  public: {
    products: '/products',
    services: '/services',
    promos: '/promos',
  }
};

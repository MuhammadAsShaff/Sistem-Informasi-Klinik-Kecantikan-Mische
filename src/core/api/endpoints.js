export const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Sentralisasi endpoint agar tidak ada hardcode URL string di komponen atau hook
export const endpoints = {
  auth: {
    login: '/login',
    register: '/register',
    logout: '/logout',
    me: '/me', // Jika ada endpoint untuk mengecek sesi saat ini
  },
  admin: {
    users: '/admin/users',
    schedules: '/admin/schedules',
    products: '/admin/products',
    profile: '/admin/profile',
    clinic: '/admin/clinic',
    // Tambahkan endpoint admin lainnya di sini...
  },
  customer: {
    profile: '/customer/profile',
    booking: '/customer/booking',
    history: '/customer/history',
    // Tambahkan endpoint customer lainnya di sini...
  },
  public: {
    products: '/products',
    services: '/services',
    promos: '/promos',
  }
};

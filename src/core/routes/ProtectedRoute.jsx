import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Route guard untuk membatasi akses berdasarkan token & roles.
 * @param {Array<string>} allowedRoles - Daftar role yang diizinkan (misal: ['admin', 'kasir'])
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userDataString = localStorage.getItem('user');

  // 1. Jika pengguna belum login (tidak punya token/data)
  if (!token || !userDataString) {
    // Redirection ke login (Atau bisa render Page404 agar rahasia)
    return <Navigate to="/login" replace />;
  }

  // 2. Jika pengguna sudah login, periksa rolenya
  try {
    const user = JSON.parse(userDataString);
    
    // Jika rute butuh role spesifik dan role pengguna tidak cocok
    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        // Redirection ke home/404 jika ditolak akses
        return <Navigate to="/" replace />; 
      }
    }
  } catch (err) {
    // Error parsing JSON = Sesi rusak, paksa login ulang
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  // 3. Lulus verifikasi, tampilkan halaman!
  return <Outlet />;
};

export default ProtectedRoute;

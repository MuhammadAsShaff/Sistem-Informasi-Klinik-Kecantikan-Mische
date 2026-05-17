import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken, getUser, clearAuth } from '@/core/utils/authStorage';

/**
 * Route guard untuk membatasi akses berdasarkan token & roles.
 * @param {Array<string>} allowedRoles - Daftar role yang diizinkan (misal: ['admin', 'kasir'])
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const token = getToken();
  const user  = getUser();

  // 1. Jika pengguna belum login (tidak punya token/data)
  if (!token || !user) {
    // Redirection ke login (Atau bisa render Page404 agar rahasia)
    return <Navigate to="/login" replace />;
  }

  // 2. Jika pengguna sudah login, periksa rolenya
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // Redirection ke home/404 jika ditolak akses
      return <Navigate to="/" replace />;
    }
  }

  // 3. Lulus verifikasi, tampilkan halaman!
  return <Outlet />;
};

export default ProtectedRoute;

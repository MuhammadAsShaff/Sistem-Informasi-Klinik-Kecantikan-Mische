import React from 'react';
import { Outlet } from 'react-router-dom';
import Page404 from './Page404';

const ProtectedRoute = ({ allowedRoles }) => {
  // MENGAMBIL DATA SESI DARI BROWSER
  const token = localStorage.getItem('token');
  const userDataString = localStorage.getItem('user');

  // 1. JIKA BELUM LOGIN
  if (!token || !userDataString) {
    // Memberikan tampilan 404 (Sama rata untuk yang belum login agar rahasia sistem terjaga)
    return <Page404 />;
  }

  // 2. JIKA SUDAH LOGIN, CEK ROLE (HAK AKSES)
  const user = JSON.parse(userDataString);
  
  // Jika rute ini punya syarat role khusus (contoh: ['admin'])
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // Jika rolenya tidak cocok, berikan 404
      return <Page404 />;
    }
  }

  // 3. JIKA LULUS SEMUA CEK (Punya Akses)
  return <Outlet />;
};

export default ProtectedRoute;

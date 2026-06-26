import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken, getUser, clearAuth } from '@/core/utils/authStorage';

/* 
 * =========================================================================
 * PROTECTED ROUTE (SATPAM PENJAGA PINTU HALAMAN)
 * =========================================================================
 * File ini bertugas sebagai "Satpam" yang menjaga halaman-halaman rahasia/penting
 * (seperti halaman Admin atau halaman Profil Customer). 
 * 
 * Cara kerjanya:
 * Setiap kali ada orang yang mau membuka halaman tersebut, Satpam ini akan 
 * mencegatnya terlebih dahulu untuk mengecek "KTP" (Data User) dan "Tiket Masuk" (Token).
 */

const ProtectedRoute = ({ allowedRoles }) => {
  // Mengecek saku pengunjung: Apakah dia bawa Tiket (Token) dan KTP (Data User)?
  const token = getToken();
  const user  = getUser();

  // =========================================================================
  // PENGECEKAN 1: APAKAH DIA PUNYA TIKET? (SUDAH LOGIN BELUM?)
  // =========================================================================
  if (!token || !user) {
    // Jika tidak punya tiket sama sekali, Satpam akan langsung mengusir 
    // dia kembali ke halaman Login untuk mengambil tiket.
    return <Navigate to="/login" replace />;
  }

  // =========================================================================
  // PENGECEKAN 2: APAKAH JABATANNYA COCOK? (ROLE CHECK)
  // =========================================================================
  // allowedRoles adalah "Daftar Tamu VIP" yang diizinkan masuk (misal: ['admin'])
  if (allowedRoles && allowedRoles.length > 0) {
    
    // Menyamakan format tulisan jabatan (dibuat huruf kecil semua) agar sistem tidak salah baca
    // Contoh: tulisan "Admin" atau " ADMIN " disamakan menjadi "admin"
    const userRoleNormalized = user.role ? user.role.toLowerCase().trim() : "";
    
    // Mengecek apakah jabatan si pengunjung terdaftar di dalam "Daftar Tamu VIP"
    const hasAccess = allowedRoles.some(
      (role) => role.toLowerCase().trim() === userRoleNormalized
    );
    
    if (!hasAccess) {
      // Jika jabatannya tidak terdaftar (Contoh: Customer memaksa masuk ke ruang Admin),
      // maka Satpam akan menolaknya dan membuang/mengembalikan dia ke halaman utama (Home).
      console.warn(`[Satpam] Akses ditolak. Jabatan "${user.role}" tidak boleh masuk ke sini.`);
      return <Navigate to="/" replace />;
    }
  }

  // =========================================================================
  // LULUS PEMERIKSAAN! (OUTLET)
  // =========================================================================
  // Jika pengunjung terbukti punya tiket (Login) DAN jabatannya sesuai (Admin/Customer), 
  // Satpam akan membukakan pintu utama (<Outlet />) agar dia bisa masuk melihat isi halamannya.
  return <Outlet />;
};

export default ProtectedRoute;

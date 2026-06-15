import React from 'react';
import { Routes, Route } from "react-router-dom";

// Layout
import CustomerLayout from "@/view/Customer/CustomerLayout";
import AdminLayout from "@/view/admin/AdminLayout";

// Customer Pages
import LandingPage from "@/view/Customer/LandingPage/page/landingPage";
import HalamanPromo from "@/view/Customer/HalamanPromo/Index";
import PromoDetail from "@/view/Customer/HalamanPromo/page/PromoDetail";
import ReservasiPage from "@/view/Customer/ReservasiPage/page/Index";
import HalamanEvent from "@/view/Customer/HalamanEvent/Index";
import EventDetail from "@/view/Customer/HalamanEvent/page/EventDetail";
import LoginPage from "@/view/authentication/Login/page/Index";
import RegistrasiPage from "@/view/authentication/Registrasi/page/Index";
import TentangKamiPage from "@/view/Customer/TentangKami/page/Index";
import TentangDokterDropdown from "@/view/Customer/TentangDokter/page/TentangDokterDropdown";
import DetailDokterPage from "@/view/Customer/TentangDokter/page/DetailDokter";
import HalamanTestimoni from "@/view/Customer/HalamanTestimoni/page/Index";
import DetailTestimoni from "@/view/Customer/HalamanTestimoni/page/DetailTestimoni";
import ProfilCustomerPage from "@/view/Customer/ProfilCustomer/page/Index";
import RiwayatReservasiPage from "@/view/Customer/ProfilCustomer/page/RiwayatReservasi";
import HalamanProduk from "@/view/Customer/HalamanProduk/page/Index";
import DetailProduk from "@/view/Customer/HalamanProduk/page/DetailProduk";
import DetailKeranjang from "@/view/Customer/DetailKeranjang/Index";

// Admin Pages
import AdminDashboard from "@/view/admin/dashboard/page/Index";
import KelolaUser from "@/view/admin/KelolaUser/page/Index";
import KelolaJadwalReservasiTreatment from "@/view/admin/KelolaJadwalReservasiTreatment/page/Index";
import KelolaProfilKlinik from "@/view/admin/KelolaProfilKlinik/page/Index";
import KelolaProfilAdmin from "@/view/admin/KelolaProfilAdmin/page/Index";
import KelolaTestimoni from "@/view/admin/KelolaTestimoni/Index";
import KelolaProduk from "@/view/admin/KelolaProduk/Index";
import KelolaPenjualan from "@/view/admin/KelolaPenjualan/Index";

// Core Routing & Shared Components
import ProtectedRoute from "./ProtectedRoute";
import KelolaProfilDokter from "@/view/admin/KelolaProfilDokter/Index";
import KelolaPromo from "@/view/admin/KelolaPromo/Index";
import KelolaEvent from "@/view/admin/KelolaEvent/Index";
import KelolaReservasi from "@/view/admin/KelolaReservasi/Index";
import KelolaKategoriProduk from "@/view/admin/KelolaKategoriProduk/Index";
import Page404 from "@/view/components/Page404";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= AUTH ROUTES ================= */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registrasi" element={<RegistrasiPage />} />

      {/* ================= CUSTOMER ROUTES ================= */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<LandingPage />} /> 
        <Route path="promo" element={<HalamanPromo />} />
        <Route path="promo/:id" element={<PromoDetail />} />
        <Route path="event" element={<HalamanEvent />} />
        <Route path="event/:id" element={<EventDetail />} />
        <Route path="tentang-kami" element={<TentangKamiPage />} />
        <Route path="tentang-kami/dokter" element={<TentangDokterDropdown />} />
        <Route path="tentang-kami/testimoni" element={<HalamanTestimoni />} />
        <Route path="tentang-kami/testimoni/:id" element={<DetailTestimoni />} />
        <Route path="dokter/:id" element={<DetailDokterPage />} />
        <Route path="produk" element={<HalamanProduk />} />
        <Route path="produk/:id" element={<DetailProduk />} />
        <Route path="keranjang" element={<DetailKeranjang />} />
        
        {/* Rute Customer yang Wajib Login */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="ProfilCustomer" element={<ProfilCustomerPage />} />
          <Route path="ProfilCustomer/riwayat-reservasi" element={<RiwayatReservasiPage />} />
          <Route path="reservasi" element={<ReservasiPage />} />
        </Route>
      </Route>

      {/* ================= ADMIN ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="promo" element={<KelolaPromo />} />
          <Route path="event" element={<KelolaEvent />} />
          <Route path="kelolauser" element={<KelolaUser />} />
          <Route path="jadwal" element={<KelolaJadwalReservasiTreatment />} />
          <Route path="profildokter" element={<KelolaProfilDokter />} />
          <Route path="profilklinik" element={<KelolaProfilKlinik />} />
          <Route path="profiladmin" element={<KelolaProfilAdmin />} />
          <Route path="reservasi" element={<KelolaReservasi />} />
          <Route path="testimoni" element={<KelolaTestimoni />} />
          <Route path="produk" element={<KelolaProduk />} />
          <Route path="kategori" element={<KelolaKategoriProduk />} />
          <Route path="penjualan" element={<KelolaPenjualan />} />
        </Route>
      </Route>

      {/* ================= CATCH-ALL (404 NOT FOUND) ================= */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

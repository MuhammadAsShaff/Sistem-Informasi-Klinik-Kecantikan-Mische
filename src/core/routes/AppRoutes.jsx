import React from 'react';
import { Routes, Route } from "react-router-dom";

// Layout
import CustomerLayout from "@/view/Customer/CustomerLayout";
import AdminLayout from "@/view/admin/AdminLayout";

// Customer Pages
import LandingPage from "@/view/Customer/LandingPage/page/landingPage";
import PromoPage from "@/view/Customer/promoPage/page/promoPage";
import ProdukPage from "@/view/Customer/produkPage/page/produkPage";
import ReservasiPage from "@/view/Customer/ReservasiPage/page/Index";
import EventPage from "@/view/Customer/EventPage/page/eventPage";
import LoginPage from "@/view/authentication/Login/page/Index";
import RegistrasiPage from "@/view/authentication/Registrasi/page/Index";
import TentangKamiPage from "@/view/Customer/TentangKami/page/Index";
import TentangDokterDropdown from "@/view/Customer/TentangDokter/page/TentangDokterDropdown";
import DetailDokterPage from "@/view/Customer/TentangDokter/page/DetailDokter";
import ProfilCustomerPage from "@/view/Customer/ProfilCustomer/page/Index";

// Admin Pages
import AdminDashboard from "@/view/admin/dashboard/page/dashboard";
import AdminProduk from "@/view/admin/Produk/page/Index";
import KelolaUser from "@/view/admin/KelolaUser/page/Index";
import KelolaJadwalReservasiTreatment from "@/view/admin/KelolaJadwalReservasiTreatment/page/Index";
import KelolaProfilKlinik from "@/view/admin/KelolaProfilKlinik/page/Index";
import KelolaProfilAdmin from "@/view/admin/KelolaProfilAdmin/page/Index";

// Core Routing & Shared Components
import ProtectedRoute from "./ProtectedRoute";
import KelolaProfilDokter from "@/view/admin/KelolaProfilDokter/Index";
import KelolaPromo from "@/view/admin/KelolaPromo/Index";
import Page404 from "@/view/components/Page404";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= CUSTOMER ROUTES ================= */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<LandingPage />} /> 
        <Route path="promo" element={<PromoPage />} />
        <Route path="produk" element={<ProdukPage />} />
        <Route path="reservasi" element={<ReservasiPage />} />
        <Route path="event" element={<EventPage />} />
        <Route path="tentang-kami" element={<TentangKamiPage />} />
        <Route path="tentang-kami/dokter" element={<TentangDokterDropdown />} />
        <Route path="dokter/:id" element={<DetailDokterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="registrasi" element={<RegistrasiPage />} />
        
        {/* Rute Customer yang Wajib Login */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="ProfilCustomer" element={<ProfilCustomerPage />} />
        </Route>
      </Route>

      {/* ================= ADMIN ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="produk" element={<AdminProduk />} />
          <Route path="promo" element={<KelolaPromo />} />
          <Route path="kelolauser" element={<KelolaUser />} />
          <Route path="jadwal" element={<KelolaJadwalReservasiTreatment />} />
          <Route path="profildokter" element={<KelolaProfilDokter />} />
          <Route path="profilklinik" element={<KelolaProfilKlinik />} />
          <Route path="profiladmin" element={<KelolaProfilAdmin />} />
        </Route>
      </Route>

      {/* ================= CATCH-ALL (404 NOT FOUND) ================= */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

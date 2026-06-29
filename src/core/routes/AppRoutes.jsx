import React from 'react';
import { Routes, Route } from "react-router-dom";

/**
 * =========================================================================
 * PETUGAS PENGATUR LALU LINTAS & PETA LORONG (AppRoutes)
 * =========================================================================
 * Ibarat kepala petugas pengatur arah dan rambu-rambu di pintu gerbang utama istana klinik.
 * File ini memegang "Peta Induk" seluruh ruangan dan lorong di Mische:
 * - Jika tamu melangkah ke lorong "/promo", petugas mengarahkannya ke Ruang Pameran Promo.
 * - Jika admin masuk ke lorong rahasia "/admin/dashboard", petugas memeriksa kunci dan membawanya ke Balai Kendali Admin.
 * Tanpa petugas ini, semua tamu dan dokter akan tersesat di lorong kosong!
 */

// Layout
import CustomerLayout from "@/view/Customer/CustomerLayout/page";
import AdminLayout from "@/view/admin/AdminLayout/page";

// Customer Pages
import LandingPage from "@/view/Customer/LandingPage/page/landingPage";
import HalamanPromo from "@/view/Customer/HalamanPromo/page";
import PromoDetail from "@/view/Customer/HalamanPromo/page/PromoDetail";
import DetailJenisPerawatan from "@/view/Customer/DetailJenisPerawatan/page";
import ReservasiPage from "@/view/Customer/ReservasiPage/page";
import HalamanEvent from "@/view/Customer/HalamanEvent/page";
import EventDetail from "@/view/Customer/HalamanEvent/page/EventDetail";
import LoginPage from "@/view/authentication/Login/page";
import RegistrasiPage from "@/view/authentication/Registrasi/page";
import TentangKamiPage from "@/view/Customer/TentangKami/page";
import TentangDokterDropdown from "@/view/Customer/TentangDokter/page/TentangDokterDropdown";
import DetailDokterPage from "@/view/Customer/TentangDokter/page/DetailDokter";
import HalamanTestimoni from "@/view/Customer/HalamanTestimoni/page";
import DetailTestimoni from "@/view/Customer/HalamanTestimoni/page/DetailTestimoni";
import ProfilCustomerPage from "@/view/Customer/ProfilCustomer/page";
import RiwayatReservasiPage from "@/view/Customer/ProfilCustomer/page/RiwayatReservasi";
import RiwayatPembelianPage from "@/view/Customer/ProfilCustomer/page/RiwayatPembelian";
import HalamanProduk from "@/view/Customer/HalamanProduk/page";
import DetailProduk from "@/view/Customer/HalamanProduk/page/DetailProduk";
import DetailKeranjang from "@/view/Customer/DetailKeranjang/page";

// Admin Pages
import AdminDashboard from "@/view/admin/dashboard/page";
import KelolaUser from "@/view/admin/KelolaUser/page";
import KelolaJadwalReservasiTreatment from "@/view/admin/KelolaJadwalReservasiTreatment/page";
import KelolaProfilKlinik from "@/view/admin/KelolaProfilKlinik/page";
import KelolaProfilAdmin from "@/view/admin/KelolaProfilAdmin/page";
import KelolaTestimoni from "@/view/admin/KelolaTestimoni/page";
import KelolaProduk from "@/view/admin/KelolaProduk/page";
import KelolaPenjualan from "@/view/admin/KelolaPenjualan/page";

// Core Routing & Shared Components
import ProtectedRoute from "./ProtectedRoute";
import KelolaProfilDokter from "@/view/admin/KelolaProfilDokter/page";
import KelolaPromo from "@/view/admin/KelolaPromo/page";
import KelolaEvent from "@/view/admin/KelolaEvent/page";
import KelolaReservasi from "@/view/admin/KelolaReservasi/page";
import KelolaKategoriProduk from "@/view/admin/KelolaKategoriProduk/page";
import Page404 from "@/view/components/Page404/page";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= AUTH ROUTES ================= */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registrasi" element={<RegistrasiPage />} />

      {/* ================= CUSTOMER ROUTES ================= */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<LandingPage />} /> 
        <Route path="perawatan/:id" element={<DetailJenisPerawatan />} />
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
        {/* Rute Customer yang Wajib Login */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="ProfilCustomer" element={<ProfilCustomerPage />} />
          <Route path="ProfilCustomer/riwayat-reservasi" element={<RiwayatReservasiPage />} />
          <Route path="ProfilCustomer/riwayat-pembelian" element={<RiwayatPembelianPage />} />
          <Route path="reservasi" element={<ReservasiPage />} />
          <Route path="keranjang" element={<DetailKeranjang />} />
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

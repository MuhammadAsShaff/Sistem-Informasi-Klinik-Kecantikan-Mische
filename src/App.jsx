import { Routes, Route } from "react-router-dom";

// Layout
import CustomerLayout from "./Customer/CustomerLayout";
import AdminLayout from "./admin/AdminLayout";

// Customer Pages
import LandingPage from "./Customer/LandingPage/landingPage";
import PromoPage from "./Customer/promoPage/promoPage";
import ProdukPage from "./Customer/produkPage/produkPage";
import ReservasiPage from "./Customer/ReservasiPage/Index";
import EventPage from "./Customer/EventPage/eventPage";
import LoginPage from "./authentication/Login";
import RegistrasiPage from "./authentication/Registrasi";
import TentangKamiPage from "./Customer/TentangKami";
import ProfilCustomerPage from "./Customer/ProfilCustomer/Index";
import ProtectedRoute from "./authentication/ProtectedRoute";
import Page404 from "./authentication/Page404";

// Admin Pages
import AdminDashboard from "./admin/dashboard/dashboard";
import AdminProduk from "./admin/Produk/Index";
import KelolaUser from "./admin/KelolaUser/index";
import KelolaJadwalReservasiTreatment from "./admin/KelolaJadwalReservasiTreatment/Index";
import KelolaProfilKlinik from "./admin/KelolaProfilKlinik/Index";

export default function App() {
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
        <Route path="login" element={<LoginPage />} />
        <Route path="registrasi" element={<RegistrasiPage />} />
        
        {/* Rute Customer yang Wajib Login */}
        <Route element={<ProtectedRoute />}>
          <Route path="ProfilCustomer" element={<ProfilCustomerPage />} />
        </Route>
      </Route>


      {/* ================= ADMIN ROUTES ================= */}
      {/* Menggunakan ProtectedRoute untuk membungkus halaman Admin */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="produk" element={<AdminProduk />} />
          <Route path="kelolauser" element={<KelolaUser />} />
          <Route path="jadwal" element={<KelolaJadwalReservasiTreatment />} />
          <Route path="profilklinik" element={<KelolaProfilKlinik />} />
        </Route>
      </Route>

      {/* ================= CATCH-ALL (404 NOT FOUND) ================= */}
      <Route path="*" element={<Page404 />} />

    </Routes>
  );
}

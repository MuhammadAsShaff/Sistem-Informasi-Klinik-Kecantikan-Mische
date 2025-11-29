import { Routes, Route } from "react-router-dom";

// Layout
import CustomerLayout from "./Customer/CustomerLayout";
import AdminLayout from "./admin/AdminLayout";

// Customer Pages
import LandingPage from "./Customer/LandingPage/LandingPage";
import PromoPage from "./Customer/promoPage/promoPage";
import ProdukPage from "./Customer/produkPage/produkPage";
import ReservasiPage from "./Customer/reservasiPage/reservasiPage";
import EventPage from "./Customer/eventPage/eventPage";

// Admin Pages
import AdminDashboard from "./admin/dashboard/dashboard";
import AdminProduk from "./admin/produk/produk";
import AdminReservasi from "./admin/reservasi/reservasi";

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
      </Route>


      {/* ================= ADMIN ROUTES ================= */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="produk" element={<AdminProduk />} />
        <Route path="reservasi" element={<AdminReservasi />} />
      </Route>

    </Routes>
  );
}

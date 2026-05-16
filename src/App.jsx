import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

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
import KelolaProfilKlinik from "./admin/KelolaProfilKlinik/index";
import KelolaProfilAdmin from "./admin/KelolaProfilAdmin/Index";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Setup Global Axios Interceptor untuk menangani 401 Unauthorized
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token tidak valid atau user dihapus, hapus sesi dan arahkan ke login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  // Cek validitas sesi ke backend pada setiap perubahan halaman
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://127.0.0.1:8000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Opsional: Perbarui data user di localStorage jika ada perubahan dari backend
          if (res.data && res.data.data) {
            localStorage.setItem('user', JSON.stringify(res.data.data));
          }
        } catch (error) {
          // Jika gagal (terutama 401), interceptor di atas akan otomatis logout-kan
          console.error("Session check failed, user might be deleted or token expired");
        }
      }
    };

    checkSession();
  }, [location.pathname]);

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
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
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
          <Route path="profiladmin" element={<KelolaProfilAdmin />} />
        </Route>
      </Route>

      {/* ================= CATCH-ALL (404 NOT FOUND) ================= */}
      <Route path="*" element={<Page404 />} />

    </Routes>
  );
}

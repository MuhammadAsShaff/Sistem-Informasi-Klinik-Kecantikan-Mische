import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "@/core/routes/AppRoutes";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";
import { getToken, saveUser } from "@/core/utils/authStorage";
import { CartProvider } from "@/core/context/CartContext";

export default function App() {
  const location = useLocation();

  // Cek validitas sesi ke backend pada setiap perubahan halaman dan pastikan scroll di atas
  useEffect(() => {
    window.scrollTo(0, 0);

    const checkSession = async () => {
      const token = getToken();
      if (token) {
        try {
          const res = await axiosClient.get(endpoints.auth.me);
          
          // Opsional: Perbarui data user di localStorage jika ada perubahan dari backend
          if (res.data && res.data.data) {
            saveUser(res.data.data, true); // silent=true: tidak perlu dispatch event di sini
          }
        } catch (error) {
          // Jika gagal (terutama 401), interceptor di axiosClient akan otomatis logout-kan
          console.error("Session check failed, user might be deleted or token expired");
        }
      }
    };

    checkSession();
  }, [location.pathname]);

  return (
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  );
}

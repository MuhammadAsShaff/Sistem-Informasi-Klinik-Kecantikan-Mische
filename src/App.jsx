import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "@/core/routes/AppRoutes";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

export default function App() {
  const location = useLocation();

  // Cek validitas sesi ke backend pada setiap perubahan halaman
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axiosClient.get(endpoints.auth.me);
          
          // Opsional: Perbarui data user di localStorage jika ada perubahan dari backend
          if (res.data && res.data.data) {
            localStorage.setItem('user', JSON.stringify(res.data.data));
          }
        } catch (error) {
          // Jika gagal (terutama 401), interceptor di axiosClient akan otomatis logout-kan
          console.error("Session check failed, user might be deleted or token expired");
        }
      }
    };

    checkSession();
  }, [location.pathname]);

  return <AppRoutes />;
}

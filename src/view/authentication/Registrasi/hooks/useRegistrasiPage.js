import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useRegistrasiPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userStr = localStorage.getItem('user');
      let role = 'customer';
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          role = user.role || 'customer';
        } catch (e) {}
      }
      
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  return { navigate };
};

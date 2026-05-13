import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Banner from './Banner';
import ProfilForm from './ProfilForm';
import ToastAlert from '../../components/ToastAlert';

export default function KelolaProfilAdmin() {
  const [userData, setUserData] = useState(null);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  // Ambil data instan dari localStorage untuk menghindari layar kosong
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8000/api/admin/profile', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      if (res.data.success) {
        setUserData(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
        window.dispatchEvent(new Event('user-profile-updated'));
      } else {
        setToast({ isOpen: true, message: res.data.message || 'Gagal memuat profil', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const payload = { ...formData };
      
      // Jika password kosong, hapus dari payload agar backend tidak memvalidasi min:8
      if (!payload.password || payload.password.trim() === '') {
        delete payload.password;
      }

      const res = await axios.put('http://127.0.0.1:8000/api/admin/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      if (res.data.success) {
        setToast({ isOpen: true, message: 'Profil berhasil diperbarui!', type: 'success' });
        setUserData(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
        window.dispatchEvent(new Event('user-profile-updated'));
      }
    } catch (error) {
      let errorMsg = 'Gagal memperbarui profil.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
        if (error.response.data.errors) {
            errorMsg = Object.values(error.response.data.errors)[0][0];
        }
      }
      setToast({ isOpen: true, message: errorMsg, type: 'error' });
    }
  };

  return (
    <div className="w-full bg-white p-6 md:p-10">
      <ToastAlert 
        isOpen={toast.isOpen} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, isOpen: false })} 
      />
      <div className="max-w-5xl mx-auto">
        <Header />
        <Banner user={userData} />
        <ProfilForm 
          user={userData} 
          onUpdate={handleUpdateProfile} 
          onToast={(msg, type) => setToast({ isOpen: true, message: msg, type: type })}
          onUserUpdated={(updatedUser) => {
             setUserData(updatedUser);
             localStorage.setItem('user', JSON.stringify(updatedUser));
             window.dispatchEvent(new Event('user-profile-updated'));
          }}
        />
      </div>
    </div>
  );
}

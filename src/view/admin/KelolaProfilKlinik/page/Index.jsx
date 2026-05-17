import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import PengaturanTentangKami from './PengaturanTentangKami';
import GaleriKegiatan from './GaleriKegiatan';
import ModalHapusPengaturan from './ModalHapusPengaturan';
import ModalTambahKegiatanBaru from './ModalTambahKegiatanBaru';
import ModalEditKegiatan from './ModalPerbaruiKegiatan';
import ModalHapusKegiatan from './ModalHapusKegiatan';
import ToastAlert from '@/view/components/ToastAlert';

const KelolaProfilKlinik = () => {
  const [profileData, setProfileData] = useState(null);
  const [kegiatanList, setKegiatanList] = useState([]);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const [isModalHapusPengaturanOpen, setIsModalHapusPengaturanOpen] = useState(false);
  const [isModalTambahKegiatanOpen, setIsModalTambahKegiatanOpen] = useState(false);
  const [isModalEditKegiatanOpen, setIsModalEditKegiatanOpen] = useState(false);
  const [isModalHapusKegiatanOpen, setIsModalHapusKegiatanOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchKegiatan();
  }, []);

  const fetchKegiatan = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8000/api/admin/kegiatan', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setKegiatanList(res.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching kegiatan:', error);
      setKegiatanList([]);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8000/api/admin/clinic', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("RESPONSE API ADMIN CLINIC:", res.data); // LOG UNTUK DEBUGGING

      if (res.data.success && res.data.data) {
        // Antisipasi jika API mengembalikan Array, ambil data pertama. Jika Object, langsung pakai.
        const clinicData = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;

        if (clinicData && Object.keys(clinicData).length > 0) {
          setProfileData(clinicData);
        } else {
          setProfileData(null);
        }
      } else {
        setProfileData(null);
      }
    } catch (error) {
      console.error('Error fetching clinic:', error.response?.data || error.message);
      setProfileData(null);
    }
  };

  const handleUpdateProfile = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) payload.append(key, formData[key]);
      });

      let res;
      // Get ID safely regardless of column name
      const id = profileData ? (profileData.idProfil || profileData.id_profile || profileData.idProfile || profileData.id) : null;

      if (profileData && id) {
        payload.append('_method', 'PUT');
        // Use POST with FormData; let browser set Content-Type including boundary
        res = await axios.post(`http://127.0.0.1:8000/api/admin/clinic/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new profile
        res = await axios.post('http://127.0.0.1:8000/api/admin/clinic', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (res.data.success) {
        setToast({ isOpen: true, message: 'Profil Klinik berhasil diperbarui!', type: 'success' });
        fetchProfile();
      }
    } catch (error) {
      console.error('Update Profile Error:', error.response?.data || error.message);
      let errorMsg = 'Gagal memperbarui profil klinik.';
      if (error.response?.data?.errors) {
         errorMsg = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
         errorMsg = error.response.data.message;
      }
      setToast({ isOpen: true, message: errorMsg, type: 'error' });
    }
  };

  const handleDeleteProfile = async () => {
    if (!profileData) return;
    const id = profileData.idProfil || profileData.id_profile || profileData.idProfile || profileData.id;
    if (!id) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/admin/clinic/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast({ isOpen: true, message: 'Profil Klinik berhasil dihapus!', type: 'success' });
      setProfileData(null);
      setIsModalHapusPengaturanOpen(false);
    } catch (error) {
      setToast({ isOpen: true, message: 'Gagal menghapus profil klinik.', type: 'error' });
      setIsModalHapusPengaturanOpen(false);
    }
  };

  return (
    <div className="p-8 bg-[#f4f6f9] min-h-screen font-sans">
      <ToastAlert isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
      <Header />

      <PengaturanTentangKami
        data={profileData}
        onSimpan={handleUpdateProfile}
        onError={(msg) => setToast({ isOpen: true, message: msg, type: 'error' })}
        onHapusClick={() => setIsModalHapusPengaturanOpen(true)}
      />

      <GaleriKegiatan 
        data={kegiatanList}
        onTambahClick={() => setIsModalTambahKegiatanOpen(true)}
        onPerbaruiClick={(id) => setIsModalEditKegiatanOpen(id)}
        onHapusClick={(id) => setIsModalHapusKegiatanOpen(id)}
      />

      <ModalHapusPengaturan
        isOpen={isModalHapusPengaturanOpen}
        onClose={() => setIsModalHapusPengaturanOpen(false)}
        onConfirm={handleDeleteProfile}
      />

      <ModalTambahKegiatanBaru 
        isOpen={isModalTambahKegiatanOpen} 
        onClose={() => setIsModalTambahKegiatanOpen(false)} 
        onSuccess={() => {
          setIsModalTambahKegiatanOpen(false);
          fetchKegiatan();
          setToast({ isOpen: true, message: 'Kegiatan berhasil ditambahkan!', type: 'success' });
        }}
      />
      
      <ModalEditKegiatan 
        isOpen={!!isModalEditKegiatanOpen} 
        id={isModalEditKegiatanOpen}
        onClose={() => setIsModalEditKegiatanOpen(false)} 
        onSuccess={() => {
          setIsModalEditKegiatanOpen(false);
          fetchKegiatan();
          setToast({ isOpen: true, message: 'Kegiatan berhasil diperbarui!', type: 'success' });
        }}
      />

      <ModalHapusKegiatan 
        isOpen={!!isModalHapusKegiatanOpen} 
        id={isModalHapusKegiatanOpen}
        onClose={() => setIsModalHapusKegiatanOpen(false)} 
        onSuccess={() => {
          setIsModalHapusKegiatanOpen(false);
          fetchKegiatan();
          setToast({ isOpen: true, message: 'Kegiatan berhasil dihapus!', type: 'success' });
        }}
      />
    </div>
  );
};

export default KelolaProfilKlinik;


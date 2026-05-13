import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ToastAlert from '../../components/ToastAlert';
import ModalUbahPassword from './ModalUbahPassword';

const ProfileForm = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

    // Coba ambil data dari localStorage terlebih dahulu agar instan muncul!
    const savedUserStr = localStorage.getItem('user');
    const savedUser = savedUserStr ? JSON.parse(savedUserStr) : {};

    const [formData, setFormData] = useState({
        nama: savedUser.nama || '',
        alamat: savedUser.alamat || '',
        nomorWa: savedUser.nomorWa || '',
        email: savedUser.email || '',
        tanggalLahir: savedUser.tanggalLahir ? savedUser.tanggalLahir.split(' ')[0] : '',
        jenisKelamin: savedUser.jenisKelamin || 'Perempuan'
    });

    // State untuk Modal Ubah Password
    const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);

    // Ambil Data Profil Saat Pertama Kali Render (Sebagai Background Refresh)
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://127.0.0.1:8000/api/customer/profile', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                withCredentials: true
            });

            console.log("Response dari GET profile:", res.data); // LOG UNTUK BANTU DEBUG

            if (res.data.success) {
                const data = res.data.data;
                setFormData(prev => ({
                    ...prev,
                    nama: data.nama || '',
                    alamat: data.alamat || '',
                    nomorWa: data.nomorWa || '',
                    email: data.email || '',
                    tanggalLahir: data.tanggalLahir ? data.tanggalLahir.split(' ')[0] : '', // Hanya tanggal, tanpa jam
                    jenisKelamin: data.jenisKelamin || 'Perempuan'
                }));
            } else {
                setToast({ isOpen: true, message: res.data.message || 'Gagal mengambil profil', type: 'error' });
            }
        } catch (error) {
            console.error("Gagal mengambil profil:", error);
            let errMsg = 'Gagal memuat profil. Pastikan API berjalan dan Anda sudah login.';
            if (error.response) {
                errMsg = `Error ${error.response.status}: ${error.response.data.message || 'Gagal'}`;
            }
            setToast({ isOpen: true, message: errMsg, type: 'error' });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fungsi Update Profil Utama (Tanpa Password)
    const handleUpdate = async (e) => {
        if (e) e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const payload = { ...formData };

            const res = await axios.put('http://127.0.0.1:8000/api/customer/profile', payload, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            if (res.data.success) {
                setToast({ isOpen: true, message: 'Profil berhasil diperbarui!', type: 'success' });
                // Update nama user di lokal (untuk sidebar/header)
                localStorage.setItem('user', JSON.stringify(res.data.data));
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

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:8000/api/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
        } catch (error) {
            console.error("Gagal mengirim perintah logout ke server:", error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    return (
        <div className="w-full">
            <ToastAlert 
                isOpen={toast.isOpen} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ ...toast, isOpen: false })} 
            />

            <ModalUbahPassword 
                isOpen={isModalPasswordOpen} 
                onClose={() => setIsModalPasswordOpen(false)} 
                formData={formData} 
                onSuccess={(updatedUser) => {
                    setToast({ isOpen: true, message: 'Password berhasil diperbarui!', type: 'success' });
                    setIsModalPasswordOpen(false);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }}
                onError={(errorMsg) => {
                    setToast({ isOpen: true, message: errorMsg, type: 'error' });
                }}
            />

            {/* ========================================================== */}
            {/* MOBILE VERSION */}
            {/* ========================================================== */}
            <div className="flex md:hidden flex-col items-center bg-white rounded-[40px] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.04)] border border-gray-100 gap-8">
                <div className="flex flex-col items-center justify-center pt-4">
                    <div className="relative w-44 h-44 aspect-square mb-6">
                        <div className="w-full h-full rounded-full bg-[#d0eef2] p-1 shadow-2xl border-4 border-white overflow-hidden flex items-center justify-center">
                            <img src="/src/assets/ProfilCustomer.png" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <button className="w-full max-w-[200px] bg-white border-2 border-gray-100 text-gray-500 font-extrabold text-base py-3 rounded-2xl shadow-sm">
                        Pilih Gambar
                    </button>
                </div>

                <div className="w-full flex flex-col gap-6">
                    {[
                        { label: 'Nama', name: 'nama', type: 'text' },
                        { label: 'Alamat', name: 'alamat', type: 'text' },
                        { label: 'Nomor WhatsApp', name: 'nomorWa', type: 'text' },
                        { label: 'Email', name: 'email', type: 'email' },
                    ].map((item, idx) => (
                        <div key={idx} className="grid grid-cols-[80px_15px_1fr] items-start">
                            <label className="text-gray-800 font-extrabold text-sm mt-3">{item.label}</label>
                            <span className="text-gray-800 font-extrabold mt-3">:</span>
                            <div className="w-full flex flex-col items-start gap-2">
                                <input 
                                    type={item.type} 
                                    name={item.name}
                                    value={formData[item.name]}
                                    onChange={handleChange}
                                    placeholder={item.placeholder || ''}
                                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-gray-700 text-sm shadow-sm focus:outline-none" 
                                />
                                {item.name === 'email' && (
                                    <button 
                                        onClick={(e) => { e.preventDefault(); setIsModalPasswordOpen(true); }} 
                                        className="text-[#74b35e] font-bold text-xs hover:underline bg-[#f2faef] px-3 py-1.5 rounded-lg border border-[#cce8c3]"
                                    >
                                        Ubah Password
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="grid grid-cols-[80px_15px_1fr] items-center">
                        <label className="text-gray-800 font-extrabold text-sm">Jenis Kelamin</label>
                        <span className="text-gray-800 font-extrabold">:</span>
                        <select 
                            name="jenisKelamin"
                            value={formData.jenisKelamin}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none appearance-none"
                        >
                            <option value="Perempuan">Perempuan</option>
                            <option value="Laki-laki">Laki-laki</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-[80px_15px_1fr] items-center">
                        <label className="text-gray-800 font-extrabold text-sm">Tgl Lahir</label>
                        <span className="text-gray-800 font-extrabold">:</span>
                        <input
                            type="date"
                            name="tanggalLahir"
                            value={formData.tanggalLahir}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none appearance-none"
                        />
                    </div>

                    <div className="w-full mt-4 flex flex-col gap-3">
                        <button onClick={handleUpdate} className="w-full bg-[#74b35e] text-white font-extrabold py-3 rounded-2xl shadow-lg">Simpan Profil</button>
                        <button onClick={handleLogout} className="w-full bg-[#c85a53] text-white font-extrabold py-3 rounded-2xl shadow-lg">Log Out</button>
                    </div>
                </div>
            </div>

            {/* ========================================================== */}
            {/* DESKTOP VERSION */}
            {/* ========================================================== */}
            <div className="hidden md:flex flex-row bg-white rounded-[40px] p-12 lg:p-16 shadow-[0_10px_50px_rgba(0,0,0,0.04)] border border-gray-100 gap-4 lg:gap-8 items-start justify-between overflow-hidden">
                <div className="flex-1 flex flex-col gap-7 w-full">
                    <div className="flex flex-col gap-6">
                        
                        <div className="grid grid-cols-[180px_35px_1fr] items-center">
                            <label className="text-gray-800 font-extrabold text-xl">Nama</label>
                            <span className="text-gray-800 font-extrabold text-xl text-right pr-4">:</span>
                            <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="bg-white border border-gray-100 rounded-2xl px-7 py-4 text-gray-700 font-medium shadow-[0_5px_15px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#74b35e] transition-all" />
                        </div>

                        <div className="grid grid-cols-[180px_35px_1fr] items-center">
                            <label className="text-gray-800 font-extrabold text-xl">Alamat</label>
                            <span className="text-gray-800 font-extrabold text-xl text-right pr-4">:</span>
                            <input type="text" name="alamat" value={formData.alamat} onChange={handleChange} className="bg-white border border-gray-100 rounded-2xl px-7 py-4 text-gray-700 font-medium shadow-[0_5px_15px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#74b35e] transition-all" />
                        </div>

                        <div className="grid grid-cols-[180px_35px_1fr] items-center">
                            <label className="text-gray-800 font-extrabold text-xl">Tanggal Lahir</label>
                            <span className="text-gray-800 font-extrabold text-xl text-right pr-4">:</span>
                            <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} className="w-full bg-white border border-gray-100 rounded-2xl px-7 py-4 text-gray-700 font-medium shadow-[0_5px_15px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#74b35e] transition-all appearance-none" />
                        </div>

                        <div className="grid grid-cols-[180px_35px_1fr] items-center">
                            <label className="text-gray-800 font-extrabold text-xl">Jenis Kelamin</label>
                            <span className="text-gray-800 font-extrabold text-xl text-right pr-4">:</span>
                            <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} className="w-full bg-white border border-gray-100 rounded-2xl px-7 py-4 text-gray-700 font-medium shadow-[0_5px_15px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#74b35e] transition-all appearance-none cursor-pointer">
                                <option value="Perempuan">Perempuan</option>
                                <option value="Laki-laki">Laki-laki</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-[180px_35px_1fr] items-center">
                            <label className="text-gray-800 font-extrabold text-xl">Nomor WhatsApp</label>
                            <span className="text-gray-800 font-extrabold text-xl text-right pr-4">:</span>
                            <input type="text" name="nomorWa" value={formData.nomorWa} onChange={handleChange} className="bg-white border border-gray-100 rounded-2xl px-7 py-4 text-gray-700 font-medium shadow-[0_5px_15px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#74b35e] transition-all" />
                        </div>

                        <div className="grid grid-cols-[180px_35px_1fr] items-start">
                            <label className="text-gray-800 font-extrabold text-xl mt-4">Email</label>
                            <span className="text-gray-800 font-extrabold text-xl text-right pr-4 mt-4">:</span>
                            <div className="w-full flex flex-col items-start gap-3">
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white border border-gray-100 rounded-2xl px-7 py-3 text-[#3a7c36] underline font-bold shadow-[0_5px_15px_rgba(0,0,0,0.05)] focus:outline-none" />
                                <button 
                                    onClick={(e) => { e.preventDefault(); setIsModalPasswordOpen(true); }} 
                                    className="text-[#74b35e] font-bold hover:underline text-sm bg-[#f2faef] px-5 py-2 rounded-xl border border-[#cce8c3]"
                                >
                                    Ubah Password
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-6">
                        <button onClick={handleUpdate} className="w-full bg-[#74b35e] hover:bg-[#64a14e] text-white font-extrabold text-xl py-5 rounded-3xl shadow-[0_10px_25px_rgba(116,179,94,0.3)] active:scale-[0.98] transition-all">
                            Simpan Profil
                        </button>
                    </div>
                </div>

                <div className="w-[280px] lg:w-[320px] flex flex-col items-center justify-start pt-10 shrink-0">
                    <div className="relative w-33 h-33 lg:w-64 lg:h-64 aspect-square mb-10 shrink-0">
                        <div className="w-full h-full rounded-full bg-[#d0eef2] p-1 shadow-2xl border-4 border-white overflow-hidden flex items-center justify-center">
                            <img src="/src/assets/ProfilCustomer.png" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <button className="w-full max-w-[250px] bg-white border-2 border-gray-100 text-gray-500 font-extrabold text-lg py-4 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors">
                        Pilih Gambar
                    </button>
                    <button onClick={handleLogout} className="w-full max-w-[180px] mt-4 bg-[#c85a53] text-white font-bold text-sm py-2.5 rounded-lg shadow-md hover:bg-[#b54a43] transition-colors">
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;

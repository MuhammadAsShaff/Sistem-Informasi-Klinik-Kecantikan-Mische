import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const ModalUbahPassword = ({ isOpen, onClose, formData, onSuccess, onError }) => {
    const [passwordModal, setPasswordModal] = useState({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!passwordModal.password) {
            onError('Password baru tidak boleh kosong!');
            return;
        }
        
        // Validasi sesuai backend: min 8 karakter dan mixed case
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(passwordModal.password)) {
            onError('Password minimal 8 karakter dan harus mengandung huruf besar dan kecil!');
            return;
        }
        if (passwordModal.password !== passwordModal.confirmPassword) {
            onError('Konfirmasi password tidak cocok!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const payload = { ...formData, password: passwordModal.password };

            const res = await axios.put('http://127.0.0.1:8000/api/customer/profile', payload, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            if (res.data.success) {
                // Bersihkan form modal
                setPasswordModal({ password: '', confirmPassword: '' });
                setShowPassword(false);
                setShowConfirmPassword(false);
                onSuccess(res.data.data); // kirim data user terbaru ke parent
            }
        } catch (error) {
            let errorMsg = 'Gagal mengubah password.';
            if (error.response && error.response.data && error.response.data.message) {
                errorMsg = error.response.data.message;
                if (error.response.data.errors) {
                    errorMsg = Object.values(error.response.data.errors)[0][0];
                }
            }
            onError(errorMsg);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[400px] rounded-[24px] p-8 shadow-2xl flex flex-col gap-6 animate-in zoom-in duration-300">
                <div className="flex flex-col items-center gap-3">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-500">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-xl font-extrabold text-gray-800 text-center">Ubah Password</h2>
                </div>
                
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Password Baru</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={passwordModal.password} 
                                onChange={e => setPasswordModal({...passwordModal, password: e.target.value})}
                                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[#55BC36]"
                                placeholder="******"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <p className="text-xs text-red-500 mt-2 font-medium">
                            *Wajib diisi. Minimal 8 karakter dan harus mengandung kombinasi huruf <strong>BESAR</strong> dan <strong>kecil</strong>.
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Konfirmasi Password Baru</label>
                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                value={passwordModal.confirmPassword} 
                                onChange={e => setPasswordModal({...passwordModal, confirmPassword: e.target.value})}
                                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[#55BC36]"
                                placeholder="******"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                    <button onClick={handleSave} className="w-full bg-[#55BC36] hover:bg-[#4ea830] transition-colors text-white font-bold py-3 rounded-xl shadow-lg">
                        Simpan Password
                    </button>
                    <button 
                        onClick={() => { 
                            setPasswordModal({ password: '', confirmPassword: '' }); 
                            setShowPassword(false);
                            setShowConfirmPassword(false);
                            onClose(); 
                        }} 
                        className="w-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 font-bold py-3 rounded-xl"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalUbahPassword;

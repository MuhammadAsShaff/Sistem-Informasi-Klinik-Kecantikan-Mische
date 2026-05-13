import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import ToastAlert from '../../components/ToastAlert';
import { useNavigate } from 'react-router-dom';

const RegistrasiForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        nomorWa: '',
        alamat: '',
        jenisKelamin: '',
        tanggalLahir: '',
        password: '',
        confirmPassword: ''
    });

    // Toast State
    const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi konfirmasi password
        if (formData.password !== formData.confirmPassword) {
            setToast({ isOpen: true, message: 'Konfirmasi password tidak cocok!', type: 'error' });
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/register', {
                nama: formData.nama,
                email: formData.email,
                nomorWa: formData.nomorWa,
                alamat: formData.alamat,
                jenisKelamin: formData.jenisKelamin,
                tanggalLahir: formData.tanggalLahir,
                password: formData.password,
                role: 'Customer' // default role
            });

            if (response.data.success) {
                setToast({ isOpen: true, message: 'Registrasi berhasil!', type: 'success' });
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            }
        } catch (error) {
            let errorMsg = 'Registrasi gagal. Coba lagi.';
            if (error.response && error.response.data && error.response.data.message) {
                errorMsg = error.response.data.message;
                // Jika ada detail error dari validasi Laravel
                if (error.response.data.errors) {
                    const firstError = Object.values(error.response.data.errors)[0][0];
                    errorMsg = firstError;
                }
            }
            setToast({ isOpen: true, message: errorMsg, type: 'error' });
        }
    };

    return (
        <>
            <ToastAlert 
                isOpen={toast.isOpen} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ ...toast, isOpen: false })} 
            />
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-x-8 md:gap-y-6">
                    {/* NAMA */}
                    <div>
                        <label className="block text-black font-semibold text-[15px] mb-2">
                            Nama
                        </label>
                        <input 
                            type="text" 
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            placeholder="Nama"
                            required
                            className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors"
                        />
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="block text-black font-semibold text-[15px] mb-2">
                            Email
                        </label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                            className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors"
                        />
                    </div>

                    {/* NOMOR WHATSAPP */}
                    <div>
                        <label className="block text-black font-semibold text-[15px] mb-2">
                            Nomor WhatsApp
                        </label>
                        <input 
                            type="text" 
                            name="nomorWa"
                            value={formData.nomorWa}
                            onChange={handleChange}
                            placeholder="Nomor WhatsApp"
                            required
                            className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors"
                        />
                    </div>

                    {/* ALAMAT */}
                    <div>
                        <label className="block text-black font-semibold text-[15px] mb-2">
                            Alamat
                        </label>
                        <input 
                            type="text" 
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            placeholder="Alamat"
                            required
                            className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors"
                        />
                    </div>

                    {/* JENIS KELAMIN */}
                    <div>
                        <label className="block text-black font-semibold text-[15px] mb-2">
                            Jenis Kelamin
                        </label>
                        <select 
                            name="jenisKelamin"
                            value={formData.jenisKelamin}
                            onChange={handleChange}
                            required
                            className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-[#56BC36] transition-colors"
                        >
                            <option value="" disabled>Pilih Jenis Kelamin</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>

                    {/* TANGGAL LAHIR */}
                    <div>
                        <label className="block text-black font-semibold text-[15px] mb-2">
                            Tanggal Lahir
                        </label>
                        <input 
                            type="date" 
                            name="tanggalLahir"
                            value={formData.tanggalLahir}
                            onChange={handleChange}
                            required
                            className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors"
                        />
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="block text-black font-semibold text-[15px] mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="******"
                                required
                                className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors pr-12"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* KONFIRMASI PASSWORD */}
                    <div>
                        <label className="block text-black font-semibold text-[15px] mb-2">
                            Konfirmasi Password
                        </label>
                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="******"
                                required
                                className="w-full border-[1.5px] border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors pr-12"
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

                {/* SUBMIT BUTTON */}
                <div className="mt-2">
                    <button 
                        type="submit"
                        className="w-fit px-12 bg-[#56BC36] hover:bg-[#4ea830] transition-colors duration-300 text-white font-bold text-[18px] py-3 rounded-full shadow-lg active:scale-[0.98]"
                    >
                        Registrasi
                    </button>
                </div>
            </form>
        </>
    );
};

export default RegistrasiForm;

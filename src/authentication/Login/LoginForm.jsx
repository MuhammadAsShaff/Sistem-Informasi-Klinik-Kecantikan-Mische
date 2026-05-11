import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  // State untuk menyimpan inputan user (Buku Catatan)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State untuk status proses (loading) dan pesan error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fungsi yang dipanggil saat tombol login ditekan
  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah halaman refresh bawaan browser
    
    // Reset pesan error dan nyalakan status loading
    setErrorMessage('');
    setIsLoading(true);

    try {
      // Mengirim data email & password ke backend Laravel
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
        email: email,
        password: password
      }, {
        // Penting agar backend bisa menyimpan cookie ke browser (jika beda port)
        withCredentials: true 
      });

      // Jika backend merespon sukses
      if (response.data.success) {
        // Simpan token ke localStorage sebagai tanda bukti login berhasil
        const token = response.data.token;
        localStorage.setItem('token', token);
        
        // --- PROSES MENGAMBIL PROFIL UNTUK CEK ROLE ---
        try {
          const profileRes = await axios.get('http://127.0.0.1:8000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          });

          if (profileRes.data.success) {
            const userData = profileRes.data.data;
            const userRole = userData.role;
            
            // Simpan data user di penyimpanan juga siapa tahu nanti butuh
            localStorage.setItem('user', JSON.stringify(userData));

                // LOGIKA PENGARAHAN (REDIREKSI)
            if (userRole === 'admin') {
              navigate('/admin'); // Arahkan ke rute Admin Dashboard
            } else {
              navigate('/'); // Arahkan ke Beranda Customer
            }
          }
        } catch (profileError) {
          console.error("Gagal mengambil profil/role user:", profileError);
          alert("Login berhasil, namun gagal mengambil profil. Anda akan diarahkan ke halaman utama.");
          navigate('/');
        }
      }

    } catch (error) {
      console.error("Error Login:", error);
      // Menangkap pesan error dari backend (misal: "Email atau password salah")
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Terjadi kesalahan pada server. Pastikan backend berjalan.");
      }
    } finally {
      setIsLoading(false); // Matikan efek loading
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleLogin}>
      
      {/* Tampilkan pesan error jika ada masalah */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative text-sm">
          {errorMessage}
        </div>
      )}

      {/* KOLOM EMAIL */}
      <div>
        <label className="block text-black font-semibold text-[15px] mb-2">
          Email
        </label>
        <input 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Catat ketikan user ke dalam state
          required
          className="w-full border-2 border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors"
        />
      </div>

      {/* KOLOM PASSWORD */}
      <div>
        <label className="block text-black font-semibold text-[15px] mb-2">
          Password
        </label>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Catat ketikan user ke dalam state
            required
            className="w-full border-2 border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#56BC36] transition-colors pr-12"
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

      {/* TOMBOL LOGIN */}
      <button 
        type="submit"
        disabled={isLoading} // Tombol mati kalau sedang loading
        className={`w-full transition-colors duration-300 text-white font-bold text-[18px] py-4 rounded-3xl mt-4 shadow-lg active:scale-[0.98] ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#56BC36] hover:bg-[#4ea830]"
        }`}
      >
        {isLoading ? "Sedang Memproses..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;

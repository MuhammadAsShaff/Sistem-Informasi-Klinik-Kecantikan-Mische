import React, { useState, useEffect } from 'react';
import ModalUbahPasswordAdmin from './ModalUbahPasswordAdmin';

const ProfilForm = ({ user, onUpdate, onToast, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    tanggalLahir: '',
    jenisKelamin: '',
    alamat: ''
  });

  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);

  // Sinkronisasi data ketika profile berhasil di-fetch
  useEffect(() => {
    if (user) {
      setFormData({
        nama: user.nama || '',
        email: user.email || '',
        tanggalLahir: user.tanggalLahir ? user.tanggalLahir.split(' ')[0] : '',
        jenisKelamin: user.jenisKelamin || '',
        nomorWa: user.nomorWa || '',
        alamat: user.alamat || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nomorWa') {
      const numericValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSimpan = () => {
    onUpdate(formData);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
        {/* NAMA */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-semibold text-lg">Nama</label>
          <input 
            type="text" 
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Bintang Puspita" 
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#55BC36] text-black placeholder:text-gray-600"
          />
        </div>

        {/* EMAIL */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-semibold text-lg">Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="BintangPuspita@gmail.com" 
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#55BC36] text-black placeholder:text-gray-600"
          />
        </div>

        {/* TANGGAL LAHIR */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-semibold text-lg">Tanggal Lahir</label>
          <input 
            type="date" 
            name="tanggalLahir"
            value={formData.tanggalLahir}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#55BC36] text-black"
          />
        </div>

        {/* JENIS KELAMIN */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-semibold text-lg">Jenis Kelamin</label>
          <select 
            name="jenisKelamin"
            value={formData.jenisKelamin}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#55BC36] text-black appearance-none bg-transparent"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='black'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
          >
            <option value="" disabled>Pilih Jenis Kelamin</option>
            <option value="Perempuan">Perempuan</option>
            <option value="Laki-laki">Laki-laki</option>
          </select>
        </div>

        {/* NOMOR WHATSAPP */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-semibold text-lg">Nomor Whatsapp</label>
          <input 
            type="text" 
            name="nomorWa"
            value={formData.nomorWa}
            onChange={handleChange}
            placeholder="08xx-xxxx-xxxx" 
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#55BC36] text-black placeholder:text-gray-600"
          />
        </div>

        {/* ALAMAT */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-semibold text-lg">Alamat</label>
          <input 
            type="text" 
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            placeholder="Jl.Mangkubumi" 
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#55BC36] text-black placeholder:text-gray-600"
          />
        </div>

        {/* PASSWORD */}
        <div className="flex flex-col gap-2 items-start">
          <label className="text-black font-semibold text-lg">Password</label>
          <button 
             onClick={(e) => { e.preventDefault(); setIsModalPasswordOpen(true); }} 
             className="text-[#74b35e] font-bold hover:bg-[#e4f4df] transition-colors text-sm bg-[#f2faef] px-5 py-3 rounded-md border border-[#cce8c3]"
          >
             Ubah Password
          </button>
        </div>

      </div>

      <hr className="border-gray-300 mb-8" />

      {/* BUTTONS */}
      <div className="flex flex-col gap-10">
        <div className="flex justify-end">
          <button 
            onClick={handleSimpan}
            className="bg-[#56BC36] hover:bg-[#4ea830] text-white font-semibold py-3 px-6 rounded-md shadow-sm transition-colors text-[15px]"
          >
            Simpan Perubahan
          </button>
        </div>
        
        <div className="text-center w-full">
          <span className="text-black text-[16px]">Lupa Password Anda? </span>
          <button className="text-[#56BC36] hover:underline cursor-pointer text-[16px]">klik Di sini.</button>
        </div>
      </div>
      
      <ModalUbahPasswordAdmin 
        isOpen={isModalPasswordOpen} 
        onClose={() => setIsModalPasswordOpen(false)} 
        formData={formData} 
        onSuccess={(updatedUser) => {
            onToast('Password berhasil diperbarui!', 'success');
            setIsModalPasswordOpen(false);
            if (onUserUpdated) onUserUpdated(updatedUser);
        }}
        onError={(errorMsg) => {
            onToast(errorMsg, 'error');
        }}
      />
    </div>
  );
};

export default ProfilForm;

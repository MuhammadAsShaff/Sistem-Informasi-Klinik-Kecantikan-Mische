import React from 'react';

/**
 * PAPAN KARTU NAMA & FOTO PROFIL (Banner)
 * Ibarat papan sambutan ramah di atas pintu masuk ruangan yang menampilkan potret wajah admin, 
 * nama lengkapnya, serta lencana hijau bertuliskan "Online" yang menandakan bahwa admin 
 * tersebut sedang aktif bekerja di dalam sistem.
 */
const Banner = ({ user }) => {
  // Mengambil tulisan nama KTP admin. Jika belum tercatat, sebut saja "Admin Utama"
  const nama = user?.nama || 'Admin Utama';

  return (
    <div className="w-full border border-gray-300 p-6 flex flex-row items-center gap-6 mb-12 bg-white rounded-md">
      
      {/* Bingkai Bundar untuk Foto Wajah Admin */}
      <div className="w-[100px] h-[100px] rounded-full bg-[#d2d6dd] flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
         <img 
            src={user?.fotoProfil ? 
                  (user.fotoProfil.startsWith('http') ? user.fotoProfil : `${import.meta.env.VITE_STORAGE_BASE_URL || 'http://localhost:8000/storage/'}${String(user.fotoProfil).replace(/^(?:public\/|storage\/|\/)+/, '')}`) 
                  : (user?.jenisKelamin === 'Laki-laki' ? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' : '/src/assets/images/ProfilCustomer.png')} 
            alt="Profile" 
            className="w-full h-full object-cover" 
         />
      </div>

      {/* Bagian Tulisan Sambutan dan Status Online */}
      <div className="flex flex-col items-start text-left">
        {/* Lencana Hijau Pertanda Aktif (Online) */}
        <span className="bg-[#e1f5ec] text-[#48a176] font-semibold px-5 py-1 rounded-full text-[14px] mb-2">
          Online
        </span>
        
        {/* Kalimat Sapaan Hangat */}
        <h2 className="text-[22px] font-semibold text-black mb-1">Hallo, {nama}!</h2>
        <p className="text-gray-700 text-[15px]">
          Anda dapat mengganti dan menyesuaikan dengan kebutuhan. Ayo atur profil Anda sekarang!
        </p>
      </div>
    </div>
  );
};

export default Banner;

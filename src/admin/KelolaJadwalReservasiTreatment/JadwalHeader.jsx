import React from 'react';

const JadwalHeader = () => {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Data Jadwal Reservasi Treatment</h1>
      <p className="text-gray-500 text-sm">
        Menampilkan data jadwal reservasi treatment lengkap dengan jadwal dan informasi pengguna. 
        Admin dapat melakukan pencarian, edit, dan hapus data.
      </p>
    </div>
  );
};

export default JadwalHeader;

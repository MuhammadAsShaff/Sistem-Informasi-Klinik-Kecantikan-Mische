import React from 'react';
import { Link } from 'react-router-dom';

const Page404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200">404</h1>
        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-4">
          Halaman Tidak Ditemukan
        </p>
        <p className="mt-4 text-gray-500">
          Maaf, rute yang Anda cari tidak tersedia atau Anda tidak memiliki akses ke halaman ini.
        </p>
        <Link
          to="/"
          className="inline-block mt-8 px-6 py-3 bg-[#56BC36] hover:bg-[#4ea830] text-white font-bold rounded-full transition-colors shadow-lg"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default Page404;

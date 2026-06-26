import React from 'react';
import { useRegistrasiPage } from '../hooks/useRegistrasiPage';
import RegistrasiHeader from './RegistrasiHeader';
import RegistrasiForm from './RegistrasiForm';

export default function RegistrasiPage() {
  const { navigate } = useRegistrasiPage();

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] flex items-center justify-center py-10 px-4">
      {/* CARD KONTANER */}
      <div className="bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] w-full max-w-[800px] p-8 md:p-12 border border-gray-100 relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center text-gray-400 hover:text-[#56BC36] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="ml-1 font-medium text-sm">Kembali</span>
        </button>
        <RegistrasiHeader />
        <RegistrasiForm />
      </div>
    </div>
  );
}

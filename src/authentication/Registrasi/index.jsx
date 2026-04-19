import React from 'react';
import RegistrasiHeader from './RegistrasiHeader';
import RegistrasiForm from './RegistrasiForm';

export default function RegistrasiPage() {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#FAF8F5] flex items-center justify-center py-10 px-4">
      {/* CARD KONTANER */}
      <div className="bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] w-full max-w-[800px] p-8 md:p-12 border border-gray-100">
        <RegistrasiHeader />
        <RegistrasiForm />
      </div>
    </div>
  );
}

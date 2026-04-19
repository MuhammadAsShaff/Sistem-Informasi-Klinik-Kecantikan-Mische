import React from 'react';
import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#FAF8F5] flex items-center justify-center py-10 px-4">
      {/* CARD KONTANER */}
      <div className="bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] w-full max-w-[500px] p-8 md:p-12 border border-gray-100">
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
}

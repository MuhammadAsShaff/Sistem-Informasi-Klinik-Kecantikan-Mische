import React from 'react';
import { Loader2 } from 'lucide-react';

export default function CustomerLoading({ text = "Memuat data..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 w-full h-full min-h-[300px]">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#56BC36] rounded-full blur-xl opacity-20 animate-pulse"></div>
        {/* Spinner */}
        <Loader2 className="w-12 h-12 text-[#56BC36] animate-spin relative z-10" />
      </div>
      <p className="mt-6 text-gray-500 font-medium text-lg tracking-wide animate-pulse text-center">
        {text}
      </p>
    </div>
  );
}

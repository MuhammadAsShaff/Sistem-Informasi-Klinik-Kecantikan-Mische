import React from 'react';

const JenisPerawatanCard = ({ item }) => {
  // Format harga ke Rupiah
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(item.price || 0);

  return (
    <div className="flex flex-col bg-white rounded-[30px] border border-gray-100 overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full">
      {/* Top Image */}
      <div className="w-full h-60 md:h-72 relative shrink-0">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom Content */}
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <h3 className="text-[#1a2b4c] text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
        
        {/* Duration */}
        <div className="flex items-center text-gray-500 mb-3">
          <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm md:text-base font-medium">{item.duration} Menit</span>
        </div>

        <p className="text-[13px] text-gray-600 mb-4 leading-relaxed font-medium text-justify">
          {item.description}
        </p>



        {/* Dashed Line & Price (Pushed to bottom) */}
        <div className="mt-auto pt-3">
          <div className="w-full border-t border-dashed border-gray-300 mb-3"></div>
          <div className="text-[#1a2b4c] text-xl md:text-2xl font-black">
            {formattedPrice}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JenisPerawatanCard;

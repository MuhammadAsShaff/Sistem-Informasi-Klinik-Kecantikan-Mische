import React from 'react';

const JenisPerawatanCard = ({ item }) => {
  return (
    <div className="flex flex-row bg-white rounded-[30px] border border-[#56BC36] overflow-hidden h-[320px] shadow-sm">
      {/* Left Image */}
      <div className="w-[45%] h-full shrink-0">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Content */}
      <div className="w-[55%] p-5 lg:p-6 flex flex-col justify-center">
        {/* Duration Badge */}
        <div className="bg-[#327a1b] text-white rounded-full w-14 h-14 flex flex-col items-center justify-center shadow-md mb-3 shrink-0">
          <span className="font-bold text-sm leading-none mb-0.5">{item.duration}</span>
          <span className="text-[9px] leading-none mb-0.5">Menit</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>

        <h3 className="text-[#56BC36] text-xl lg:text-2xl font-bold mb-2">{item.title}</h3>
        
        <p className="text-xs lg:text-[13px] text-[#56BC36] mb-3 leading-relaxed font-medium pr-1">
          {item.description}
        </p>

        <div className="mt-auto">
          <p className="text-xs lg:text-[13px] text-[#56BC36] mb-1 font-medium">Bermanfaat Untuk:</p>
          <ul className="text-xs lg:text-[13px] text-[#56BC36] font-medium">
            {item.benefits.map((benefit, index) => (
              <li key={index} className="leading-relaxed">-{benefit}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JenisPerawatanCard;

import React from 'react';
import { Link } from 'react-router-dom';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';

const TestimoniCard = ({ id, name, description, foto }) => {
  return (
    <div className="relative w-full h-[300px] lg:h-[400px] rounded-tl-[40px] rounded-br-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.08)] overflow-hidden group shadow-md">
      {/* Background Image */}
      <img 
        src={
          foto 
            ? (foto.startsWith('http') || foto.startsWith('blob:') || foto.startsWith('data:') 
              ? foto 
              : `${STORAGE_BASE_URL}${String(foto).replace(/^(?:public\/|storage\/|\/)+/, '')}`)
            : "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        }
        alt={name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#419a41] via-[#2a5a2a]/60 to-transparent opacity-90 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 flex flex-col justify-end">
        <h3 className="text-white text-2xl font-bold mb-2">{name}</h3>
        <p className="text-white/95 text-sm mb-5 line-clamp-3 leading-relaxed">
          {description}
        </p>
        <Link 
          to={`/tentang-kami/testimoni/${id}`} 
          className="bg-[#5cb85c] hover:bg-[#4a9b4a] transition-colors text-white text-sm font-semibold py-2.5 px-6 rounded-full w-max shadow-sm"
        >
          Selengkapnya
        </Link>
      </div>
    </div>
  );
};

export default TestimoniCard;

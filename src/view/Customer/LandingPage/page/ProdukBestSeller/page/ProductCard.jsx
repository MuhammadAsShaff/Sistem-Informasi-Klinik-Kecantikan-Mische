import React from 'react';
import { Link } from 'react-router-dom';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-tl-[60px] rounded-br-[60px] pb-8 shadow-[0_30px_60px_rgba(0,0,0,0.08)] flex flex-col items-center text-center transition-all duration-300 hover:translate-y-[-15px]">
      {/* yang memberikan efek melompat itu adalah kode ini hover:translate-y-[-15px] */}
      <div className="w-full h-48 md:h-64 object-cover mb-8 overflow-hidden bg-white rounded-tl-[60px] flex items-center justify-center">
        {product.gambar || product.image ? (
          <img 
            src={(product.gambar || product.image).startsWith('http') ? (product.gambar || product.image) : `${STORAGE_BASE_URL}${String(product.gambar || product.image).replace(/^(?:public\/|storage\/|\/)+/, '')}`} 
            alt={product.nama || product.title || product.name} 
            className="w-full h-full object-contain p-4" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>
      {/* title */}
      <h3 className="text-[#56BC36] text-2xl font-bold mb-4 tracking-tighter truncate w-full px-4" title={product.nama || product.title || product.name}>
        {product.nama || product.title || product.name}
      </h3>
      {/* description */}
      <p className="text-gray-500 text-sm md:text-base mb-10 leading-relaxed font-medium px-6 line-clamp-3" title={product.deskripsi || product.description}>
        {product.deskripsi || product.description || 'Deskripsi tidak tersedia'}
      </p>
      <Link to={`/produk/${product.idProduk || product.id}`} className="bg-[#56BC36] text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-[#2da509] transition-colors shadow-md">
        Lihat Produk
      </Link>
    </div>
  );
};  

export default ProductCard;

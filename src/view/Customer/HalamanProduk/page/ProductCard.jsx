import React from 'react';
import { Link } from 'react-router-dom';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/produk/${product.idProduk || product.id}`} className="bg-white rounded-tl-[60px] shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col mx-auto w-full max-w-[260px] cursor-pointer">
      {/* Product Image Area */}
      <div className="bg-[#f4f3ef] p-4 flex justify-center items-center h-64">
        {product.gambar || product.image ? (
          <img 
            src={(product.gambar || product.image).startsWith('http') ? (product.gambar || product.image) : `${STORAGE_BASE_URL}${(product.gambar || product.image)}`} 
            alt={product.nama || product.name} 
            className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>
      
      {/* Product Details Area */}
      <div className="bg-[#56BC36] text-white p-4">
        <h3 className="font-bold text-lg truncate" title={product.nama || product.name}>{product.nama || product.name}</h3>
        <p className="text-sm opacity-90 mt-1">{product.harga ? `Rp ${Number(product.harga).toLocaleString('id-ID')}` : product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;

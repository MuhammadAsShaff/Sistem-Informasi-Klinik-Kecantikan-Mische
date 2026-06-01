import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/produk/${product.id}`} className="bg-white rounded-tl-[60px] shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col mx-auto w-full max-w-[260px] cursor-pointer">
      {/* Product Image Area */}
      <div className="bg-[#f4f3ef] p-4 flex justify-center items-center h-64">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Product Details Area */}
      <div className="bg-[#56BC36] text-white p-4">
        <h3 className="font-bold text-lg">{product.name}</h3>
        <p className="text-sm opacity-90 mt-1">{product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;

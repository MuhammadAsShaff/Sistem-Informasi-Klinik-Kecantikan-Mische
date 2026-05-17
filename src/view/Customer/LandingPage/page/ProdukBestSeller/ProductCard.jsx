import React from 'react';
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-tl-[60px] rounded-br-[60px] pb-8 shadow-[0_30px_60px_rgba(0,0,0,0.08)] flex flex-col items-center text-center transition-all duration-300 hover:translate-y-[-15px]">
      {/* yang memberikan efek melompat itu adalah kode ini hover:translate-y-[-15px] */}
      <div className="w-full h-full object-cover mb-8 overflow-hidden bg-white  rounded-tl-[60px]">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
      </div>
      {/* title */}
      <h3 className="text-[#56BC36] text-3xl font-bold mb-4 tracking-tighter">{product.title}</h3>
      {/* description */}
      <p className="text-gray-500 text-sm md:text-base mb-10 leading-relaxed font-medium">
        {product.description}
      </p>
      <button className="bg-[#56BC36] text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-[#2da509] transition-colors shadow-md">
        Lihat Produk
      </button>
    </div>
  );
};  

export default ProductCard;

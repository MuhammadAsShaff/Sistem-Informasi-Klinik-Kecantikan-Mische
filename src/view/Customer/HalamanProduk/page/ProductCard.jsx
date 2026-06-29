import React from 'react';
import { Link } from 'react-router-dom';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';

/**
 * =========================================================================
 * KOTAK PAJANGAN SINGKAT PRODUK (ProductCard)
 * =========================================================================
 * Ibarat kotak etalase kaca kecil bergaya elegan tempat satu botol skincare dipajang.
 * Kotak ini memperlihatkan foto produk yang berkilau saat didekati dan label harga
 * berlatar hijau di bagian bawah untuk menggoda tamu melihat rinciannya.
 */
const ProductCard = ({ product }) => {
  return (
    <Link to={`/produk/${product.idProduk || product.id}`} className="bg-white rounded-tl-[60px] rounded-br-[60px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col w-full cursor-pointer">
      {/* Product Image Area */}
      <div className="bg-white flex justify-center items-center h-64 overflow-hidden relative">
        {product.gambar || product.image ? (
          <img 
            src={(product.gambar || product.image)?.startsWith?.('http') ? (product.gambar || product.image) : `${STORAGE_BASE_URL}${String(product.gambar || product.image).replace(/^(?:public\/|storage\/|\/)+/, '')}`} 
            alt={product.nama || product.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 drop-shadow-md"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>
      
      {/* Product Details Area */}
      <div className="bg-[#75BF53] text-white p-5">
        <h3 className="font-bold text-lg truncate" title={product.nama || product.name}>{product.nama || product.name}</h3>
        <p className="text-sm opacity-90 mt-1">{product.harga ? `Rp ${Number(product.harga).toLocaleString('id-ID')}` : product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;

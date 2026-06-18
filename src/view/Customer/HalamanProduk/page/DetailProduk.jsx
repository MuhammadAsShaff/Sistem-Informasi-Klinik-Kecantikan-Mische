import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useProdukData } from '../hooks/useProdukData';
import ProductGrid from './ProductGrid';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';
import { useCartContext } from '@/core/context/CartContext';

const DetailProduk = () => {
  const { id } = useParams();
  const { products, isLoading } = useProdukData();
  const { addToCart } = useCartContext();
  const product = products.find(p => (p.idProduk || p.id).toString() === id);
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
    }
  };

  if (isLoading) return <div className="text-center py-20 text-xl font-medium text-gray-500">Memuat produk...</div>;
  if (!product) return <div className="text-center py-20 text-xl font-bold">Produk tidak ditemukan</div>;

  return (
    <div className="bg-[#fafafa] min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-[820px]">
        
        {/* Detail Card */}
        <div className="bg-white rounded-tl-[60px] rounded-br-[60px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 md:p-14 lg:p-20 flex flex-col md:flex-row gap-10 lg:gap-20 items-center mb-16 border border-gray-50">
          {/* Image Area */}
          <div className="w-full md:w-2/5 flex justify-center">
            {(() => {
              const imgData = product.gambar || product.image;
              const imageSrc = imgData?.startsWith?.('http') || imgData?.startsWith?.('data:') || imgData?.startsWith?.('/src')
                ? imgData
                : imgData ? `${STORAGE_BASE_URL}${String(imgData).replace(/^(?:public\/|storage\/|\/)+/, '')}` : '';
                
              return imageSrc ? (
                <img 
                  src={imageSrc}
                  alt={product.nama || product.name} 
                  className="w-full h-auto max-h-[350px] object-contain drop-shadow-xl" 
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">No Image</div>
              );
            })()}
          </div>
          
          {/* Details Area */}
          <div className="w-full md:w-3/5 flex flex-col">
            <h1 className="text-4xl font-extrabold text-black mb-2">{product.nama || product.name}</h1>
            <p className="text-3xl font-extrabold text-black mb-8">
              {product.harga 
                ? `Rp ${Number(product.harga).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                : product.price}
            </p>
            
            <div className="flex flex-wrap items-center gap-10 mb-8">
              {/* Qty Selector */}
              <div className="flex items-center gap-6 text-[#69C146] font-bold text-2xl">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="hover:text-green-700 transition-colors">-</button>
                <span className="w-6 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="hover:text-green-700 transition-colors">+</button>
              </div>
              
              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                className="bg-[#69C146] hover:bg-[#5aa63c] text-white flex items-center gap-3 px-8 py-3 rounded-full font-bold transition-colors shadow-sm text-sm"
              >
                <ShoppingCart size={20} />
                Add To Cart
              </button>
            </div>
            <p className="text-gray-800 leading-relaxed text-base text-justify md:pr-10">
              {product.deskripsi || product.description || 'Deskripsi tidak tersedia.'}
            </p>
          </div>
        </div>

        {/* Produk Lain */}
        <div>
          <h2 className="text-3xl font-extrabold text-black mb-6 px-2">Produk Lain</h2>
          <ProductGrid products={products.filter(p => (p.idProduk || p.id).toString() !== id)} />
        </div>

      </div>

    </div>
  );
};

export default DetailProduk;

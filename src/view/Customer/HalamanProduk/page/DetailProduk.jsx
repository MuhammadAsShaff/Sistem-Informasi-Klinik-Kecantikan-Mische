import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useProdukData } from '../hooks/useProdukData';
import ProductGrid from './ProductGrid';

const DetailProduk = () => {
  const { id } = useParams();
  const { products } = useProdukData();
  const product = products.find(p => p.id === parseInt(id));
  const [qty, setQty] = useState(1);

  if (!product) return <div className="text-center py-20 text-xl font-bold">Produk tidak ditemukan</div>;

  return (
    <div className="bg-[#fafafa] min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        
        {/* Detail Card */}
        <div className="bg-white rounded-[2rem] shadow-sm p-6 md:p-12 flex flex-col md:flex-row gap-10 md:gap-16 items-center mb-20 border border-gray-100">
          {/* Image Area */}
          <div className="w-full md:w-1/3 flex justify-center">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto max-h-96 object-contain drop-shadow-xl" 
            />
          </div>
          
          {/* Details Area */}
          <div className="w-full md:w-2/3 flex flex-col">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{product.price}</p>
            
            <div className="flex flex-wrap items-center gap-6 mb-10">
              {/* Qty Selector */}
              <div className="flex items-center gap-6 text-2xl font-bold text-[#56BC36]">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="hover:text-green-700 transition-colors">-</button>
                <span className="text-gray-800 text-xl">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="hover:text-green-700 transition-colors">+</button>
              </div>
              
              {/* Add to Cart Button */}
              <button className="bg-[#56BC36] hover:bg-[#469e2c] text-white flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-colors shadow-md ml-0 md:ml-4">
                <ShoppingCart size={20} />
                Add To Cart
              </button>
            </div>
            
            <p className="text-gray-700 leading-relaxed text-base md:text-lg text-justify md:text-left">
              Serum Dengan Formula Aktif Yang Dirancang Untuk Membantu Meredakan Jerawat, Mengontrol Minyak Berlebih, Dan Mencegah Munculnya Jerawat Baru Tanpa Membuat Kulit Kering.
            </p>
          </div>
        </div>

        {/* Produk Lain */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 px-4 md:px-0">Produk Lain</h2>
          {/* Reuse the ProductGrid, passing all products for now */}
          <ProductGrid products={products.filter(p => p.id !== product.id)} />
        </div>

      </div>
    </div>
  );
};

export default DetailProduk;

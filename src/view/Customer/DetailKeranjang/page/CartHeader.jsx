import React from 'react';
import keranjangIcon from '@/assets/icons/keranjang (2).png';

/**
 * =========================================================================
 * PLANG PENUNJUK LORONG KERANJANG (CartHeader)
 * =========================================================================
 * Ibarat plang kayu berukir gambar keranjang emas di pintu masuk jalur kasir.
 * Menandakan dengan jelas kepada para tamu bahwa mereka kini sedang berada di
 * area peninjauan keranjang produk sebelum melangkah ke pembayaran.
 */
const CartHeader = () => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-10 h-10">
        <img src={keranjangIcon} alt="Keranjang Icon" className="w-full h-full object-contain" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
        Keranjang Produk
      </h1>
    </div>
  );
};

export default CartHeader;

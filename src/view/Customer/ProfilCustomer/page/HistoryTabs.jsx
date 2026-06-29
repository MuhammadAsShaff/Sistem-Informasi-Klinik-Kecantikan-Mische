import React from 'react';
import { ShoppingBag, BookmarkCheck } from 'lucide-react';
import { useHistoryTabs } from '../hooks/useHistoryTabs';

/**
 * =========================================================================
 * DUA PINTU MASUK LORONG ARSIP (HistoryTabs)
 * =========================================================================
 * Ibarat dua gapura elegan di lobi profil: satu bergapura hijau emas menuju
 * ruang riwayat pembelian produk, dan satu lagi bergapura asri menuju ruang riwayat reservasi.
 */
const HistoryTabs = () => {
    const { goToRiwayatPembelian, goToRiwayatReservasi } = useHistoryTabs();
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Riwayat Pembelian Produk */}
            <div 
                onClick={goToRiwayatPembelian}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 cursor-pointer hover:shadow-md transition-shadow group"
            >
                <div className="p-4 bg-gradient-to-br from-[#74b35e] via-[#9ade97] to-[#a3e69a] rounded-2xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                    <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Riwayat Pembelian</h3>
                    <p className="text-gray-500 font-bold text-lg leading-tight uppercase tracking-tight">Produk</p>
                </div>
            </div>

            {/* Riwayat Melakukan Reservasi */}
            <div 
                onClick={goToRiwayatReservasi}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 cursor-pointer hover:shadow-md transition-shadow group"
            >
                <div className="p-4 bg-white border-2 border-[#a3e69a] rounded-2xl shadow-sm group-hover:bg-[#f0fff4] transition-colors duration-300">
                    <div className="relative">
                        <BookmarkCheck className="w-10 h-10 text-[#74b35e]" />
                        <div className="absolute top-[-2px] right-[-2px] w-4 h-4 bg-[#74b35e] rounded-sm opacity-20"></div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Riwayat Melakukan</h3>
                    <p className="text-gray-500 font-bold text-lg leading-tight uppercase tracking-tight">Reservasi</p>
                </div>
            </div>
        </div>
    );
};

export default HistoryTabs;

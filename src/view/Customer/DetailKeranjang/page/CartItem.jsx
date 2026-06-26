import React from 'react';
import { Trash2 } from 'lucide-react';
import ModalKonfirmasiHapus from './ModalKonfirmasiHapus';
import { useCartItem } from '../hooks/useCartItem';

import { STORAGE_BASE_URL } from '@/core/api/endpoints';

const CartItem = ({ item, onQuantityChange, onToggleSelect, onRemove, formatRupiah }) => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDecrease,
    handleConfirmDelete
  } = useCartItem(item, onQuantityChange, onRemove);

  const imageSrc = item.image?.startsWith?.('http') || item.image?.startsWith?.('data:') 
    ? item.image 
    : item.image ? `${STORAGE_BASE_URL}${String(item.image).replace(/^(?:public\/|storage\/|\/)+/, '')}` : '';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => onToggleSelect(item.id)}
          className="w-6 h-6 text-[#5cb85c] bg-white border-2 border-[#5cb85c] rounded focus:ring-[#5cb85c] focus:ring-2 cursor-pointer"
        />
        
        {/* Product Image */}
        <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] text-gray-400">No Img</span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
          <p className="text-gray-600 font-medium">
            {formatRupiah(item.price)}
          </p>
        </div>
      </div>

      {/* Right side: Quantity Controls and Delete */}
      <div className="flex items-center gap-6">
        {/* Quantity Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleDecrease}
            className="text-[#5cb85c] font-bold text-2xl hover:text-green-700 transition-colors px-2"
          >
            -
          </button>
          <span className="text-[#5cb85c] font-bold text-xl w-6 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onQuantityChange(item.id, 1)}
            className="text-[#5cb85c] font-bold text-2xl hover:text-green-700 transition-colors px-2"
          >
            +
          </button>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 transition-colors p-2"
          title="Hapus Produk"
        >
          <Trash2 size={20} />
        </button>
      </div>
      {/* Modal Konfirmasi Hapus */}
      <ModalKonfirmasiHapus 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleConfirmDelete} 
      />
    </div>
  );
};

export default CartItem;

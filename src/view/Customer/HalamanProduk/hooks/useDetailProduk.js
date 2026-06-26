import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProdukData } from './useProdukData';
import { useCartContext } from '@/core/context/CartContext';

export const useDetailProduk = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, isLoading } = useProdukData();
  const { addToCart } = useCartContext();
  const product = products.find(p => (p.idProduk || p.id).toString() === id);
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
    }
  };

  const incrementQty = () => setQty(Math.min(product?.stok || product?.stock || 999, qty + 1));
  const decrementQty = () => setQty(Math.max(1, qty - 1));

  return {
    id,
    navigate,
    products,
    isLoading,
    product,
    qty,
    handleAddToCart,
    incrementQty,
    decrementQty
  };
};

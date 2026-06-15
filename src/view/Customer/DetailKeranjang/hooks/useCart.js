import { useCartContext } from '@/core/context/CartContext';

export const useCart = () => {
  return useCartContext();
};

import { useEffect } from 'react';

export const useToastAlert = (isOpen, onClose) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 800); // Otomatis hilang dalam 3 detik
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);
};

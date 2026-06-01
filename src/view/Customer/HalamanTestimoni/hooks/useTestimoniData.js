import { useState } from 'react';

export const useTestimoniData = () => {
  const [testimonials] = useState([
    {
      id: 1,
      name: 'Bintang',
      description: 'Saya Sangat Senang Bisa Treatment Di Klinik Terbaik Di Pekanbaru Ini...',
    },
    {
      id: 2,
      name: 'Bintang',
      description: 'Saya Sangat Senang Bisa Treatment Di Klinik Terbaik Di Pekanbaru Ini...',
    },
    {
      id: 3,
      name: 'Bintang',
      description: 'Saya Sangat Senang Bisa Treatment Di Klinik Terbaik Di Pekanbaru Ini...',
    }
  ]);

  return {
    testimonials
  };
};

import { useParams } from 'react-router-dom';
import { useTestimoniData } from './useTestimoniData';

/**
 * =========================================================================
 * ASISTEN REKAM JEJAK TESTIMONI (useDetailTestimoni)
 * =========================================================================
 * Ibarat asisten peneliti yang mendampingi tamu di ruang pengumuman ulasan:
 * 1. Melihat nomor map ulasan tamu (ID dari URL).
 * 2. Mengambil kumpulan buku cerita kesaksian (useTestimoniData).
 * 3. Menyodorkan lembaran kisah nyata dari pasien yang nomornya persis sama kepada tamu.
 */
export const useDetailTestimoni = () => {
  const { id } = useParams();
  const { testimonials } = useTestimoniData();

  // Find the testimonial (dummy data, normally from API)
  const testimonial = testimonials.find(t => t.id === parseInt(id));

  return {
    testimonial,
  };
};

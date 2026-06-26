import { useParams } from 'react-router-dom';
import { useTestimoniData } from './useTestimoniData';

export const useDetailTestimoni = () => {
  const { id } = useParams();
  const { testimonials } = useTestimoniData();

  // Find the testimonial (dummy data, normally from API)
  const testimonial = testimonials.find(t => t.id === parseInt(id));

  return {
    testimonial,
  };
};

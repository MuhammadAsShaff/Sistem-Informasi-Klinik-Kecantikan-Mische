import React from 'react';
import TestimoniHeader from './TestimoniHeader';
import TestimoniCard from './TestimoniCard';
import { useTestimoniData } from '../hooks/useTestimoniData';
import CustomerLoading from '@/components/CustomerLoading';

const HalamanTestimoni = () => {
  const { testimonials, isLoading } = useTestimoniData();

  return (
    <div className="min-h-screen bg-[#fafafa] py-10 px-4 md:px-8 lg:px-16 font-sans">
      <div className="max-w-7xl mx-auto">
        <TestimoniHeader />
        
        {/* Grid Testimonials */}
        {isLoading ? (
          <CustomerLoading text="Memuat daftar testimoni..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
            {testimonials.map((testimonial) => (
            <TestimoniCard 
              key={testimonial.id} 
              id={testimonial.id}
              name={testimonial.name} 
              description={testimonial.description} 
              foto={testimonial.foto}
            />
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HalamanTestimoni;

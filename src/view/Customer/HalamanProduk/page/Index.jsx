import React from 'react';
import HeroSection from './HeroSection';
import DescriptionSection from './DescriptionSection';
import CategoryTabs from './CategoryTabs';
import ProductGrid from './ProductGrid';
import { useProdukData } from '../hooks/useProdukData';

const Index = () => {
  const { activeCategory, setActiveCategory, filteredProducts, categories, isLoading } = useProdukData();

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      <HeroSection />
      <DescriptionSection />
      <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} categories={categories} />
      {isLoading ? (
        <div className="flex justify-center py-20 text-gray-500">Memuat produk...</div>
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
    </div>
  );
};

export default Index;

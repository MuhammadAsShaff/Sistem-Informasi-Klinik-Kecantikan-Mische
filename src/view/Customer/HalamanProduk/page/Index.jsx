import React from 'react';
import HeroSection from './HeroSection';
import DescriptionSection from './DescriptionSection';
import CategoryTabs from './CategoryTabs';
import ProductGrid from './ProductGrid';
import { useProdukData } from '../hooks/useProdukData';
import CustomerLoading from '@/components/CustomerLoading';

const Index = () => {
  const { activeCategory, setActiveCategory, filteredProducts, categories, isLoading } = useProdukData();

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      <HeroSection />
      <DescriptionSection />
      <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} categories={categories} />
      {isLoading ? (
        <CustomerLoading text="Memuat daftar produk..." />
      ) : (
        <div className="container mx-auto px-10 max-w-[820px]">
          <ProductGrid products={filteredProducts} />
        </div>
      )}
    </div>
  );
};

export default Index;

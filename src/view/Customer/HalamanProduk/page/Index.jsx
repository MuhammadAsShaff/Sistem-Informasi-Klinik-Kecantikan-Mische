import React from 'react';
import HeroSection from './HeroSection';
import DescriptionSection from './DescriptionSection';
import CategoryTabs from './CategoryTabs';
import ProductGrid from './ProductGrid';
import { useProdukData } from '../hooks/useProdukData';
import CustomerLoading from '@/components/CustomerLoading';

/**
 * =========================================================================
 * BALAI ANJUNGAN PAMERAN SKINCARE (HalamanProduk)
 * =========================================================================
 * Ibarat seluruh area hall pameran skincare Mische. Saat melangkah masuk, tamu
 * disambut Gerbang Penyambutan (HeroSection), membaca Plang Manfaat (DescriptionSection),
 * memilih Laci Tab Kelompok (CategoryTabs), dan meninjau Etalase Barang (ProductGrid) yang diawasi oleh Mandor Gudang Katalog (useProdukData).
 */
const Index = () => {
  const { activeCategory, setActiveCategory, filteredProducts, categories, isLoading } = useProdukData();

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      <HeroSection />
      <DescriptionSection />
      <div id="katalog-produk" className="scroll-mt-10">
        <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} categories={categories} />
      </div>
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

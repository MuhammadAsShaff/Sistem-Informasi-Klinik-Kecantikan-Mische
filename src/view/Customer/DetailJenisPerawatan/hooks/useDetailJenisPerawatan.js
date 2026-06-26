import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { treatments } from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/hooks/TreatmentsData';
import { dataJenisPerawatan } from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/hooks/DataJenisPerawatan';

/**
 * =========================================================================
 * CUSTOM HOOK: useDetailJenisPerawatan
 * =========================================================================
 * Hook ini mengelola logika untuk halaman Detail Jenis Perawatan:
 * 1. Mengambil parameter ID kategori dari rute URL.
 * 2. Mencari data kategori perawatan yang sesuai dari file treatments static.
 * 3. Memfilter daftar perawatan (treatment) berdasarkan ID kategori tersebut.
 * 4. Melakukan scroll otomatis ke atas layar saat halaman pertama kali dibuka.
 */
export function useDetailJenisPerawatan() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Menentukan ID kategori dari parameter URL (default: Kategori ID 1)
  const categoryId = parseInt(id) || 1;
  
  // Mencari detail kategori dari daftar kategori
  const category = treatments.find(t => t.id === categoryId) || treatments[0];

  // Memfilter variasi jenis perawatan berdasarkan categoryId
  const items = dataJenisPerawatan.filter(item => item.categoryId === categoryId);

  // Efek Samping: Reset posisi scroll ke atas saat memuat halaman
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return {
    category,
    items,
    navigate
  };
}

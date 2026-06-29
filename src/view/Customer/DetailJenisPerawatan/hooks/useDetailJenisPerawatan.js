import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { treatments } from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/hooks/TreatmentsData';
import { dataJenisPerawatan } from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/hooks/DataJenisPerawatan';

/**
 * =========================================================================
 * MANDOR ARSIP KLASIFIKASI PERAWATAN (useDetailJenisPerawatan)
 * =========================================================================
 * Ibarat kepala pustakawan yang khusus menjaga laci arsip perawatan di klinik:
 * 1. Melihat nomor map (ID kategori) yang dibawa oleh tamu dari lorong depan.
 * 2. Membuka laci rak buku utama untuk mencocokkan sampul kategori perawatan (t.id === categoryId).
 * 3. Mengumpulkan seluruh brosur variasi perawatan yang sesuai dengan map tersebut.
 * 4. Merapikan karpet penyambutan dengan mengarahkan mata tamu langsung ke puncak atas halaman (scrollTo 0,0).
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

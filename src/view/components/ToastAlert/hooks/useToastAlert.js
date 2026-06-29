import { useEffect } from 'react';

/**
 * =========================================================================
 * ASISTEN PEMEGANG STOPWATCH NOTIFIKASI (useToastAlert)
 * =========================================================================
 * Ibarat seorang petugas cerdik yang memegang jam pasir atau stopwatch di samping
 * papan pengumuman kilat. Begitu papan pengumuman diangkat (isOpen: true), petugas
 * ini langsung menghitung hingga 800 milidetik (kurang dari sedetik), lalu menarik
 * tuas penutup (onClose) agar papan tersebut segera disingkirkan tanpa merepotkan tamu.
 */
export const useToastAlert = (isOpen, onClose) => {
  // ─── TUGAS PENGHITUNGAN JAM PASIR (useEffect) ─────────────────────────────
  // Terpicu seketika setiap kali status rebah/berdirinya plang (isOpen) berganti
  useEffect(() => {
    // Jika plang pengumuman nyata-nyata sedang berdiri tegak (isOpen: true)
    if (isOpen) {
      // Nyalakan jam pasir stopwatch selama 800 milidetik
      const timer = setTimeout(() => {
        // Begitu pasir habis, bunyikan lonceng onClose untuk merobohkan plang
        onClose();
      }, 800); // Otomatis hilang dalam waktu singkat
      
      // Jika sebelum jam pasir habis tamu pergi atau plang diganti, pecahkan jam pasir tersebut (clearTimeout)
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);
};


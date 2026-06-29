import { useParams } from 'react-router-dom';
import { useDokterData } from './useDokterData';

/**
 * =========================================================================
 * ASISTEN PENCARI BUKU BIOGRAFI DOKTER (useDetailDokter)
 * =========================================================================
 * Ibarat asisten perpustakaan di klinik yang melihat nomor identitas (ID) dari
 * tiket tamu, lalu segera berlari ke rak arsip mandor dokter (useDokterData)
 * untuk mengambil buku riwayat lengkap sang dokter.
 */
export const useDetailDokter = () => {
  const { id } = useParams();
  const { getDoctorById, isLoading } = useDokterData();
  const doctor = getDoctorById(id);

  return { doctor, isLoading };
};

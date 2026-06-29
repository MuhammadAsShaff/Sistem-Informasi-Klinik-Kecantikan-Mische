import { useNavigate } from 'react-router-dom';

/**
 * =========================================================================
 * PETUGAS PENGATUR ARSIP RIWAYAT (useHistoryTabs)
 * =========================================================================
 * Ibarat pemandu lobi yang memegang dua anak kunci pintu: satu untuk masuk
 * ke ruang arsip belanjaan produk, dan satu lagi untuk masuk ke ruang arsip reservasi.
 */
export const useHistoryTabs = () => {
    const navigate = useNavigate();

    return {
        goToRiwayatPembelian: () => navigate('/ProfilCustomer/riwayat-pembelian'),
        goToRiwayatReservasi: () => navigate('/ProfilCustomer/riwayat-reservasi')
    };
};

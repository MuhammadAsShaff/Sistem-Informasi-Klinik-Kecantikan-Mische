import { useNavigate } from 'react-router-dom';

export const useHistoryTabs = () => {
    const navigate = useNavigate();

    return {
        goToRiwayatPembelian: () => navigate('/ProfilCustomer/riwayat-pembelian'),
        goToRiwayatReservasi: () => navigate('/ProfilCustomer/riwayat-reservasi')
    };
};

import { useParams } from 'react-router-dom';
import { useDokterData } from './useDokterData';

export const useDetailDokter = () => {
  const { id } = useParams();
  const { getDoctorById, isLoading } = useDokterData();
  const doctor = getDoctorById(id);

  return { doctor, isLoading };
};

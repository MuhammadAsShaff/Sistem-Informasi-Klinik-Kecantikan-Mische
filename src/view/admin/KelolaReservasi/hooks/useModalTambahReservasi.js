import { useState, useEffect, useMemo } from 'react';
import { useFetchDokter } from '../../KelolaProfilDokter/hooks/useFetchDokter';
import { useFetchPublicJadwal } from '../../../Customer/ReservasiPage/hooks/useFetchPublicJadwal';
import { treatments as listKategoriTreatment } from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/hooks/TreatmentsData';
import { dataJenisPerawatan } from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/hooks/DataJenisPerawatan';

export const useModalTambahReservasi = (isOpen, onSubmit) => {
  const [formData, setFormData] = useState({
    namaCustomer: '',
    nomorWa: '',
    jenisTreatment: '',
    tanggalReservasi: '', 
    idDokter: '',
    idJadwal: ''
  });

  const [jamSelesai, setJamSelesai] = useState('');

  // Fetch data untuk dropdown
  const { dataDokter } = useFetchDokter();
  
  // Fetch jadwal publik yang mengecek ketersediaan jadwal
  const { dataJadwal } = useFetchPublicJadwal(formData.tanggalReservasi, formData.idDokter);

  // Hanya tampilkan jadwal yang statusnya "Tersedia"
  const jadwalTersedia = useMemo(() => {
    if (!dataJadwal || !Array.isArray(dataJadwal)) return [];
    return dataJadwal.filter(j => j.status === 'Tersedia' || !j.status);
  }, [dataJadwal]);

  // Derived state untuk jenis treatment dropdown (menampilkan semua)
  const availableJenisTreatments = dataJenisPerawatan.map(item => item.title);

  // Saat modal terbuka, paksa set tanggal hari ini
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setFormData({
        namaCustomer: '',
        nomorWa: '',
        jenisTreatment: '',
        tanggalReservasi: `${yyyy}-${mm}-${dd}`,
        idDokter: '',
        idJadwal: ''
      });
      setJamSelesai('');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Jika user memilih Jam Mulai (idJadwal), otomatis cari jam selesai
    if (name === 'idJadwal') {
      const selectedJadwal = dataJadwal.find(j => String(j.idJadwal) === String(value));
      if (selectedJadwal) {
        setJamSelesai(selectedJadwal.jamSelesai.substring(0, 5) + ' WIB');
      } else {
        setJamSelesai('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hitung kategori berdasarkan jenis treatment
    const selectedTreatmentObj = dataJenisPerawatan.find(t => t.title === formData.jenisTreatment);
    const selectedKategoriObj = listKategoriTreatment.find(c => c.id === selectedTreatmentObj?.categoryId);
    const kategoriValue = selectedKategoriObj ? selectedKategoriObj.title : '';

    onSubmit({
      ...formData,
      kategoriReservasi: kategoriValue,
      jenisReservasi: formData.jenisTreatment,
      idDokter: parseInt(formData.idDokter) || '',
      idJadwal: parseInt(formData.idJadwal) || ''
    });
  };

  return {
    formData,
    jamSelesai,
    dataDokter,
    jadwalTersedia,
    availableJenisTreatments,
    handleChange,
    handleSubmit
  };
};

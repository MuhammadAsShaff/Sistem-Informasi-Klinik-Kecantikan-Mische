import { useState, useEffect, useMemo } from 'react';
import { useFetchDokter } from '../../KelolaProfilDokter/hooks/useFetchDokter';
import { useFetchPublicJadwal } from '../../../Customer/ReservasiPage/hooks/useFetchPublicJadwal';
import { treatments as listKategoriTreatment } from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/hooks/TreatmentsData';
import { dataJenisPerawatan } from '@/view/Customer/LandingPage/page/SectionInfoPerawatan/hooks/DataJenisPerawatan';

/**
 * =========================================================================
 * ASISTEN PENGECEK JADWAL & DOKTER TAMU (useModalTambahReservasi)
 * =========================================================================
 * Ibarat asisten pendaftaran cerdas yang duduk di meja penerima tamu klinik.
 * Tugas utama asisten ini meliputi:
 * 1. Menjaga kertas formulir pendaftaran berisi nama tamu, WhatsApp, jenis perawatan, dan nama dokter.
 * 2. Mengambil daftar nama dokter aktif dari papan profil dokter (useFetchDokter).
 * 3. Begitu tanggal dan dokter dipilih, asisten berlari melihat papan jadwal dokter (useFetchPublicJadwal)
 *    untuk memastikan jam mana saja yang masih kosong ("Tersedia").
 * 4. Menemukan sendiri kategori besar perawatan berdasarkan jenis treatment yang dipilih.
 */
export const useModalTambahReservasi = (isOpen, onSubmit) => {
  // Kertas formulir pendaftaran kosong tempat mencatat identitas tamu
  const [formData, setFormData] = useState({
    namaCustomer: '',
    nomorWa: '',
    jenisTreatment: '',
    tanggalReservasi: '', 
    idDokter: '',
    idJadwal: ''
  });

  // Catatan jam selesai perawatan yang dihitung otomatis oleh asisten
  const [jamSelesai, setJamSelesai] = useState('');

  // Meminta daftar nama dokter dari gudang arsip dokter
  const { dataDokter } = useFetchDokter();
  
  // Meminta daftar jadwal dokter berdasarkan tanggal dan dokter yang dipilih di formulir
  const { dataJadwal } = useFetchPublicJadwal(formData.tanggalReservasi, formData.idDokter);

  /**
   * PENCEGAH BENTROK JADWAL (jadwalTersedia)
   * Asisten menyaring jadwal dan hanya memajang jam yang berstatus "Tersedia" di atas meja kerja.
   */
  const jadwalTersedia = useMemo(() => {
    if (!dataJadwal || !Array.isArray(dataJadwal)) return [];
    return dataJadwal.filter(j => j.status === 'Tersedia' || !j.status);
  }, [dataJadwal]);

  // Menyalin daftar seluruh jenis perawatan yang ditawarkan di klinik
  const availableJenisTreatments = dataJenisPerawatan.map(item => item.title);

  /**
   * EFEK SAMPING: MENGATUR KALENDER KE HARI INI SAAT MEJA DIBUKA
   * Begitu meja pendaftaran dibuka (isOpen), asisten langsung menuliskan tanggal hari ini 
   * di atas kertas formulir dan menghapus sisa coretan lama.
   */
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

  /**
   * PENCATAT SETIAP CORETAN PENA (handleChange)
   * Setiap kali admin mengetik huruf atau memilih jam, asisten mencatatnya.
   * Jika yang dipilih adalah Jam Mulai (idJadwal), asisten otomatis mencari jam selesainya.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Jika admin memilih Jam Mulai, asisten membeberkan jam selesainya di kotak bawah
    if (name === 'idJadwal') {
      const selectedJadwal = dataJadwal.find(j => String(j.idJadwal) === String(value));
      if (selectedJadwal) {
        setJamSelesai(selectedJadwal.jamSelesai.substring(0, 5) + ' WIB');
      } else {
        setJamSelesai('');
      }
    }
  };

  /**
   * TUGAS PENGIRIMAN FORMULIR PENDAFTARAN (handleSubmit)
   * Asisten melacak kategori besar dari jenis perawatan, membungkusnya rapi, lalu menyerahkannya kepada mandor.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Asisten mencocokkan jenis perawatan dengan kamus kategori besar (misal: Acne Treatment masuk ke kategori Skincare)
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

  // Asisten menyerahkan pena, laci dokter, dan jadwal kosong kepada meja kerja pendaftaran (view)
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

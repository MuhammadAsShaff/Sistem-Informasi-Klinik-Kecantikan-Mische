import { useState, useEffect, useRef } from 'react';

/**
 * ASISTEN JURU TULIS BUKU TENTANG KAMI (usePengaturanTentangKami)
 * Ibarat asisten trampil di meja pengisian buku riwayat klinik. Asisten ini menyodorkan kertas 
 * formulir berisikan cerita klinik, visi, misi, jam operasional, nomor telepon CS, dan foto gedung.
 * Asisten ini punya dua keahlian khusus: 
 * 1. Mencegah huruf masuk ke kotak nomor telepon (menyeleksi angka saja).
 * 2. Mengukur berat foto gedung (maksimal 2MB) dan mencetaknya ke standar JPEG sebelum disimpan.
 */
export const usePengaturanTentangKami = (data, onSimpan, onError) => {
  // 1. KERTAS FORMULIR ISIAN BUKU TENTANG KAMI
  const [formData, setFormData] = useState({
    deskripsiPerusahaan: '', // Cerita singkat tentang klinik
    visi: '', // Tujuan besar klinik (Visi)
    misi: '', // Langkah-langkah mencapai tujuan (Misi)
    jamBuka: '', // Jam pintu klinik dibuka
    jamTutup: '', // Jam pintu klinik ditutup
    nomorCustomerService: '', // Nomor WA/Telepon CS
    fotoPerusahaan: null // Bukti foto gedung klinik
  });
  
  // Lukisan intip foto gedung di layar
  const [previewImage, setPreviewImage] = useState(null);
  // Stempel tanda jika foto melanggar batas berat
  const [hasFileError, setHasFileError] = useState(false);
  // Kotak laci tempat menaruh berkas foto
  const fileInputRef = useRef(null);

  // 2. MENGISI FORMULIR DENGAN CATATAN LAMA SAAT MEJA DIBUKA
  useEffect(() => {
    if (data) {
      // Menyalin catatan buku riwayat lama ke kertas formulir
      setFormData({
        deskripsiPerusahaan: data.deskripsiPerusahaan || '',
        visi: data.visi || '',
        misi: data.misi || '',
        jamBuka: data.jamBuka ? data.jamBuka.substring(0, 5) : '', // Ambil format jam:menit
        jamTutup: data.jamTutup ? data.jamTutup.substring(0, 5) : '',
        nomorCustomerService: data.nomorCustomerService || '',
        fotoPerusahaan: null
      });
      // Pasang foto gedung lama di pajangan intip
      setPreviewImage(data.fotoPerusahaan ? `http://127.0.0.1:8000/storage/${data.fotoPerusahaan}` : null);
    } else {
      // Jika belum ada buku riwayat, berikan kertas formulir kosong bersih
      setFormData({
        deskripsiPerusahaan: '', visi: '', misi: '', jamBuka: '', jamTutup: '', nomorCustomerService: '', fotoPerusahaan: null
      });
      setPreviewImage(null);
    }
    
    // Pastikan laci foto dibersihkan dari berkas sisa
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [data]);

  // Fungsi saat admin mencatat tulisan baru di kertas formulir
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nomorCustomerService') {
      // Saringan otomatis: Hanya memperbolehkan angka murni, buang huruf atau simbol
      const numericValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Fungsi pengawasan saat admin menaruh foto gedung baru
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Timbangan otomatis: Jika melebihi 2MB, tolak dan laporkan teguran
      if (file.size > 2 * 1024 * 1024) {
        onError("Ukuran file terlalu besar! Maksimal 2MB.");
        setHasFileError(true);
        e.target.value = '';
        return;
      }
      
      // Meminta tukang cetak mengubah format foto ke standar JPEG
      const { convertToJPEG } = await import('@/utils/imageConverter');
      const convertedFile = await convertToJPEG(file);
      
      setHasFileError(false);
      setFormData({ ...formData, fotoPerusahaan: convertedFile });
      setPreviewImage(URL.createObjectURL(convertedFile)); // Pasang di pajangan intip
    }
  };

  // 3. PEMERIKSAAN AKHIR SEBELUM MAP DISERAHKAN KE MANDOR
  const handleSubmit = () => {
    // Pemeriksaan ketat: Tidak boleh ada kotak isian yang dibiarkan kosong
    if (!formData.deskripsiPerusahaan || !formData.visi || !formData.misi || !formData.jamBuka || !formData.jamTutup || !formData.nomorCustomerService) {
      onError("Isi profile klinik sesuai dengan ketentuan inputan!");
      return;
    }
    
    // Jika belum ada foto gedung sama sekali, paksa admin mengunggahnya
    if (!data?.fotoPerusahaan && !formData.fotoPerusahaan) {
      onError("Isi profile klinik sesuai dengan ketentuan inputan!");
      return;
    }

    // Menyerahkan map isian lengkap ke fungsi penyimpan utama
    onSimpan(formData);
  };

  // Asisten menyerahkan formulir dan seluruh perlengkapannya ke meja utama
  return {
    formData,
    setFormData,
    previewImage,
    hasFileError,
    fileInputRef,
    handleChange,
    handleFileChange,
    handleSubmit
  };
};

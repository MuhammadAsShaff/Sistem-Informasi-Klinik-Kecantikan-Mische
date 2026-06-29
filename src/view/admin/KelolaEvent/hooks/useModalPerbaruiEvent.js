import { useState, useEffect } from 'react';
// Mengimpor asisten kurir khusus pengirim data perbaikan ke server
import { useEditEvent } from './useEditEvent';
// Mengimpor alat penyulap file gambar (untuk mengecilkan dan mengubah gambar menjadi format standar JPEG)
import { convertToJPEG } from '@/utils/imageConverter';

/**
 * =========================================================================
 * ASISTEN PENJAGA FORMULIR EDIT (useModalPerbaruiEvent)
 * =========================================================================
 * Bayangkan file ini sebagai "Asisten Penjaga Formulir Edit". Tugas utamanya:
 * 1. Mengisi formulir secara otomatis dengan data event lama begitu jendela pop-up dibuka.
 * 2. Memperhatikan dan mencatat setiap ketikan baru admin di kotak isian.
 * 3. Menyulap (mengonversi) file foto baru yang dipilih menjadi format JPEG standar.
 * 4. Meminta asisten `useEditEvent` untuk mengantarkan formulir matang ini ke server.
 * 
 * Asisten ini dibekali 4 titipan pesan:
 * - event     : Biodata event lama yang dipakai untuk mengisi formulir di awal.
 * - refetch   : Tombol penyegar halaman agar tabel langsung berubah setelah sukses simpan.
 * - showToast : Pop-up pemberitahuan untuk bilang "Berhasil!" atau "Gagal".
 * - onClose   : Perintah menutup jendela pop-up setelah pengiriman kelar.
 */
export const useModalPerbaruiEvent = (event, refetch, showToast, onClose) => {
  // 1. MENGHUBUNGKAN KURIR UTAMA PERBAIKAN
  // Kita hubungkan dengan useEditEvent dan menitipkan tombol refetch kepadanya
  const { editEvent } = useEditEvent(refetch);

  // 2. KOTAK PENYIMPAN ISIAN FORMULIR (FORM STATE)
  // Laci penyimpanan ini memegang tulisan yang muncul di dalam kotak teks formulir
  const [formData, setFormData] = useState({
    nama: '',
    lokasi: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    deskripsi: '',
    foto: null
  });

  // Rambu tanda sibuk ('true') agar admin tidak mengklik tombol Simpan dua kali saat kurir masih lari ke server
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =======================================================================
  // 3. TUGAS PENGISIAN OTOMATIS (AUTO-FILL EFFECT)
  // =======================================================================
  /**
   * Begitu pop-up dibuka dan menerima kiriman 'event', asisten langsung menyalin 
   * tulisan dari event lama tersebut ke dalam kotak-kotak isian formulir.
   */
  useEffect(() => {
    if (event) {
      setFormData({
        nama: event.nama || '',
        lokasi: event.lokasi || '',
        /* 
          Meracik tanggalan:
          Kalau server mengirim format panjang seperti '2026-06-28 10:30:00', 
          kita potong spasi dan ambil bagian pertamanya saja ('2026-06-28') 
          agar pas dengan kalender di kotak input tanggal.
        */
        tanggalMulai: event.tanggalMulai ? event.tanggalMulai.split(' ')[0] : '',
        tanggalSelesai: event.tanggalSelesai ? event.tanggalSelesai.split(' ')[0] : '',
        deskripsi: event.deskripsi || '',
        foto: null // Foto dibiarkan kosong dulu, kecuali admin sengaja memilih file foto baru
      });
    }
  }, [event]);

  // =======================================================================
  // 4. TUGAS SAAT ADMIN MENGETIK / MILIH FOTO (CHANGE HANDLER)
  // =======================================================================
  /**
   * Fungsi ini memantau setiap huruf yang diketik atau file foto yang diplih admin.
   */
  const handleChange = async (e) => {
    // Membongkar nama kotak, tulisan di dalamnya, jenis kotaknya, dan file yang dipilih
    const { name, value, type, files } = e.target;

    // Kalau kotak yang diubah itu adalah tempat memasukkan file (foto)
    if (type === 'file') {
      const file = files[0]; // Ambil file pertama yang dipilih
      if (file) {
        // Sulap file gambar tersebut menjadi format JPEG menggunakan alat convertToJPEG
        const converted = await convertToJPEG(file);
        // Masukkan hasil sulapan tersebut ke dalam laci formData
        setFormData(prev => ({ ...prev, [name]: converted }));
      }
    } else {
      // Kalau admin cuma mengetik teks biasa, langsung salin ketikannya ke laci yang pas
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // =======================================================================
  // 5. TUGAS SAAT TOMBOL 'SIMPAN' DITEKAN (SUBMIT HANDLER)
  // =======================================================================
  /**
   * Mengemas isian formulir ke dalam kotak bungkusan khusus dan mengirimkannya lewat kurir editEvent.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah halaman web me-refresh secara mendadak saat tombol ditekan
    if (!event) return; // Tombol Pengaman: kalau tidak ada event yang mau diperbaiki, hentikan!

    setIsSubmitting(true); // Nyalakan animasi berputar pada tombol Simpan (kunci tombolnya)

    /*
      Membuat Bungkusan Khusus (FormData):
      Karena kita melampirkan file gambar, kita wajib membungkusnya ke dalam kotak 
      bernama `FormData` agar kurir web bisa membawanya dengan aman ke server.
    */
    const payload = new FormData();
    payload.append('nama', formData.nama);
    payload.append('lokasi', formData.lokasi);
    payload.append('tanggalMulai', formData.tanggalMulai);
    payload.append('tanggalSelesai', formData.tanggalSelesai);
    payload.append('deskripsi', formData.deskripsi);

    // Memeriksa apakah ada file foto baru yang mau ikut dikirim
    // Kita cek nama lacinya, apakah admin menaruhnya di 'fotoBaru' atau di 'foto'
    if (formData.fotoBaru) {
      payload.append('foto', formData.fotoBaru);
    } else if (formData.foto) {
      payload.append('foto', formData.foto);
    }

    // Perintahkan kurir 'editEvent' membawa bungkusan ini ke alamat server
    const result = await editEvent(event.id || event.idEvent, payload);

    setIsSubmitting(false); // Matikan putaran animasi loading

    // Kita periksa laporan hasil kerja kurir:
    if (result.success) {
      showToast("Hore! Berhasil memperbarui event"); // Munculkan pop-up pemberitahuan hijau
      onClose(); // Tutup jendela pop-up formulir
    } else {
      showToast(result.message, "error"); // Munculkan pop-up pemberitahuan merah (gagal)
    }
  };

  // Asisten menyerahkan catatan formulir dan pengendali tombol ke tampilan ModalPerbaruiEvent
  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit
  };
};


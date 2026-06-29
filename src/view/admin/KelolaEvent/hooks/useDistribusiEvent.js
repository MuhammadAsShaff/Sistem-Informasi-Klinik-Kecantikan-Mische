import { useState, useEffect } from 'react';
// Mengimpor 'axiosClient', ibarat telepon khusus untuk menghubungi server (backend) klinik Mische
import axiosClient from '@/core/api/axiosClient';
// Mengimpor 'endpoints', yaitu buku daftar nomor telepon atau alamat tujuan di server
import { endpoints } from '@/core/api/endpoints';

/**
 * =========================================================================
 * ASISTEN PENGIRIMAN EVENT (useDistribusiEvent)
 * =========================================================================
 * Bayangkan file ini sebagai "Asisten Kurir Pribadi" di klinik kecantikan Mische.
 * Tugas khususnya adalah menyebarkan (mendistribusikan) kabar promo atau event
 * terbaru kepada para customer melalui pesan WhatsApp.
 * 
 * Rincian tugas spesifik asisten ini:
 * 1. Menjemput buku daftar nama customer dari server (bisa dicari lewat nama).
 * 2. Menyediakan keranjang untuk menampung customer yang dicentang (mau pilih satu-satu atau semua sekaligus).
 * 3. Menghubungi server untuk mengirimkan pesan siaran (broadcast) ke nomor WhatsApp mereka.
 * 
 * Modal ini dibekali 4 titipan pesan (props):
 * - isOpen    : Tombol saklar (benar = jendela terbuka, salah = tertutup).
 * - onClose   : Perintah untuk menutup jendela jika pengiriman sudah selesai.
 * - event     : Bungkusan data event (judul promo, tanggal) yang mau disebarkan.
 * - showToast : Layanan pop-up kecil untuk memberi tahu "Hore, terkirim!" atau "Yaaah, gagal".
 */
export function useDistribusiEvent({ isOpen, onClose, event, showToast }) {
  
  // =======================================================================
  // 1. LACI-LACI PENCATATAN ASISTEN (STATE MANAGEMENT)
  // =======================================================================

  // 1. targetType: Laci pengingat menu apa yang dipilih, apakah mau 'Pilih Customer' satu-satu atau borongan 'Semua Customer'
  const [targetType, setTargetType] = useState('Pilih Customer'); 

  // 2. searchQuery: Kotak catatan kecil tempat menyimpan ketikan nama customer yang sedang dicari
  const [searchQuery, setSearchQuery] = useState(''); 

  // 3. selectedCustomers: Keranjang belanja tempat mengumpulkan nomor KTP (ID) customer yang sudah dicentang
  const [selectedCustomers, setSelectedCustomers] = useState([]); 

  // 4. customers: Buku biodata lengkap (nama, nomor WA) milik seluruh customer yang berhasil dibawa pulang dari server
  const [customers, setCustomers] = useState([]); 

  // 5. isFetching: Rambu tanda sibuk ('true') saat asisten sedang berlari mengambil daftar customer dari server
  const [isFetching, setIsFetching] = useState(false); 

  // 6. isSubmitting: Rambu tanda sibuk ('true') saat kurir sedang sibuk mengepak dan memaketkan pesan ke WhatsApp
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // =======================================================================
  // 2. TUGAS MENJEMPUT DAFTAR CUSTOMER (FETCHING LOGIC)
  // =======================================================================
  /**
   * Fungsi ini bertugas menelepon server backend untuk meminta daftar nama customer.
   * Jika admin mengetik nama di kotak pencarian, kita beri tahu server agar hanya mengirim nama yang cocok.
   */
  const fetchCustomers = async (search = '') => {
    setIsFetching(true); // Kurir mulai berangkat (tampilkan animasi berputar di layar)
    try {
      // Meracik alamat tujuan: Jika ada tulisan yang dicari, pasang kata kunci di ujung alamat telepon
      const url = search 
        ? `${endpoints.admin.distribusi.customers}?search=${encodeURIComponent(search)}` 
        : endpoints.admin.distribusi.customers;
      
      // Menelepon server dengan sopan (metode GET = meminta data)
      const res = await axiosClient.get(url);
      console.log('Catatan dari server (Distribusi Customers):', res.data);
      
      // Jika server menjawab "Oke, ini datanya sukses!":
      if (res.data?.status === 'success') {
        // Kita seragamkan baju datanya agar rapi: 'idUser' kita panggil 'id', 'nama' jadi 'name', dan 'nomorWa' jadi 'phone'
        setCustomers(res.data.data.map(c => ({ id: c.idUser, name: c.nama, phone: c.nomorWa })));
      }
    } catch (error) {
      // Jika telepon terputus atau server sedang ngambek, catat kesalahannya di buku catatan rahasia browser
      console.error("Gagal mengambil data customer:", error);
    } finally {
      setIsFetching(false); // Kurir sudah pulang (matikan animasi berputar)
    }
  };

  // =======================================================================
  // 3. PERSIAPAN OTOMATIS ASISTEN (SIDE EFFECTS)
  // =======================================================================
  
  /**
   * PERSIAPAN 1: MEMBERSIHKAN MEJA SAAT JENDELA DIBUKA
   * Setiap kali jendela distribusi ini dibuka (isOpen = true), asisten akan langsung 
   * membersihkan keranjang lama, mengosongkan kolom cari, dan menyegarkan ulang daftar customer.
   */
  useEffect(() => {
    if (isOpen) {
      console.log('Event yang disiapkan untuk dikirim:', event);
      setTargetType('Pilih Customer'); // Kembalikan menu ke pilih manual
      setSearchQuery('');              // Hapus ketikan pencarian lama
      setSelectedCustomers([]);        // Kosongkan keranjang centangan
      fetchCustomers('');              // Ambil ulang daftar lengkap customer baru
    }
  }, [isOpen, event]);

  /**
   * PERSIAPAN 2: ATURAN MENU 'SEMUA CUSTOMER'
   * Jika admin mengklik menu 'Semua Customer', asisten otomatis memborong seluruh ID customer 
   * dan memasukkannya ke dalam keranjang. Tapi kalau dikembalikan ke 'Pilih Customer', keranjangnya dikosongkan lagi.
   */
  useEffect(() => {
    if (targetType === 'Semua Customer') {
      setSelectedCustomers(customers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  }, [targetType, customers]);

  // =======================================================================
  // 4. KUMPULAN TUGAS SAAT ADMIN MENEKAN TOMBOL (HANDLERS)
  // =======================================================================
  
  /**
   * TUGAS 1: PENGATUR KOTAK CENTANG (CHECKBOX)
   * Tugasnya mencatat saat admin mencentang atau menghapus centang pada satu nama customer.
   */
  const handleCheckboxChange = (id) => {
    // Jika sedang dalam mode pilih borongan ('Semua Customer'), kunci kotak centang agar tidak bisa diklik satuan
    if (targetType === 'Semua Customer') return; 

    // Asisten memeriksa isi keranjang:
    // - Jika nomor ID sudah ada di dalam keranjang, keluarkan dari keranjang (hapus centang).
    // - Jika nomor ID belum ada, masukkan ke dalam keranjang (tambah centang).
    setSelectedCustomers(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  /**
   * TUGAS 2: EKSEKUSI PENGIRIMAN PESAN PROMO
   * Fungsi pamungkas yang mengirim surat perintah ke server untuk menyebarkan pesan WA ke customer.
   */
  const handleDistribute = async () => {
    // Tombol Pengaman: Jika admin mau pilih manual tapi lupa mencentang nama, tolak dan munculkan peringatan!
    if (targetType === 'Pilih Customer' && selectedCustomers.length === 0) {
      showToast('Pilih minimal satu customer ya untuk mengirimkan event ini.', 'error');
      return;
    }

    setIsSubmitting(true); // Nyalakan animasi loading pada tombol kirim (kunci tombolnya)
    try {
      // Membungkus paket surat (payload) sesuai pesanan yang diminta server Laravel
      const payload = {
        // Mengambil KTP/ID dari event (mencoba berbagai nama sebutan dari server)
        idEvent: event?.idEvent || event?.idKegiatan || event?.id,
        
        // Beri tahu server jenis kirimannya: 'all' (untuk semua orang) atau 'selected' (pilihan khusus)
        type: targetType === 'Semua Customer' ? 'all' : 'selected',
        
        // Daftar ID customer tujuan (jika pilih semua/all, kirim wadah kosong saja ke server)
        customer_ids: targetType === 'Semua Customer' ? [] : selectedCustomers
      };
      
      console.log("Asisten mengirim paket distribusi event:", payload);

      // Asisten mengetuk pintu server (metode POST = menyerahkan data baru)
      const res = await axiosClient.post(endpoints.admin.distribusi.event, payload);
      
      // Jika server tersenyum puas dan mengonfirmasi keberhasilan
      if (res.data?.status === 'success') {
        const eventName = event?.namaKegiatan || event?.nama || 'ini';
        
        showToast(`Hore! Event "${eventName}" berhasil dikirimkan ke customer!`, 'success'); // Munculkan pop-up hijau
        onClose(); // Tutup jendela modal distribusi
      }
    } catch (error) {
      // Jika pengiriman tersendat (misal pulsa habis atau internet putus)
      console.error("Yah, gagal mengirim event:", error);
      
      // Ambil pesan kegagalan dari server untuk dilaporkan ke admin
      showToast(
        error.response?.data?.message?.idKegiatan?.[0] || 
        error.response?.data?.message || 
        "Yah, gagal mendistribusikan event", 
        "error"
      );
    } finally {
      setIsSubmitting(false); // Matikan putaran animasi loading agar tombol aktif kembali
    }
  };

  // Asisten menyerahkan seluruh fungsi kerja, keranjang belanja, dan buku catatannya ke tampilan ModalDistribusiEvent
  return {
    targetType,
    setTargetType,
    searchQuery,
    setSearchQuery,
    selectedCustomers,
    setSelectedCustomers,
    customers,
    isFetching,
    isSubmitting,
    fetchCustomers,
    handleCheckboxChange,
    handleDistribute
  };
}


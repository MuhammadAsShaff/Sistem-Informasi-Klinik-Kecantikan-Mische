import { useState, useEffect } from 'react';
// Mengimpor asisten pengambil daftar event dari server
import { useFetchEvent } from './useFetchEvent';

/**
 * =========================================================================
 * ASISTEN MANAJER UTAMA (useKelolaEvent)
 * =========================================================================
 * Bayangkan file ini sebagai "Manajer Utama" yang mengatur seluruh kesibukan 
 * di halaman Kelola Event. Dia memegang kendali atas semua data dan pop-up.
 * 
 * Rincian tugas spesifik Manajer ini:
 * 1. Menerima kiriman daftar event dan info loading dari asisten `useFetchEvent`.
 * 2. Menjaga kotak pencarian (langsung menyaring event yang cocok dengan ketikan admin).
 * 3. Membagi porsi halaman (Pagination), dengan patokan maksimal 6 event per halaman.
 * 4. Mengontrol saklar buka-tutup untuk semua jendela pop-up (Tambah, Edit, Hapus, Detail, Distribusi).
 * 5. Mencatat dengan teliti data event mana yang sedang diklik/dipilih oleh admin.
 */
export const useKelolaEvent = () => {
  // =======================================================================
  // 1. MEMANGGIL ASISTEN PENGAMBIL DATA (DATA FETCHING)
  // =======================================================================
  // Kita minta asisten useFetchEvent menyerahkan daftar 'events', tombol 'refetch', dan rambu sibuk 'isLoading'
  const { events, refetch, isLoading } = useFetchEvent();
  
  // Kotak catatan kecil tempat menyimpan ketikan kata kunci yang mau dicari
  const [searchQuery, setSearchQuery] = useState('');
  
  // =======================================================================
  // 2. SAKLAR BUKA-TUTUP JENDELA POP-UP (MODAL STATES)
  // =======================================================================
  // Laci-laci saklar ini bertugas mengingat apakah jendela pop-up tertentu sedang terbuka (true) atau tertutup (false)
  const [isTambahOpen, setIsTambahOpen] = useState(false);       // Saklar untuk Jendela Tambah Event Baru
  const [isEditOpen, setIsEditOpen] = useState(false);           // Saklar untuk Jendela Formulir Edit Event
  const [isHapusOpen, setIsHapusOpen] = useState(false);         // Saklar untuk Jendela Peringatan Hapus Event
  const [isDetailOpen, setIsDetailOpen] = useState(false);       // Saklar untuk Jendela Rincian Detail Event
  const [isDistribusiOpen, setIsDistribusiOpen] = useState(false); // Saklar untuk Jendela Distribusi WA ke Customer
  
  // =======================================================================
  // 3. LACI PENCATATAN EVENT YANG DIKLIK (SELECTED OBJECT STATE)
  // =======================================================================
  // Laci ini menyimpan referensi data event yang sedang dipilih.
  // Contoh: Kalau admin menekan tombol edit pada "Event Promo Cantik", biodata event tersebut disimpan di sini.
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // =======================================================================
  // 4. SISTEM POP-UP PEMBERITAHUAN (TOAST NOTIFICATION)
  // =======================================================================
  // Laci pengingat untuk memunculkan pesan melayang di layar (Misal: "Berhasil disimpan!" atau "Gagal!")
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });

  /**
   * Pemicu kemunculan pop-up pesan melayang (Toast).
   * @param {string} message - Kalimat pemberitahuan yang mau dimunculkan.
   * @param {string} type - Jenis warnanya ('success' untuk hijau, 'error' untuk merah).
   */
  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // =======================================================================
  // 5. SARINGAN PENCARIAN CERDAS (FILTER DATA)
  // =======================================================================
  /**
   * Kita menyaring daftar `events` secara otomatis setiap kali admin mengetik sesuatu.
   * Asisten akan mengecek apakah ketikan tersebut cocok dengan Judul (nama), Lokasi, atau Deskripsi event.
   * Fitur `toLowerCase()` dipakai agar huruf besar dan kecil dianggap sama (misal 'Mische' sama dengan 'mische').
   */
  const filteredEvents = events.filter(event => 
    (event.nama?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (event.lokasi?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (event.deskripsi?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // =======================================================================
  // 6. PEMBAGIAN PORSI HALAMAN (PAGINATION LOGIC)
  // =======================================================================
  // Catatan pengingat saat ini kita sedang melihat halaman ke berapa (Mulai dari Halaman 1)
  const [currentPage, setCurrentPage] = useState(1);

  // Aturan porsi: Satu halaman paling banyak hanya boleh memajang 6 kotak event
  const ITEMS_PER_PAGE = 6;
  
  // Menghitung total halaman yang tersedia. 
  // Math.ceil() membulatkan angka ke atas (Contoh: kalau ada 13 event, 13 dibagi 6 = 2.16 -> dibulatkan jadi 3 halaman).
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

  /**
   * ATURAN PINDAH HALAMAN SAAT MENCARI
   * Kalau admin mendadak mengetik kata kunci baru, kita otomatis balikkan meja ke Halaman 1.
   * Ini untuk mencegah layar kosong kalau sebelumnya admin sedang ada di Halaman 5.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /**
   * Menggunting (slice) daftar event hasil saringan agar pas 6 kotak sesuai halaman yang sedang aktif.
   * - Kalau Halaman 1: Gunting dari urutan 0 sampai 5.
   * - Kalau Halaman 2: Gunting dari urutan 6 sampai 11.
   */
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // =======================================================================
  // 7. KUMPULAN TUGAS SAAT TOMBOL DIKLIK (ACTION HANDLERS)
  // =======================================================================
  
  /**
   * Saat tombol Lihat (Ikon Mata) diklik pada satu event:
   */
  const handleView = (event) => {
    setSelectedEvent(event); // Masukkan biodata event ke laci terpilih
    setIsDetailOpen(true);   // Nyalakan saklar Jendela Detail
  };

  /**
   * Saat tombol Edit (Ikon Pensil) diklik pada satu event:
   */
  const handleEdit = (event) => {
    setSelectedEvent(event); // Masukkan biodata event ke laci terpilih
    setIsEditOpen(true);     // Nyalakan saklar Jendela Formulir Edit
  };

  /**
   * Saat tombol Hapus (Ikon Tong Sampah) diklik pada satu event:
   */
  const handleDelete = (event) => {
    setSelectedEvent(event); // Masukkan biodata event ke laci terpilih
    setIsHapusOpen(true);    // Nyalakan saklar Jendela Peringatan Hapus
  };

  /**
   * Saat tombol Kirim (Ikon Pesawat Kertas) diklik pada satu event:
   */
  const handleSend = (event) => {
    setSelectedEvent(event);  // Masukkan biodata event ke laci terpilih
    setIsDistribusiOpen(true); // Nyalakan saklar Jendela Distribusi WA
  };

  // Manajer Utama membungkus seluruh catatan, laci saklar, dan pengendali ini untuk diserahkan ke Halaman Kelola Event
  return {
    isLoading,
    refetch,
    searchQuery,
    setSearchQuery,
    paginatedEvents,
    currentPage,
    setCurrentPage,
    totalPages,
    ITEMS_PER_PAGE,
    isTambahOpen,
    setIsTambahOpen,
    isEditOpen,
    setIsEditOpen,
    isHapusOpen,
    setIsHapusOpen,
    isDetailOpen,
    setIsDetailOpen,
    isDistribusiOpen,
    setIsDistribusiOpen,
    selectedEvent,
    setSelectedEvent,
    toast,
    setToast,
    showToast,
    handleView,
    handleEdit,
    handleDelete,
    handleSend
  };
};


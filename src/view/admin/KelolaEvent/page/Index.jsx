import React from 'react';
// ─── MENGIMPOR REKAN-REKAN KERJA BALAI ───────────────────────────────────────

// Papan plang mading pengumuman judul
import Header from './Header';
// Kotak laci pencari event
import SearchBar from '@/components/SearchBar';
// Petugas pembagi halaman buku tabel
import Pagination from '@/components/Pagination';
// Ikon lambang tambah untuk tombol pendaftaran baru
import { Plus } from 'lucide-react';
// Meja panjang pemajang daftar event
import Tabel from './Tabel';
// Asisten pembawa plang formulir pendaftaran event baru
import ModalTambahEvent from './ModalTambahEvent';
// Asisten pembawa plang formulir perbaikan event lama
import ModalPerbaruiEvent from './ModalPerbaruiEvent';
// Petugas pengonfirmasi penghancuran arsip event
import ModalHapusEvent from './ModalHapusEvent';
// Petugas pembawa plang rincian biodata lengkap event
import ModalDetailEvent from './ModalDetailEvent';
// Asisten kurir penyebar pesan promosi ke WhatsApp customer
import ModalDistribusiEvent from './ModalDistribusiEvent';
// Petugas cilik pembawa papan pengumuman kilat
import ToastAlert from '@/view/components/ToastAlert/page/Index';
// Mandor Kepala Pengelola Event (penentu segala kebijakan dan data)
import { useKelolaEvent } from '../hooks/useKelolaEvent';

/**
 * =========================================================================
 * BALAI BESAR PENGELOLAAN EVENT (KelolaEvent)
 * =========================================================================
 * Ibarat sebuah balai kerja megah tempat Mandor Utama (useKelolaEvent) 
 * memimpin jalannya operasional. Di balai ini terpasang Papan Plang Judul (Header),
 * Meja Kotak Pencarian (SearchBar), Meja Panjang Pemajang Arsip (Tabel), 
 * serta deretan asisten pembawa plang khusus yang bersiaga di balik tirai (Modal).
 */
export default function KelolaEvent() {
  // Meminjam seluruh buku catatan, laci saklar, dan lonceng kendali dari Mandor Utama (useKelolaEvent)
  const {
    isLoading,         // Rambu tanda sibuk saat asisten pengintai masih mengambil data di server
    refetch,           // Lonceng penyegar meja tabel
    searchQuery,       // Kotak catatan penyimpan ketikan kata kunci admin
    setSearchQuery,    // Tuas pena pengubah tulisan kata kunci
    paginatedEvents,   // Daftar arsip event yang sudah disaring dan digunting pas 6 kotak
    currentPage,       // Laci pengingat halaman meja yang aktif
    setCurrentPage,    // Tuas pembalik halaman meja tabel
    totalPages,        // Angka total ketersediaan halaman
    ITEMS_PER_PAGE,    // Aturan takaran porsi (6 item per halaman)
    isTambahOpen,      // Saklar penyingkap tirai formulir tambah
    setIsTambahOpen,   // Tuas pembuka/penutup tirai formulir tambah
    isEditOpen,        // Saklar penyingkap tirai formulir edit
    setIsEditOpen,     // Tuas pembuka/penutup tirai formulir edit
    isHapusOpen,       // Saklar penyingkap tirai peringatan hapus
    setIsHapusOpen,    // Tuas pembuka/penutup tirai peringatan hapus
    isDetailOpen,      // Saklar penyingkap tirai detail event
    setIsDetailOpen,   // Tuas pembuka/penutup tirai detail event
    isDistribusiOpen,  // Saklar penyingkap tirai distribusi WA
    setIsDistribusiOpen, // Tuas pembuka/penutup tirai distribusi WA
    selectedEvent,     // Laci arsip penyimpan biodata event yang sedang dipilih/diklik
    setSelectedEvent,  // Tuas pemindah/pengosong laci arsip terpilih
    toast,             // Papan plang kilat melayang
    setToast,          // Tuas pengatur plang kilat
    showToast,         // Tuas pemantik kemunculan plang kilat
    handleView,        // Tombol lonceng pengintai (mata) untuk menyingkap detail
    handleEdit,        // Tombol lonceng perbaikan (pensil) untuk menyingkap form edit
    handleDelete,      // Tombol lonceng penghancur (tong sampah) untuk menyingkap peringatan hapus
    handleSend         // Tombol lonceng kurir (pesawat) untuk menyingkap plang distribusi
  } = useKelolaEvent();

  return (
    // ─── HAMPARAN PEKARANGAN BALAI KERJA ─────────────────────────────────────
    // Hamparan pekarangan abu-abu sejuk (bg-[#F4F7F6]) yang memberi ruang luwes bagi Pilar Lorong Kiri (ml-0 lg:ml-64)
    <div className="min-h-screen bg-[#F4F7F6] p-4 md:p-8 ml-0 lg:ml-64 pt-24 lg:pt-8 transition-all duration-300">
      
      {/* ─── PEMBUNGKUS RUANG UTAMA (MAX-WIDTH) ─────────────────────────────── */}
      {/* Menjaga meja-meja di balai agar posisinya teratur di tengah (mx-auto) */}
      <div className="max-w-6xl mx-auto">
        
        {/* Papan plang pengumuman mading di bagian atas */}
        <Header />
        
        {/* ─── MEJA PENCARIAN & TOMBOL PENDAFTARAN BARU ─────────────────────── */}
        {/* Kotak laci tempat admin mengetik kata kunci, dibarengi tombol lonceng pendaftaran di sisi kanannya */}
        <SearchBar 
          searchQuery={searchQuery} // Terikat pada ketikan Mandor
          setSearchQuery={setSearchQuery} // Digerakkan pena Mandor
          rightComponents={
            /* Tombol lonceng hijau besar pembuka tirai formulir pendaftaran baru (ModalTambahEvent) */
            <button 
              onClick={() => setIsTambahOpen(true)}
              className="bg-[#56BC36] text-white p-2.5 rounded-md hover:bg-[#469e2c] transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={20} />
            </button>
          }
        />
        
        {/* ─── MEJA PANJANG PEMAJANG ARSIP (TABEL) ──────────────────────────── */}
        {/* Menyajikan bungkusan arsip event matang (paginatedEvents) serta menyematkan seluruh tombol lonceng aksi */}
        <Tabel 
          isLoading={isLoading} 
          events={paginatedEvents} 
          onView={handleView}
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onSend={handleSend}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
        />
        
        {/* ─── PETUGAS PEMBALIK HALAMAN (PAGINATION) ────────────────────────── */}
        {/* Menampilkan deretan angka halaman meja. Jika dipencet, memicu tuas setCurrentPage */}
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>

      {/* =====================================================================
          DERETAN ASISTEN PEMBAWA PLANG DI BALIK TIRAI (MODAL POP-UP)
          Mereka bersiaga dalam keheningan dan hanya melompat ke hadapan admin
          jika tuas saklar masing-masing bernilai true.
          ===================================================================== */}
      
      {/* ─── ASISTEN PLANG FORMULIR PENDAFTARAN BARU ────────────────────────── */}
      <ModalTambahEvent 
        isOpen={isTambahOpen} 
        onClose={() => setIsTambahOpen(false)} // Tuas penurun plang
        refetch={refetch} // Lonceng penyegar tabel jika sukses
        showToast={showToast} // Lonceng plang kilat
      />
      
      {/* ─── ASISTEN PLANG FORMULIR PERBAIKAN (EDIT) ────────────────────────── */}
      <ModalPerbaruiEvent 
        isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false); // Tuas penurun plang
          setSelectedEvent(null); // Kosongkan kembali laci arsip terpilih
        }} 
        refetch={refetch}
        showToast={showToast}
        event={selectedEvent} // Menyerahkan biodata event yang hendak dirombak
      />
      
      {/* ─── PETUGAS PLANG KONFIRMASI PENGHANCURAN (HAPUS) ──────────────────── */}
      <ModalHapusEvent 
        isOpen={isHapusOpen} 
        onClose={() => {
          setIsHapusOpen(false);
          setSelectedEvent(null);
        }} 
        refetch={refetch}
        showToast={showToast}
        event={selectedEvent}
      />
      
      {/* ─── PETUGAS PLANG RINCIAN BIODATA LENGKAP (DETAIL) ─────────────────── */}
      <ModalDetailEvent 
        isOpen={isDetailOpen} 
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedEvent(null);
        }} 
        event={selectedEvent}
      />

      {/* ─── ASISTEN PLANG PENYEBARAN PESAN WA (DISTRIBUSI) ─────────────────── */}
      <ModalDistribusiEvent
        isOpen={isDistribusiOpen}
        onClose={() => {
          setIsDistribusiOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        showToast={showToast}
      />

      {/* ─── PETUGAS CILIK NOTIFIKASI KILAT (TOAST ALERT) ───────────────────── */}
      {/* Muncul melayang sekilas untuk memberi pengumuman selamat atau teguran */}
      <ToastAlert
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
      
    </div>
  );
}

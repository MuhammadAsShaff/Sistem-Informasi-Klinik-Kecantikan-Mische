import React from 'react';
// Mengimpor lambang silang (X) untuk lonceng tutup dan kaca pembesar (Search) untuk lonceng cari
import { X, Search } from 'lucide-react';
// Mengimpor Mandor Kurir Distribusi (useDistribusiEvent) penyimpan daftar nama dan pengirim pesan WA
import { useDistribusiEvent } from '../hooks/useDistribusiEvent';

/**
 * =========================================================================
 * MEJA KOMANDO KURIR SIARAN WA (ModalDistribusiEvent)
 * =========================================================================
 * Ibarat meja komando khusus tempat Mandor Kurir (useDistribusiEvent) 
 * menggelar buku daftar nama customer klinik. Di meja ini admin bisa memilih
 * apakah ingin mengutus kurir menyebar undangan promo ke satu per satu customer
 * atau memborong pengiriman ke seluruh warga sekaligus.
 */
export default function ModalDistribusiEvent({ isOpen, onClose, event, showToast }) {
  // ─── MEMINJAM BUKU CATATAN & LONCENG DARI MANDOR KURIR ──────────────────────
  const {
    targetType,        // Laci penanda menu: 'Pilih Customer' atau borongan 'Semua Customer'
    setTargetType,     // Tuas pemindah laci menu target
    searchQuery,       // Kotak catatan penyimpan ketikan pencarian nama
    setSearchQuery,    // Tuas pena pengubah tulisan pencarian
    selectedCustomers, // Keranjang penampung nomor KTP customer yang dicentang
    customers,         // Buku daftar lengkap biodata customer dari server
    isFetching,        // Rambu sibuk saat kurir sedang mencari nama di server
    isSubmitting,      // Rambu sibuk saat kurir sedang berlari menyebar pesan WA
    fetchCustomers,    // Lonceng pemanggil kurir pencari nama
    handleCheckboxChange, // Tuas pencatat centangan customer
    handleDistribute   // Tombol lonceng besar pengutus kurir siaran WA
  } = useDistribusiEvent({ isOpen, onClose, event, showToast });

  // PENGAMAN MEJA: Jika tuas isOpen belum ditarik, meja komando tetap tertutup tirai
  if (!isOpen) return null;

  // Menyalin buku daftar customer ke catatan lokal agar mudah dipajang
  const filteredCustomers = customers;

  return (
    // ─── TIRAI PENGABUR RUANG KERJA ──────────────────────────────────────────
    // Kain gelap transparan (bg-black/50) yang membungkus seluruh meja balai
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      
      {/* ─── PAPAN MEJA KOMANDO MARMER ──────────────────────────────────────── */}
      {/* Papan marmer putih bersudut bundar (rounded-xl) setinggi maksimal 90% layar (max-h-[90vh]) */}
      <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
        
        {/* ─── KOP MEJA KOMANDO (HEADER) ────────────────────────────────────── */}
        <div className="px-8 py-5 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {/* Judul meja dan nama event berbalut warna hijau cerah (#56BC36) */}
            Distribusi Event <span className="text-[#56BC36] text-lg block sm:inline mt-1 sm:mt-0">{event?.namaKegiatan || event?.nama || ''}</span>
          </h2>
          
          {/* Tombol silang (X) penutup meja komando */}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* ─── HAMPARAN BUKU DAFTAR CUSTOMER (BODY KONTEN) ──────────────────── */}
        {/* Ruang p-8 (padding 32px) dengan jalur luncur vertikal (overflow-y-auto) */}
        <div className="p-8 overflow-y-auto">
          
          {/* ─── LACI PEMILIH CARA DISTRIBUSI (DROPDOWN) ────────────────────── */}
          <div className="mb-10">
            <label className="block text-[15px] font-medium text-gray-800 mb-3">Customer Yang Di Tuju</label>
            <div className="relative max-w-[320px]">
              <select 
                value={targetType} // Terikat pada laci menu Mandor
                onChange={(e) => setTargetType(e.target.value)} // Menggerakkan tuas pemindah menu
                className="w-full bg-white border border-gray-300 rounded-md py-2.5 pl-4 pr-10 text-[15px] text-gray-700 focus:outline-none focus:border-[#56BC36] focus:ring-1 focus:ring-[#56BC36] cursor-pointer"
              >
                <option value="Pilih Customer">Pilih Customer</option>
                <option value="Semua Customer">Semua Customer</option>
              </select>
            </div>
          </div>

          {/* ─── KOTAK PENCARIAN NAMA CUSTOMER ──────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-4 gap-4">
            <h3 className="text-[15px] font-medium text-gray-800">Daftar Nama Yang Di Tuju</h3>
            <div className="flex w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search Customer" 
                value={searchQuery} // Terikat pada laci pencarian
                onChange={(e) => setSearchQuery(e.target.value)} // Digerakkan pena admin
                className="border border-gray-300 border-r-0 rounded-l-md px-4 py-2 text-[14px] w-full md:w-64 focus:outline-none"
              />
              {/* Tombol lonceng kaca pembesar untuk memanggil kurir pencari nama */}
              <button 
                onClick={() => fetchCustomers(searchQuery)}
                className="bg-[#56BC36] px-4 py-2 rounded-r-md text-white flex items-center justify-center hover:bg-[#469e2c] transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* ─── TABEL REKAP NAMA & KOTAK CENTANG ───────────────────────────── */}
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
            <table className="w-full text-left border-collapse text-[15px]">
              
              {/* Kepala Tabel */}
              <thead>
                <tr className="border-b border-gray-200 bg-white text-gray-600">
                  <th className="py-4 px-6 font-medium text-center w-24">No</th>
                  <th className="py-4 px-6 font-medium">Nama Customer</th>
                  <th className="py-4 px-6 font-medium text-center w-32">Status</th>
                </tr>
              </thead>
              
              {/* Badan Tabel */}
              <tbody>
                {filteredCustomers.length > 0 ? (
                  // Menjajarkan setiap customer di baris tabel
                  filteredCustomers.map((customer, index) => (
                    <tr key={customer.id} className="border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors">
                      
                      {/* Nomor urut baris */}
                      <td className="py-4 px-6 text-center text-gray-500">{index + 1}</td>
                      
                      {/* Nama dan nomor telepon WhatsApp */}
                      <td className="py-4 px-6 text-gray-700">
                        <div className="font-medium">{customer.name}</div>
                        {customer.phone && <div className="text-xs text-gray-500 mt-0.5">{customer.phone}</div>}
                      </td>
                      
                      {/* Kotak centang penanda terpilih */}
                      <td className="py-4 px-6 text-center">
                        <input 
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)} // Dicocokkan dengan keranjang Mandor
                          onChange={() => handleCheckboxChange(customer.id)} // Tuas pencatat centang
                          disabled={targetType === 'Semua Customer'} // Kunci centangan jika borongan
                          className={`w-5 h-5 rounded border-gray-300 ${targetType === 'Semua Customer' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} accent-[#56BC36] text-[#56BC36] focus:ring-[#56BC36] checked:bg-[#56BC-36] checked:border-[#56BC36]`}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  // Baris peringatan jika buku daftar kosong
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-gray-500">
                      Tidak ada customer ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── KAKI MEJA KOMANDO (FOOTER MODAL) ─────────────────────────────── */}
        <div className="px-8 py-5 border-t border-gray-200 flex justify-end bg-white">
          {/* Tombol lonceng hijau besar pengutus kurir siaran WA */}
          <button 
            onClick={handleDistribute}
            disabled={isSubmitting || isFetching} // Terkunci selama kurir sibuk
            className={`bg-[#56BC36] text-white px-8 py-2.5 rounded-md font-medium transition-colors ${isSubmitting || isFetching ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#469e2c]'}`}
          >
            {/* Teks berganti menenangkan saat kurir berlari */}
            {isSubmitting ? 'Memproses...' : 'Distribusikan'}
          </button>
        </div>

      </div>
    </div>
  );
}

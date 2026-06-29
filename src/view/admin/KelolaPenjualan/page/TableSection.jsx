import React from 'react';
// Mengimpor ikon tempat sampah (Trash2), ikon mata (Eye), dan ikon truk kurir (Truck)
import { Trash2, Eye, Truck } from 'lucide-react';
// Mengimpor fungsi perapih tanggal agar mudah dibaca (Misal: 28 Juni 2026)
import { formatDate } from '../../../../core/utils/formatDate';
// Mengimpor rancangan dasar tabel utama
import Table from '@/components/Table';

/**
 * =========================================================================
 * BAGIAN TABEL DAFTAR PESANAN (Ibarat Tabel Catatan Transaksi di Kertas)
 * =========================================================================
 * Ini adalah tabel utama tempat menampilkan baris demi baris pesanan yang masuk.
 * Tabel ini terdiri dari 6 kolom utama: Nomor Invoice, Nama Pembeli, Tanggal,
 * Total Harga (berwarna hijau jika lunas), Pilihan Status (bisa diganti-ganti),
 * dan kolom Action yang berisi tombol-tombol klik (Mata, Truk, dan Tempat Sampah).
 */
const TableSection = ({ data, onDeleteClick, onDetailClick, onResiClick, onStatusChange, currentPage = 1, itemsPerPage = 6, isLoading }) => {
  
  // --- DAFTAR JUDUL DAN ISI DARI KE-6 KOLOM TABEL ---
  const columns = [
    // Kolom 1: Menampilkan Nomor Invoice (Nomor Tagihan)
    { label: 'No. Invoice', key: 'invoiceNumber', render: (item) => <span className="font-semibold text-gray-700">{item.invoiceNumber || '-'}</span>, className: 'text-center', cellClassName: 'text-center' },
    
    // Kolom 2: Menampilkan Nama Pembeli (Jika kosong, tampilkan tulisan 'Unknown')
    { label: 'Nama', key: 'user.nama', render: (item) => item.user?.nama || 'Unknown', className: 'text-center whitespace-nowrap', cellClassName: 'text-center whitespace-nowrap' },
    
    // Kolom 3: Menampilkan Tanggal Transaksi (Dipercantik oleh fungsi formatDate)
    { label: 'Tanggal', render: (item) => formatDate(item.tanggal), className: 'text-center whitespace-nowrap', cellClassName: 'text-center whitespace-nowrap' },
    
    // Kolom 4: Menampilkan Total Harga (Teks berwarna HIJAU jika sudah lunas, dan MERAH jika belum lunas)
    { 
      label: 'Total Harga', 
      render: (item) => {
        const ps = (item.paymentStatus || item.status_pembayaran || '').toLowerCase();
        const isPaid = ps === 'paid' || ps === 'settlement' || ps === 'capture';
        return <span className={`${isPaid ? 'text-green-600' : 'text-red-500'} font-bold`}>Rp {item.total ? item.total.toLocaleString('id-ID') : 0}</span>;
      }, 
      className: 'text-center', 
      cellClassName: 'text-center' 
    },
    
    // Kolom 5: Kotak Pilihan Status (Dropdown)
    // Admin bisa mengganti status pesanan di sini. Warnanya akan otomatis menyesuaikan:
    // Hijau (Selesai), Merah (Batal), Biru (Dikirim), Kuning (Diproses), dan Abu-abu (Pending)
    { 
      label: 'Status', 
      render: (item) => (
        <select
          value={item.orderStatus || 'pending'}
          onChange={(e) => onStatusChange(item.idPenjualan || item.id, e.target.value)}
          className={`text-[11px] px-2 py-1.5 rounded-md border font-semibold cursor-pointer outline-none ${
            item.orderStatus === 'selesai' ? 'bg-green-50 text-green-700 border-green-200' :
            item.orderStatus === 'dibatalkan' ? 'bg-red-50 text-red-700 border-red-200' :
            item.orderStatus === 'dikirim' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            item.orderStatus === 'diproses' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
            'bg-gray-50 text-gray-700 border-gray-200'
          }`}
        >
          <option value="pending">Pending</option>
          <option value="diproses">Diproses</option>
          <option value="dikirim">Dikirim</option>
          <option value="selesai">Selesai</option>
          <option value="dibatalkan">Dibatalkan</option>
        </select>
      ), 
      className: 'text-center w-32', 
      cellClassName: 'text-center' 
    },
    
    // Kolom 6: Kolom Action (Berisi 3 ikon tombol klik)
    { 
      label: 'Action', 
      render: (item) => (
        <div className="flex items-center justify-center gap-3 text-gray-600">
          {/* Ikon Mata: Klik untuk membuka pop-up rincian lengkap pesanan */}
          <button onClick={() => onDetailClick(item)} className="hover:text-blue-600 transition-colors cursor-pointer" title="Detail">
            <Eye size={18} />
          </button>
          {/* Ikon Truk: Klik untuk membuka pop-up pengisian nomor resi */}
          <button onClick={() => onResiClick(item)} className="hover:text-green-600 transition-colors cursor-pointer" title="Update Resi">
            <Truck size={18} />
          </button>
          {/* Ikon Tempat Sampah: Klik untuk membuka pop-up konfirmasi hapus pesanan */}
          <button onClick={() => onDeleteClick(item.idPenjualan || item.id)} className="hover:text-red-600 transition-colors cursor-pointer" title="Hapus">
            <Trash2 size={18} />
          </button>
        </div>
      ),
      className: 'text-center w-24', 
      cellClassName: 'text-center'
    }
  ];

  return (
    // Menggabungkan pengaturan kolom dan data pesanan ke dalam komponen tabel utama
    <Table 
      columns={columns} 
      data={data} 
      isLoading={isLoading}
      emptyStateText="Tidak ada data penjualan"
      startIndex={(currentPage - 1) * itemsPerPage + 1}
    />
  );
};

export default TableSection;

import React from 'react';
// Mengimpor ikon silang penutup kotak pop-up (X)
import { X } from 'lucide-react';

/**
 * =========================================================================
 * KOTAK POP-UP RINCIAN PESANAN (Ibarat Kertas Struk Belanja Lengkap)
 * =========================================================================
 * Ini adalah kotak pop-up (jendela kecil) yang muncul saat admin ingin melihat
 * rincian lengkap dari sebuah pesanan. Ibarat melihat struk belanja panjang,
 * di sini tertulis nomor invoice, nama pembeli, alamat pengiriman, metode pembayaran
 * (Transfer Bank, GoPay, dll.), daftar barang yang dibeli, hingga total bayar.
 */
const ModalDetailPenjualan = ({ isOpen, onClose, data }) => {
  // Jika kotak pop-up tidak dibuka ATAU tidak ada data pesanan, jangan tampilkan apa-apa
  if (!isOpen || !data) return null;

  // --- FUNGSI MENGAMBIL NAMA BARANG ---
  const getProdukNames = (detailpenjualan) => {
    if (!detailpenjualan || detailpenjualan.length === 0) return '-';
    return detailpenjualan.map(d => d.produk?.namaProduk || d.produk?.nama).join(', ');
  };

  // --- FUNGSI MENGHITUNG TOTAL JUMLAH BARANG ---
  // Menjumlahkan berapa banyak barang yang dibeli pembeli dalam satu pesanan
  const getJumlahTotal = (detailpenjualan) => {
    if (!detailpenjualan || detailpenjualan.length === 0) return 0;
    return detailpenjualan.reduce((acc, curr) => acc + curr.jumlahProduk, 0);
  };

  // --- FUNGSI MENGUBAH NAMA BANK MENJADI LEBIH MUDAH DIBACA ---
  // Mengubah kode dari sistem pembayaran bank menjadi teks biasa (Misal: gopay jadi GoPay)
  const formatPaymentType = (type) => {
    if (!type) return 'Belum Melakukan Pembayaran';
    const s = String(type).toLowerCase();
    if (s === 'bank_transfer') return 'Transfer Bank';
    if (s === 'echannel') return 'Mandiri Bill';
    if (s === 'gopay') return 'GoPay';
    if (s === 'qris') return 'QRIS';
    if (s === 'shopeepay') return 'ShopeePay';
    if (s === 'cstore') return 'Indomaret / Alfamart';
    if (s === 'credit_card') return 'Kartu Kredit / Debit';
    return type; // Jika ada metode lain, tampilkan aslinya
  };

  return (
    // Latar belakang gelap transparan di belakang pop-up
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      {/* Kotak putih pop-up utama */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden font-sans">
        
        {/* --- BAGIAN ATAS KOTAK (Judul & Tombol Tutup) --- */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Detail Penjualan</h3>
          {/* Tombol silang untuk menutup kotak pop-up */}
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* --- ISI KOTAK (Dapat digulir / scroll jika datanya panjang) --- */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* ========================================================================= */}
          {/* BAGIAN 1: INFORMASI UMUM PESANAN */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Nomor Invoice */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">No. Invoice</label>
              <div className="text-gray-800 font-medium">{data.invoiceNumber || '-'}</div>
            </div>
            {/* Tanggal Belanja */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tanggal</label>
              <div className="text-gray-800 font-medium">{data.tanggal ? new Date(data.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' }) : '-'}</div>
            </div>
            {/* Nama Pembeli */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nama Customer</label>
              <div className="text-gray-800 font-medium">{data.user?.nama || 'Unknown'}</div>
            </div>
            {/* Status Pesanan (Misal: diproses, dikirim, selesai) */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status Order</label>
              <div className="text-gray-800 font-medium capitalize">{data.orderStatus || '-'}</div>
            </div>
            {/* Status Pembayaran (Hijau jika Lunas, Kuning jika Pending, Merah jika Gagal) */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status Pembayaran</label>
              <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                (() => {
                  const s = (data.paymentStatus || '').toLowerCase();
                  if (s === 'paid' || s === 'settlement' || s === 'capture') return 'bg-green-50 text-green-700 border-green-200';
                  if (s === 'pending') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
                  return 'bg-red-50 text-red-700 border-red-200';
                })()
              }`}>
                {(data.paymentStatus || 'UNPAID').toUpperCase()}
              </div>
            </div>
            {/* Metode Pembayaran */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Metode Pembayaran</label>
              <div className="text-gray-800 font-medium">{formatPaymentType(data.payment_type || data.paymentMethod)}</div>
            </div>
            {/* Nomor Resi Pengiriman */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nomor Resi</label>
              <div className="text-gray-800 font-medium">{data.nomorResi || '-'}</div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ========================================================================= */}
          {/* BAGIAN 2: JASA PENGIRIMAN, PROMO & ALAMAT LENGKAP */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Kurir & Layanan Pengiriman */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pengiriman</label>
                <div className="text-gray-800 font-medium">
                  {data.shippingCourier ? `${data.shippingCourier.toUpperCase()} (${data.shippingService})` : '-'}
                </div>
              </div>
              {/* Promo atau Diskon yang Dipakai */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Promo Digunakan</label>
                <div className="text-gray-800 font-medium">
                  {data.promo ? `${data.promo.namaPromo} (${data.promo.kode})` : '-'}
                </div>
              </div>
            </div>
            
            {/* Alamat Pengiriman Tujuan */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Alamat Pengiriman</label>
              <div className="text-gray-800 font-medium">
                {data.alamat ? (
                  <>
                    <div>{data.alamat.namaPenerima} ({data.alamat.nomorHp})</div>
                    <div className="text-sm font-normal text-gray-600 mt-0.5">
                      {data.alamat.detailAlamat}, {data.alamat.districtId ? `${data.alamat.districtId}, ` : ''}{data.alamat.cityId}, {data.alamat.provinceId} {data.alamat.kodePos}
                    </div>
                  </>
                ) : '-'}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ========================================================================= */}
          {/* BAGIAN 3: DAFTAR BARANG YANG DIBELI (Rincian Belanja) */}
          {/* ========================================================================= */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Daftar Produk ({getJumlahTotal(data.detailpenjualan)} Item)</label>
            <div className="space-y-3">
              {data.detailpenjualan && data.detailpenjualan.length > 0 ? (
                data.detailpenjualan.map((detail, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                    <div className="font-medium text-gray-800">
                      {detail.produk?.namaProduk || detail.produk?.nama || 'Unknown'} 
                      <span className="text-gray-500 ml-2">x{detail.jumlahProduk}</span>
                    </div>
                    <div className="text-gray-600">
                      Rp {((detail.produk?.harga || 0) * detail.jumlahProduk).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">-</div>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ========================================================================= */}
          {/* BAGIAN 4: RINCIAN TOTAL BIAYA (Subtotal, Ongkir, Diskon) */}
          {/* ========================================================================= */}
          <div className="space-y-2 text-sm">
            {/* Harga total barang */}
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>Rp {data.subtotal ? data.subtotal.toLocaleString('id-ID') : 0}</span>
            </div>
            {/* Ongkos kirim */}
            <div className="flex justify-between text-gray-600">
              <span>Biaya Pengiriman</span>
              <span>Rp {data.shippingCost ? data.shippingCost.toLocaleString('id-ID') : 0}</span>
            </div>
            {/* Potongan diskon jika ada promo */}
            {data.promo && (
              <div className="flex justify-between text-green-600">
                <span>Diskon Promo</span>
                <span>- Rp {(data.subtotal + data.shippingCost - data.total).toLocaleString('id-ID')}</span>
              </div>
            )}
            {/* Total akhir yang dibayar pembeli */}
            <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-100">
              <span>Total Akhir</span>
              <span className="text-green-600">Rp {data.total ? data.total.toLocaleString('id-ID') : 0}</span>
            </div>
          </div>
        </div>

        {/* --- BAGIAN BAWAH KOTAK (Tombol Tutup) --- */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetailPenjualan;

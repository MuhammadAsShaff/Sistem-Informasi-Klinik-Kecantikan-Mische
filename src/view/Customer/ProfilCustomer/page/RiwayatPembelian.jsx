import React from 'react';
import { Package, Clock, Truck, CheckCircle, ChevronLeft, XCircle } from 'lucide-react';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';
import ToastAlert from '@/view/components/ToastAlert/page/Index';
import ModalKonfirmasi from '@/view/components/ModalKonfirmasi/page/Index';
import ModalDetailPembelian from './ModalDetailPembelian';
import { Eye } from 'lucide-react';
import { useRiwayatPembelian } from '../hooks/useRiwayatPembelian';

// Fungsi utilitas format mata uang Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

/**
 * =========================================================================
 * KOMPONEN: RiwayatPembelian (TAMPILAN MURNI / VIEW)
 * =========================================================================
 * Komponen ini hanya merender antarmuka halaman riwayat pembelian customer.
 * Seluruh logika fetch data, filter tab, penanganan konfirmasi penerimaan,
 * pembatalan, dan integrasi Midtrans Snap diserahkan ke hook `useRiwayatPembelian`.
 */
export default function RiwayatPembelian() {
  // Hubungkan ke custom hook useRiwayatPembelian untuk mendapatkan semua state dan handler logika
  const {
    navigate,
    activeTab, setActiveTab,         // State tab aktif (diproses/dikirim/selesai/batal) & fungsinya
    isLoading,                        // Status loading fetch data
    toast, setToast,                  // State notifikasi ToastAlert
    confirmModal, setConfirmModal,    // State modal konfirmasi (batalkan/terima pesanan)
    selectedOrder,                    // Objek pesanan yang sedang dipilih untuk modal detail
    isModalDetailOpen, setIsModalDetailOpen, // State kontrol visibilitas modal detail
    handleOpenDetail,                 // Handler membuka modal detail
    handlePay,                        // Handler pemrosesan transaksi Midtrans Snap
    handleConfirmClick,               // Handler klik konfirmasi pesanan diterima
    handleCancelClick,                // Handler klik pembatalan pesanan
    processConfirm,                   // Fungsi eksekusi akhir aksi konfirmasi
    filteredOrders,                   // Array data pesanan yang sudah disaring per tab
  } = useRiwayatPembelian();

  return (
    <div className="bg-[#f4f7f6] min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate('/ProfilCustomer')}
          className="flex items-center text-gray-500 hover:text-[#56BC36] mb-6 transition"
        >
          <ChevronLeft size={20} />
          <span className="font-medium ml-1">Kembali ke Profil</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Riwayat Pembelian</h1>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6 flex overflow-x-auto custom-scrollbar gap-2">
          <button
            onClick={() => setActiveTab('diproses')}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition whitespace-nowrap ${activeTab === 'diproses' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-gray-500 hover:bg-gray-50 border border-transparent'}`}
          >
            <Clock size={18} />
            Diproses
          </button>
          <button
            onClick={() => setActiveTab('dikirim')}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition whitespace-nowrap ${activeTab === 'dikirim' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 'text-gray-500 hover:bg-gray-50 border border-transparent'}`}
          >
            <Truck size={18} />
            Dalam Perjalanan
          </button>
          <button 
            onClick={() => setActiveTab('selesai')}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition whitespace-nowrap ${activeTab === 'selesai' ? 'bg-green-50 text-[#56BC36] border border-green-100' : 'text-gray-500 hover:bg-gray-50 border border-transparent'}`}
          >
            <CheckCircle size={18} />
            Selesai
          </button>
          <button 
            onClick={() => setActiveTab('dibatalkan')}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition whitespace-nowrap ${activeTab === 'dibatalkan' ? 'bg-red-50 text-red-600 border border-red-100' : 'text-gray-500 hover:bg-gray-50 border border-transparent'}`}
          >
            <XCircle size={18} />
            Batal
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500 font-medium">Memuat riwayat...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Package size={40} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-bold text-lg">Belum ada pesanan di tab ini.</p>
              <p className="text-gray-400 text-sm mt-2">Pesanan yang sesuai dengan status ini akan muncul di sini.</p>
            </div>
          ) : (
            filteredOrders.map(order => {
              // Determine tag colors based on active tab
               const tagStyle = activeTab === 'diproses' 
                 ? 'bg-blue-50 text-blue-600 border-blue-200' 
                 : activeTab === 'dikirim' 
                   ? 'bg-yellow-50 text-yellow-600 border-yellow-200' 
                   : activeTab === 'dibatalkan'
                     ? 'bg-red-50 text-red-600 border-red-200'
                     : 'bg-green-50 text-[#56BC36] border-green-200';

              return (
                <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex flex-wrap justify-between items-center mb-4 pb-4 border-b border-gray-50">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShoppingBagIcon />
                        <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">{order.invoiceNumber || `TRX-${order.idPenjualan}`}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{order.tanggal || order.created_at}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold border tracking-wide uppercase ${tagStyle}`}>
                      {order.orderStatus || 'Menunggu'}
                    </div>
                  </div>

                  <div className="space-y-4 mb-5">
                    {(order.detailPenjualan || order.items || []).map((item, idx) => {
                      const imageSrc = item.produk?.gambar?.startsWith?.('http') || item.produk?.gambar?.startsWith?.('data:')
                        ? item.produk?.gambar
                        : item.produk?.gambar ? `${STORAGE_BASE_URL}${String(item.produk?.gambar).replace(/^(?:public\/|storage\/|\/)+/, '')}` : '';
                      return (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center p-1">
                            {imageSrc ? <img src={imageSrc} className="w-full h-full object-cover rounded-lg" /> : <Package size={24} className="text-gray-300" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 line-clamp-1">{item.produk?.nama}</h4>
                            <p className="text-sm text-gray-500">{item.jumlahProduk} barang x {formatRupiah(item.produk?.harga)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex flex-wrap justify-between items-center pt-5 border-t border-gray-50">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Belanja</p>
                      <p className="font-bold text-xl text-gray-800">{formatRupiah(order.total)}</p>
                    </div>
                    <div className="flex gap-3">
                      {activeTab === 'diproses' && (order.paymentStatus || '').toLowerCase() === 'unpaid' && (
                        <button
                          onClick={() => handleCancelClick(order.idPenjualan)}
                          className="px-6 py-3 bg-white border border-red-200 hover:bg-red-50 text-red-500 font-bold rounded-xl transition shadow-sm"
                        >
                          Batalkan
                        </button>
                      )}
                      {activeTab === 'diproses' && (order.paymentStatus || '').toLowerCase() === 'unpaid' && (
                        <button
                          onClick={() => handlePay(order.snapToken)}
                          className="px-8 py-3 bg-[#56BC36] hover:bg-[#2da509] text-white font-bold rounded-xl transition shadow-sm shadow-green-200"
                        >
                          Bayar Sekarang
                        </button>
                      )}
                      {activeTab === 'dikirim' && (
                        <button
                          onClick={() => handleConfirmClick(order.idPenjualan)}
                          className="px-8 py-3 bg-[#56BC36] hover:bg-[#2da509] text-white font-bold rounded-xl transition shadow-sm shadow-green-200"
                        >
                          Pesanan Diterima
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenDetail(order)}
                        className="inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-white border border-gray-200 hover:border-green-500 hover:text-green-600 rounded-xl font-semibold text-gray-600 transition-colors shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <ToastAlert
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
      <ModalKonfirmasi
        isOpen={confirmModal.isOpen}
        title={confirmModal.action === 'cancel' ? "Batalkan Pesanan" : "Konfirmasi Pesanan"}
        message={confirmModal.action === 'cancel' ? "Apakah Anda yakin ingin membatalkan pesanan ini? Stok akan dikembalikan dan tidak dapat diubah lagi." : "Apakah Anda yakin pesanan ini sudah diterima dengan baik?"}
        confirmText={confirmModal.action === 'cancel' ? "Ya, Batalkan" : "Ya, Sudah Diterima"}
        cancelText="Kembali"
        type={confirmModal.action === 'cancel' ? "danger" : "success"}
        onConfirm={processConfirm}
        onClose={() => setConfirmModal({ isOpen: false, idPenjualan: null, action: null })}
      />
      <ModalDetailPembelian
        isOpen={isModalDetailOpen}
        onClose={() => setIsModalDetailOpen(false)}
        selectedOrder={selectedOrder}
      />
    </div>
  )
}

function ShoppingBagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

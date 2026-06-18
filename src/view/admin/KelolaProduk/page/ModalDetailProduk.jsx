import React from 'react';
import { X } from 'lucide-react';
import { STORAGE_BASE_URL } from '@/core/api/endpoints';

const ModalDetailProduk = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans transition-opacity">
      <div className="bg-white rounded-lg w-[900px] max-w-[95%] max-h-[90vh] overflow-y-auto shadow-[0_0_15px_rgba(0,0,0,0.1)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Detail Produk</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 flex flex-col md:flex-row gap-10">
          
          {/* Kolom Gambar */}
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="w-56 h-56 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
              {data.gambar ? (
                <img 
                  src={data.gambar.startsWith('http') ? data.gambar : `${STORAGE_BASE_URL}${String(data.gambar).replace(/^(?:public\/|storage\/|\/)+/, '')}`} 
                  alt={data.nama || data.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">Tidak ada gambar</span>
              )}
            </div>
            <div className="mt-4 w-full text-center">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                (data.stock !== undefined ? data.stock : data.count) > 0 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {(data.stock !== undefined ? data.stock : data.count) > 0 ? 'Stok Tersedia' : 'Stok Habis'}
              </span>
            </div>
          </div>

          {/* Kolom Detail Text */}
          <div className="md:w-2/3 flex flex-col gap-6">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{data.nama || data.name || '-'}</h3>
              <p className="text-base font-medium text-blue-600">{data.kategori?.nama || data.kategori || '-'}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 mb-1">Harga</p>
                <p className="text-xl font-bold text-gray-900">
                  {data.harga ? `Rp ${Number(data.harga).toLocaleString('id-ID')}` : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Stock Tersedia</p>
                <p className="text-xl font-bold text-gray-900">
                  {data.stock !== undefined ? data.stock : data.count}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Berat Produk</p>
                <p className="text-lg font-semibold text-gray-800">
                  {data.berat ? `${data.berat} gram` : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">ID Produk</p>
                <p className="text-lg font-medium text-gray-800">
                  {data.idProduk || data.id || '-'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">Deskripsi Produk</p>
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50/50 p-5 rounded-lg border border-gray-100 min-h-[120px]">
                {data.deskripsi || data.description || <span className="text-gray-400 italic">Tidak ada deskripsi.</span>}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ModalDetailProduk;

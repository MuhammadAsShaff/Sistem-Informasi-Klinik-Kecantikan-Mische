import React from 'react';
import { X, Upload } from 'lucide-react';
import { useModalPerbaruiProduk } from '../hooks/useModalPerbaruiProduk';

/**
 * TAMPILAN FORMULIR PERBARUI PRODUK LAMA (ModalPerbaruiProduk)
 * Ibarat meja khusus yang muncul membawa formulir isian saat admin menekan tombol pensil (edit).
 * Formulir ini sudah ditulisi dengan informasi barang yang lama (seperti harga lama dan foto lama), 
 * sehingga admin tinggal mencoret bagian yang salah dan menggantinya dengan tulisan baru.
 */
const ModalPerbaruiProduk = ({ isOpen, onClose, categoryData, refetch, showToast }) => {
  // Memanggil pengurus juru tulis yang memegang kertas isian dan tinta pena
  const {
    nama, setNama,
    harga, setHarga,
    stock, setStock,
    berat, setBerat,
    kategori, setKategori,
    deskripsi, setDeskripsi,
    preview,
    isSubmitting,
    categories,
    handleImageChange,
    handleSave
  } = useModalPerbaruiProduk(categoryData, isOpen, refetch, showToast, onClose);

  // Jika saklar pembukanya mati, meja formulir ini tetap ditutup
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans transition-opacity">
      <div className="bg-white rounded-lg w-[700px] max-w-[95%] shadow-[0_0_15px_rgba(0,0,0,0.1)] flex flex-col">
        
        {/* Judul Atas Meja Formulir & Tombol Tutup (X) */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Perbarui Produk</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* --- BAGIAN KOTAK-KOTAK ISIAN FORMULIR --- */}
        <div className="p-8 grid grid-cols-2 gap-x-6 gap-y-6">
          
          {/* Baris 1: Kotak Isian Nama Barang dan Harga */}
          <div className="flex flex-col">
            <label className="text-gray-900 mb-2">Nama Produk</label>
            <input
              type="text"
              placeholder="Nama Produk"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="border border-gray-300 rounded p-3 text-sm outline-none focus:border-green-500 transition-colors"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-900 mb-2">Harga Produk</label>
            <input
              type="text"
              placeholder="Harga Produk"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              className="border border-gray-300 rounded p-3 text-sm outline-none focus:border-green-500 transition-colors"
            />
            <p className="text-[11px] text-red-500 italic mt-0.5">* Hanya angka, tidak boleh negatif</p>
          </div>

          {/* Baris 2: Kotak Isian Jumlah Stok dan Berat Barang */}
          <div className="flex flex-col">
            <label className="text-gray-900 mb-2">Stock</label>
            <input
              type="text"
              placeholder="Jumlah Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="border border-gray-300 rounded p-3 text-sm outline-none focus:border-green-500 transition-colors"
            />
            <p className="text-[11px] text-red-500 italic mt-0.5">* Hanya angka</p>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-900 mb-2">Berat Produk (gram)</label>
            <input
              type="text"
              placeholder="Berat (gram)"
              value={berat}
              onChange={(e) => setBerat(e.target.value)}
              className="border border-gray-300 rounded p-3 text-sm outline-none focus:border-green-500 transition-colors"
            />
            <p className="text-[11px] text-red-500 italic mt-0.5">* Hanya angka dalam satuan gram</p>
          </div>

          {/* Baris 3: Pemilihan Kategori dan Cerita Deskripsi */}
          <div className="flex flex-col">
            <label className="text-gray-900 mb-2">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="border border-gray-300 rounded p-3 text-sm outline-none focus:border-green-500 transition-colors bg-white cursor-pointer"
            >
              <option value="" disabled>Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.idKategori} value={cat.idKategori}>
                  {cat.nama}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-900 mb-2">Deskripsi Produk</label>
            <textarea
              placeholder="Deskripsi Produk"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="border border-gray-300 rounded p-3 text-sm h-[130px] outline-none focus:border-green-500 transition-colors resize-none"
            />
          </div>

          {/* Baris 4: Kotak Unggah dan Pajangan Intip Foto Baru */}
          <div className="flex flex-col col-span-2 lg:col-span-1">
            <label className="text-gray-900 mb-2">Gambar Produk</label>
            <label className="border-2 border-dashed border-gray-300 rounded p-4 text-sm flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 h-[130px] transition-colors overflow-hidden relative">
              {preview ? (
                <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="text-gray-400 mb-2" size={24} />
                  <span className="text-gray-500">Klik untuk unggah gambar</span>
                </>
              )}
              <input type="file" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={handleImageChange} />
            </label>
            <p className="text-[11px] text-red-500 italic mt-0.5">* Format: JPG/PNG/JPEG. Maks 2MB</p>
          </div>
        </div>

        {/* Tombol Simpan di Bagian Bawah Meja Formulir */}
        <div className="px-8 py-5 border-t border-gray-200 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className={`bg-[#56BC36] hover:bg-[#2da509] text-white font-medium px-6 py-2.5 rounded shadow-sm transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPerbaruiProduk;

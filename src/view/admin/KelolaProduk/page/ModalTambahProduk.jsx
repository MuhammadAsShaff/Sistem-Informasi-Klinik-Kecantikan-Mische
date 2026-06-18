import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { useTambahProduk } from '../hooks/useTambahProduk';
import { useFetchKategori } from '../../KelolaKategoriProduk/hooks/useFetchKategori';

const ModalTambahProduk = ({ isOpen, onClose, refetch, showToast }) => {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [stock, setStock] = useState('');
  const [berat, setBerat] = useState('');
  const [kategori, setKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [gambar, setGambar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { tambahProduk } = useTambahProduk(refetch);
  const { categories } = useFetchKategori();

  // Reset fields when opened
  useEffect(() => {
    if (isOpen) {
      setNama('');
      setHarga('');
      setStock('');
      setBerat('');
      setKategori('');
      setDeskripsi('');
      setGambar(null);
      setPreview(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambar(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleSave = async () => {
    if (!nama || !harga || !stock || !berat || !kategori) {
      showToast('Mohon isi semua field yang wajib', 'error');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('harga', harga);
    formData.append('stock', stock);
    formData.append('berat', berat);
    formData.append('idKategori', kategori);
    if (deskripsi) formData.append('deskripsi', deskripsi);
    if (gambar) formData.append('gambar', gambar);

    const result = await tambahProduk(formData);
    setIsSubmitting(false);

    if (result.success) {
      showToast("Berhasil menambahkan produk", 'success');
      onClose();
    } else {
      let errorDetail = result.message;
      if (result.errors) {
        const firstErrorKey = Object.keys(result.errors)[0];
        errorDetail = result.errors[firstErrorKey][0];
      }
      showToast(errorDetail, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans transition-opacity">
      <div className="bg-white rounded-lg w-[700px] max-w-[95%] shadow-[0_0_15px_rgba(0,0,0,0.1)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Tambah Produk</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 grid grid-cols-2 gap-x-6 gap-y-6">
          {/* Row 1 */}
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

          {/* Row 2 */}
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

          {/* Row 3 */}
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

          {/* Row 4 */}
          <div className="flex flex-col col-span-2 lg:col-span-1">
            <label className="text-gray-900 mb-2">Gambar Produk (Opsional)</label>
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

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-200 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className={`bg-[#56BC36] hover:bg-[#2da509] text-white font-medium px-6 py-2.5 rounded shadow-sm transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Menyimpan...' : 'Tambah Produk'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTambahProduk;

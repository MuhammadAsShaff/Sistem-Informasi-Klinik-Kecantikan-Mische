import React, { useState } from 'react';
import { X, MapPin, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import ModalFormAlamat from './ModalFormAlamat';
import ModalKonfirmasiHapus from '../../DetailKeranjang/page/ModalKonfirmasiHapus';

const ModalKelolaAlamat = ({ isOpen, onClose, hookKelolaAlamat }) => {
  const { 
    alamatList, 
    isLoading, 
    provinces, 
    cities, 
    fetchCities, 
    tambahAlamat, 
    hapusAlamat, 
    jadikanUtama 
  } = hookKelolaAlamat;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [alamatToDelete, setAlamatToDelete] = useState(null);

  const handleSaveBaru = async (formData) => {
    const success = await tambahAlamat(formData);
    if (success) {
      setIsFormOpen(false);
    }
    return success;
  };

  const handleHapus = (id) => {
    setAlamatToDelete(id);
  };

  const confirmHapus = async () => {
    if (alamatToDelete) {
      await hapusAlamat(alamatToDelete);
      setAlamatToDelete(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#f8f9fa] w-full max-w-3xl rounded-3xl shadow-2xl relative my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-white px-8 py-5 border-b border-gray-100 rounded-t-3xl flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full text-[#56BC36]">
              <MapPin size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Alamat Saya</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto flex-1 bg-[#f8f9fa]">
          {isLoading ? (
            <div className="flex justify-center items-center py-10 text-gray-500">Memuat alamat...</div>
          ) : (
            <div className="space-y-4">
              {alamatList.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                  <p className="text-gray-500 mb-4">Anda belum memiliki alamat tersimpan.</p>
                </div>
              ) : (
                alamatList.map((alamat, index) => (
                  <div key={alamat.id || index} className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${alamat.is_utama ? 'border-[#56BC36] ring-1 ring-[#56BC36]' : 'border-gray-100 hover:border-green-200'}`}>
                    <div className="flex justify-between gap-4">
                      
                      {/* Tombol Pilih (Radio) di Kiri */}
                      <div className="flex items-start pt-1">
                        <button 
                          onClick={() => !alamat.is_utama && jadikanUtama(alamat.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            alamat.is_utama ? 'border-[#56BC36] bg-[#56BC36]' : 'border-gray-300 hover:border-[#56BC36]'
                          }`}
                        >
                          {alamat.is_utama && <CheckCircle2 size={14} className="text-white" />}
                        </button>
                      </div>

                      {/* Info Alamat */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-800 text-lg">{alamat.namaPenerima}</h3>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600 font-medium">{alamat.nomorHp}</span>
                          {alamat.is_utama ? (
                            <span className="ml-2 bg-green-100 text-[#56BC36] text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                              Utama
                            </span>
                          ) : null}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-1">{alamat.detailAlamat}</p>
                        <p className="text-gray-500 text-sm">
                          {alamat.districtId ? `${alamat.districtId}, ` : ''}{alamat.cityId}, {alamat.provinceId} {alamat.kodePos}
                        </p>
                      </div>

                      {/* Aksi */}
                      <div className="flex flex-col justify-center items-end gap-3 shrink-0 border-l border-gray-100 pl-4">
                        <button onClick={() => handleHapus(alamat.id)} className="text-red-500 font-bold text-sm flex items-center gap-1 hover:bg-red-50 px-3 py-2 rounded-lg transition">
                          <Trash2 size={16} /> Hapus
                        </button>
                      </div>

                    </div>
                  </div>
                ))
              )}

              {/* Tambah Alamat Btn */}
              {alamatList.length < 3 ? (
                <button 
                  onClick={() => setIsFormOpen(true)}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 font-bold py-4 rounded-2xl hover:border-[#56BC36] hover:text-[#56BC36] hover:bg-green-50 transition-all"
                >
                  <Plus size={20} /> Tambah Alamat Baru ({alamatList.length}/3)
                </button>
              ) : (
                <p className="text-center text-sm text-gray-500 mt-6">Anda telah mencapai batas maksimal 3 alamat.</p>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Modal Form */}
      <ModalFormAlamat 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveBaru}
        provinces={provinces}
        cities={cities}
        fetchCities={fetchCities}
      />

      {/* Modal Konfirmasi Hapus */}
      <ModalKonfirmasiHapus 
        isOpen={!!alamatToDelete}
        onClose={() => setAlamatToDelete(null)}
        onConfirm={confirmHapus}
        message="Apakah Anda yakin ingin menghapus alamat ini dari daftar alamat Anda?"
      />
    </div>
  );
};

export default ModalKelolaAlamat;

import React, { useState, useEffect } from "react";

const ModalEdit = ({ isOpen, onClose, onSubmit, data }) => {
  const [fileName, setFileName] = useState("No File Choosen");
  const [formData, setFormData] = useState({
    nama: '',
    tanggal: '',
    jenis: '',
    deskripsi: '',
    foto: null
  });

  // Initialize form data when opened with existing data
  useEffect(() => {
    if (isOpen && data) {
      setFormData({
        nama: data.nama || '',
        tanggal: data.tanggal || '',
        jenis: data.jenis || '',
        deskripsi: data.deskripsi || '',
        foto: data.foto || null
      });
      setFileName("No File Choosen");
    }
  }, [isOpen, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData.nama && formData.jenis) {
      onSubmit(formData);
    } else {
      alert("Mohon isi Nama dan Jenis Testimoni!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 font-poppins">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Perbarui Testimoni</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Unggah Gambar Testimoni</label>
              <div className="flex items-center gap-3">
                <label className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-5 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer inline-block">
                  Choose File
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setFileName(file.name);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ ...prev, foto: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setFileName("No File Choosen");
                        setFormData(prev => ({ ...prev, foto: null }));
                      }
                    }}
                    className="sr-only"
                  />
                </label>
                <span className="text-sm text-gray-500 font-medium truncate max-w-[200px]">
                  {fileName}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Deskripsi Testimoni</label>
              <textarea 
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-gray-400 min-h-[160px] resize-none"
                placeholder="Deskripsi Testimoni"
              ></textarea>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Nama Testimoni</label>
              <input 
                type="text" 
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-gray-400"
                placeholder="Nama Testimoni"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Tanggal Testimoni</label>
              <div className="relative">
                <input 
                  type="date" 
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Jenis Testimoni</label>
              <select 
                name="jenis"
                value={formData.jenis}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-gray-400 bg-white"
              >
                <option value="" disabled>Pilih Jenis Testimoni</option>
                <option value="Treatment">Treatment</option>
                <option value="Produk">Produk</option>
                <option value="Pelayanan">Pelayanan</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button 
            onClick={handleSubmit}
            className="bg-[#56BC36] hover:bg-[#469e2c] text-white px-6 py-2.5 rounded font-medium transition-colors"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEdit;

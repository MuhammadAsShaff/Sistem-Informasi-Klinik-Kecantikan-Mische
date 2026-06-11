import React, { useState } from "react";
import { useTambahTestimoni } from "../hooks/useTambahTestimoni";

const ModalTambah = ({ isOpen, onClose, refetch, showToast }) => {
  const [fileName, setFileName] = useState("No File Choosen");
  const [formData, setFormData] = useState({
    namaTester: '',
    tanggalTreatment: '',
    jenisTestimoni: '',
    deskripsi: '',
    buktiFoto: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { tambahTestimoni } = useTambahTestimoni(refetch);

  React.useEffect(() => {
    if (isOpen) {
      setFormData({ namaTester: '', tanggalTreatment: '', jenisTestimoni: '', deskripsi: '', buktiFoto: null });
      setFileName("No File Choosen");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (formData.namaTester && formData.jenisTestimoni && formData.tanggalTreatment && formData.deskripsi && formData.buktiFoto) {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append('namaTester', formData.namaTester);
      payload.append('jenisTestimoni', formData.jenisTestimoni);
      payload.append('deskripsi', formData.deskripsi);
      payload.append('tanggalTreatment', formData.tanggalTreatment);
      payload.append('buktiFoto', formData.buktiFoto);

      const result = await tambahTestimoni(payload);
      setIsSubmitting(false);
      
      if (result.success) {
        showToast(result.message, "success");
        onClose();
      } else {
        // Build a detailed error message if there are validation errors
        let errorDetail = result.message;
        if (result.errors) {
          const firstErrorKey = Object.keys(result.errors)[0];
          errorDetail = result.errors[firstErrorKey][0];
          console.error("Validation Errors:", result.errors);
        }
        showToast(errorDetail, "error");
      }
    } else {
      showToast("Mohon isi semua form termasuk unggah foto!", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 font-poppins">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Tambah Testimoni</h2>
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
                        setFormData(prev => ({ ...prev, buktiFoto: file }));
                      } else {
                        setFileName("No File Choosen");
                        setFormData(prev => ({ ...prev, buktiFoto: null }));
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
                name="namaTester"
                value={formData.namaTester}
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
                  name="tanggalTreatment"
                  value={formData.tanggalTreatment}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-gray-400"
                  placeholder="dd/mm/yyyy"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Jenis Testimoni</label>
              <select 
                name="jenisTestimoni"
                value={formData.jenisTestimoni}
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
            disabled={isSubmitting}
            className={`bg-[#56BC36] hover:bg-[#469e2c] text-white px-6 py-2.5 rounded font-medium transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Menyimpan...' : 'Tambah Testimoni'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTambah;

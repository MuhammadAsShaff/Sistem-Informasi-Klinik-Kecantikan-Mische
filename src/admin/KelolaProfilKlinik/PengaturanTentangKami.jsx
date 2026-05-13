import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-wysiwyg';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';

const PengaturanTentangKami = ({ data, onSimpan, onHapusClick }) => {
  const [formData, setFormData] = useState({
    deskripsiPerusahaan: '',
    visi: '',
    misi: '',
    jamBuka: '',
    jamTutup: '',
    nomorCustomerService: '',
    fotoPerusahaan: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (data) {
      setFormData({
        deskripsiPerusahaan: data.deskripsiPerusahaan || '',
        visi: data.visi || '',
        misi: data.misi || '',
        jamBuka: data.jamBuka ? data.jamBuka.substring(0, 5) : '',
        jamTutup: data.jamTutup ? data.jamTutup.substring(0, 5) : '',
        nomorCustomerService: data.nomorCustomerService || '',
        fotoPerusahaan: null
      });
      setPreviewImage(data.fotoPerusahaan ? `http://127.0.0.1:8000/storage/${data.fotoPerusahaan}` : null);
    } else {
      setFormData({
        deskripsiPerusahaan: '', visi: '', misi: '', jamBuka: '', jamTutup: '', nomorCustomerService: '', fotoPerusahaan: null
      });
      setPreviewImage(null);
    }
    
    // Pastikan input file dibersihkan setelah fetch/reload data
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert("Format file tidak didukung! Pastikan menggunakan file gambar dengan ekstensi: jpeg, png, atau jpg.");
        e.target.value = ''; // Reset input file
        return;
      }
      
      // Validasi ukuran maksimal 4MB (sesuai backend max:4000) -> Wait, user asked for "maksimal 2mb mimes:jpeg,png,jpg"
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 2MB mimes:jpeg,png,jpg.");
        e.target.value = ''; // Reset input file
        return;
      }
      setFormData({ ...formData, fotoPerusahaan: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    onSimpan(formData);
  };

  return (
    <div className="border border-black p-6 mb-6 rounded-none bg-transparent">
      <div className="mb-4">
        <label className="block text-[13px] font-semibold text-black mb-1">Deskripsi Klinik</label>
        <Editor
          value={formData.deskripsiPerusahaan}
          onChange={(e) => setFormData({ ...formData, deskripsiPerusahaan: e.target.value })}
          containerProps={{
            style: { backgroundColor: 'white', minHeight: '150px' },
            className: "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block text-[13px] font-semibold text-black mb-1">Visi Klinik</label>
          <Editor
            value={formData.visi}
            onChange={(e) => setFormData({ ...formData, visi: e.target.value })}
            containerProps={{
              style: { backgroundColor: 'white', minHeight: '150px' },
              className: "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            }}
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-black mb-1">Misi Klinik</label>
          <Editor
            value={formData.misi}
            onChange={(e) => setFormData({ ...formData, misi: e.target.value })}
            containerProps={{
              style: { backgroundColor: 'white', minHeight: '150px' },
              className: "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            }}
          />
        </div>
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-[13px] font-semibold text-black mb-1">Jam Operasional Buka</label>
            <TimePicker
              ampm={false}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              value={formData.jamBuka ? dayjs(`2024-01-01T${formData.jamBuka}`) : null}
              onChange={(newValue) => {
                setFormData({
                  ...formData,
                  jamBuka: newValue ? newValue.format('HH:mm') : ''
                });
              }}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  sx: {
                    backgroundColor: 'white',
                    borderRadius: 0,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#9ca3af',
                      borderRadius: 0,
                    }
                  }
                }
              }}
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-black mb-1">Jam Operasional Tutup</label>
            <TimePicker
              ampm={false}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              value={formData.jamTutup ? dayjs(`2024-01-01T${formData.jamTutup}`) : null}
              onChange={(newValue) => {
                setFormData({
                  ...formData,
                  jamTutup: newValue ? newValue.format('HH:mm') : ''
                });
              }}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  sx: {
                    backgroundColor: 'white',
                    borderRadius: 0,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#9ca3af',
                      borderRadius: 0,
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </LocalizationProvider>

      <div className="mb-6">
        <label className="block text-[13px] font-semibold text-black mb-1">Nomor Customer Service</label>
        <input name="nomorCustomerService" value={formData.nomorCustomerService} onChange={handleChange} type="text" placeholder="08xx-xxxx-xxxx" className="w-full border border-gray-400 p-2 text-sm focus:outline-none bg-white" />
      </div>

      <div className="mb-6">
        <div className="w-36 h-24 border border-black flex items-center justify-center text-[13px] font-semibold mb-2 bg-gray-100 overflow-hidden">
          {previewImage ? (
            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 text-center px-2">Foto Perusahaan</span>
          )}
        </div>
        <div className="flex flex-col">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full file:bg-[#1f2937] file:text-white file:border-black file:rounded-none file:px-3 file:py-1.5 file:cursor-pointer file:text-xs file:font-medium text-xs text-black border border-black p-0"
          />
          <span className="text-[11px] text-red-500 mt-1">* Maksimal 2MB (Format: jpeg, png, jpg)</span>
        </div>
      </div>

      <div className="flex flex-row gap-4 mt-4">
        {data ? (
          <>
            <button onClick={handleSubmit} className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-5 py-2 text-[13px] font-medium shadow-md transition-all active:scale-95">Perbarui</button>
            <button onClick={onHapusClick} className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-5 py-2 text-[13px] font-medium shadow-md transition-all active:scale-95">Hapus</button>
          </>
        ) : (
          <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-[13px] font-medium shadow-md transition-all active:scale-95">Tambah Profil</button>
        )}
      </div>
    </div>
  );
};

export default PengaturanTentangKami;

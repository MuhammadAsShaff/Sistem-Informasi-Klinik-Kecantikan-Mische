import React from 'react';
import { usePengaturanTentangKami } from '../hooks/usePengaturanTentangKami';
import Editor from 'react-simple-wysiwyg';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';

const PengaturanTentangKami = ({ data, onSimpan, onError, onHapusClick }) => {
  const {
    formData,
    setFormData,
    previewImage,
    hasFileError,
    fileInputRef,
    handleChange,
    handleFileChange,
    handleSubmit
  } = usePengaturanTentangKami(data, onSimpan, onError);

  return (
    <div className="border border-black p-6 mb-6 rounded-none bg-transparent">
      <div className="mb-4">
        <label className="block text-[13px] font-semibold text-black mb-1">Deskripsi Klinik <span className="text-red-500">*</span></label>
        <Editor
          value={formData.deskripsiPerusahaan}
          onChange={(e) => setFormData({ ...formData, deskripsiPerusahaan: e.target.value })}
          containerProps={{
            style: { backgroundColor: 'white', minHeight: '150px' },
            className: "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
          }}
        />
        {!formData.deskripsiPerusahaan && <p className="text-[11px] text-red-500 mt-1">* Wajib diisi</p>}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block text-[13px] font-semibold text-black mb-1">Visi Klinik <span className="text-red-500">*</span></label>
          <Editor
            value={formData.visi}
            onChange={(e) => setFormData({ ...formData, visi: e.target.value })}
            containerProps={{
              style: { backgroundColor: 'white', minHeight: '150px' },
              className: "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            }}
          />
          {!formData.visi && <p className="text-[11px] text-red-500 mt-1">* Wajib diisi</p>}
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-black mb-1">Misi Klinik <span className="text-red-500">*</span></label>
          <Editor
            value={formData.misi}
            onChange={(e) => setFormData({ ...formData, misi: e.target.value })}
            containerProps={{
              style: { backgroundColor: 'white', minHeight: '150px' },
              className: "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            }}
          />
          {!formData.misi && <p className="text-[11px] text-red-500 mt-1">* Wajib diisi</p>}
        </div>
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-[13px] font-semibold text-black mb-1">Jam Operasional Buka <span className="text-red-500">*</span></label>
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
            {!formData.jamBuka && <p className="text-[11px] text-red-500 mt-1">* Wajib diisi</p>}
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-black mb-1">Jam Operasional Tutup <span className="text-red-500">*</span></label>
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
            {!formData.jamTutup && <p className="text-[11px] text-red-500 mt-1">* Wajib diisi</p>}
          </div>
        </div>
      </LocalizationProvider>

      <div className="mb-6">
        <label className="block text-[13px] font-semibold text-black mb-1">Nomor Customer Service <span className="text-red-500">*</span></label>
        <input name="nomorCustomerService" value={formData.nomorCustomerService} onChange={handleChange} type="text" placeholder="08xx-xxxx-xxxx" className="w-full border border-gray-400 p-2 text-sm focus:outline-none bg-white" />
        {!formData.nomorCustomerService && <p className="text-[11px] text-red-500 mt-1">* Wajib diisi</p>}
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
          <div className="flex items-center gap-3">
            <label className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-5 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer inline-block">
              Choose File
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
            <span className="text-sm text-gray-500 font-medium truncate max-w-[200px]">
              {formData.fotoPerusahaan ? (typeof formData.fotoPerusahaan === 'string' ? "Gambar Terpilih" : formData.fotoPerusahaan.name) : "No File Chosen"}
            </span>
          </div>
          <span className="text-[11px] text-red-500 mt-2 block">* Maksimal 2MB (Format: Semua Format Gambar){(!data?.fotoPerusahaan && !formData.fotoPerusahaan) ? ' - Wajib diisi' : ''}</span>
        </div>
      </div>

      <div className="flex flex-row gap-4 mt-4">
        {data ? (
          <>
            <button 
              onClick={handleSubmit} 
              disabled={!formData.deskripsiPerusahaan || !formData.visi || !formData.misi || !formData.jamBuka || !formData.jamTutup || !formData.nomorCustomerService || (!data?.fotoPerusahaan && !formData.fotoPerusahaan) || hasFileError}
              className={`bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-5 py-2 text-[13px] font-medium shadow-md transition-all ${!formData.deskripsiPerusahaan || !formData.visi || !formData.misi || !formData.jamBuka || !formData.jamTutup || !formData.nomorCustomerService || (!data?.fotoPerusahaan && !formData.fotoPerusahaan) || hasFileError ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
            >
              Perbarui
            </button>
            <button onClick={onHapusClick} className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-5 py-2 text-[13px] font-medium shadow-md transition-all active:scale-95">Hapus</button>
          </>
        ) : (
          <button 
            onClick={handleSubmit} 
            disabled={!formData.deskripsiPerusahaan || !formData.visi || !formData.misi || !formData.jamBuka || !formData.jamTutup || !formData.nomorCustomerService || !formData.fotoPerusahaan || hasFileError}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-[13px] font-medium shadow-md transition-all ${!formData.deskripsiPerusahaan || !formData.visi || !formData.misi || !formData.jamBuka || !formData.jamTutup || !formData.nomorCustomerService || !formData.fotoPerusahaan || hasFileError ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
          >
            Tambah Profil
          </button>
        )}
      </div>
    </div>
  );
};

export default PengaturanTentangKami;

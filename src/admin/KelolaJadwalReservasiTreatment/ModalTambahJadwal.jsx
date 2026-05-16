import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';

export default function ModalTambahJadwal({ isOpen, onClose, onSuccess, existingSchedules = [] }) {
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [clinicData, setClinicData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchClinicData();
    }
  }, [isOpen]);

  const fetchClinicData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8000/api/admin/clinic', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success && res.data.data) {
        setClinicData(res.data.data); // data is an object
      }
    } catch (error) {
      console.error('Error fetching clinic data:', error);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setErrorMessage('');
    if (!jamMulai || !jamSelesai) {
      setErrorMessage("Harap isi jam mulai dan jam selesai!");
      return;
    }

    if (jamMulai >= jamSelesai) {
      setErrorMessage("Jam Selesai harus lebih lambat dari Jam Mulai!");
      return;
    }

    if (clinicData) {
      const b = clinicData.jamBuka ? clinicData.jamBuka.substring(0, 5) : null;
      const t = clinicData.jamTutup ? clinicData.jamTutup.substring(0, 5) : null;

      if (b && jamMulai < b) {
        setErrorMessage(`Jam Mulai tidak boleh lebih awal dari jam operasional buka (${b})`);
        return;
      }

      if (t && jamSelesai > t) {
        setErrorMessage(`Jam Selesai tidak boleh lebih lambat dari jam operasional tutup (${t})`);
        return;
      }
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post('http://127.0.0.1:8000/api/admin/schedules', 
      {
        jamMulai,
        jamSelesai
      }, 
      {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setJamMulai("");
        setJamSelesai("");
        onSuccess && onSuccess();
      }
    } catch (error) {
      let errorMsg = 'Gagal menambahkan jadwal.';
      if (error.response?.data?.errors) {
        errorMsg = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    return dayjs().set('hour', parseInt(parts[0])).set('minute', parseInt(parts[1])).set('second', 0);
  };

  const parseToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  };

  const minOperasional = parseTime(clinicData?.jamBuka);
  const maxOperasional = parseTime(clinicData?.jamTutup);
  const minJamSelesai = jamMulai ? parseTime(jamMulai).add(1, 'minute') : minOperasional;
  const maxJamMulai = jamSelesai ? parseTime(jamSelesai).subtract(1, 'minute') : maxOperasional;

  const shouldDisableJamMulai = (timeValue, clockType) => {
    const h = timeValue.hour();
    const opBuka = parseToMinutes(clinicData?.jamBuka);
    const opTutup = parseToMinutes(clinicData?.jamTutup);

    if (clockType === 'hours') {
      if (opBuka !== null && (h * 60 + 59) < opBuka) return true;
      if (opTutup !== null && (h * 60) > opTutup) return true;
      return false;
    }

    const timeInMinutes = h * 60 + timeValue.minute();
    if (opBuka !== null && timeInMinutes < opBuka) return true;
    if (opTutup !== null && timeInMinutes > opTutup) return true;

    for (let s of existingSchedules) {
      const startMin = parseToMinutes(s.jamMulai);
      const endMin = parseToMinutes(s.jamSelesai);
      if (timeInMinutes >= startMin && timeInMinutes < endMin) return true;
    }
    return false;
  };

  const shouldDisableJamSelesai = (timeValue, clockType) => {
    const h = timeValue.hour();
    const opBuka = parseToMinutes(clinicData?.jamBuka);
    const opTutup = parseToMinutes(clinicData?.jamTutup);

    if (clockType === 'hours') {
      if (opBuka !== null && (h * 60 + 59) < opBuka) return true;
      if (opTutup !== null && (h * 60) > opTutup) return true;
      return false;
    }

    const timeInMinutes = h * 60 + timeValue.minute();
    if (opBuka !== null && timeInMinutes < opBuka) return true;
    if (opTutup !== null && timeInMinutes > opTutup) return true;

    for (let s of existingSchedules) {
      const startMin = parseToMinutes(s.jamMulai);
      const endMin = parseToMinutes(s.jamSelesai);
      if (timeInMinutes > startMin && timeInMinutes <= endMin) return true;
    }
    return false;
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[900px] rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        <div className="px-10 py-8 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Tambah Jadwal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors" disabled={isLoading}>
            <X size={28} />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-10 mt-6 bg-red-50 text-red-500 text-sm p-3 rounded-xl font-medium border border-red-100">
            {errorMessage}
          </div>
        )}

        <div className="px-10 py-8">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-10">
              
              <div className="flex flex-col gap-2.5">
                <label className="text-sm font-bold text-[#1A1A1A]">Jam Mulai</label>
                <TimePicker
                  ampm={false}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  minTime={minOperasional}
                  maxTime={maxJamMulai}
                  shouldDisableTime={shouldDisableJamMulai}
                  value={jamMulai ? dayjs(`2024-01-01T${jamMulai}`) : null}
                  onChange={(newValue) => setJamMulai(newValue ? newValue.format('HH:mm') : '')}
                  slotProps={{
                    textField: {
                      size: 'medium',
                      fullWidth: true,
                      sx: {
                        backgroundColor: 'white',
                        borderRadius: '0.75rem',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '0.75rem',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e5e7eb',
                        }
                      }
                    }
                  }}
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-sm font-bold text-[#1A1A1A]">Jam Selesai</label>
                <TimePicker
                  ampm={false}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  minTime={minJamSelesai}
                  maxTime={maxOperasional}
                  shouldDisableTime={shouldDisableJamSelesai}
                  value={jamSelesai ? dayjs(`2024-01-01T${jamSelesai}`) : null}
                  onChange={(newValue) => setJamSelesai(newValue ? newValue.format('HH:mm') : '')}
                  slotProps={{
                    textField: {
                      size: 'medium',
                      fullWidth: true,
                      sx: {
                        backgroundColor: 'white',
                        borderRadius: '0.75rem',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '0.75rem',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e5e7eb',
                        }
                      }
                    }
                  }}
                />
              </div>

            </div>
          </LocalizationProvider>

          <div className="flex justify-end pt-8 border-t border-gray-100">
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className={`bg-[#7CC052] text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-[#68a741] transition-all shadow-lg shadow-green-100 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Menyimpan...' : 'Tambah Jadwal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

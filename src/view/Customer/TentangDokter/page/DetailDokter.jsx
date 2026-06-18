import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDokterData } from '../hooks/useDokterData';
import EmailIcon from '../../../../assets/icons/ic_round-email.png';
import CustomerLoading from '../../components/CustomerLoading';

export default function DetailDokterPage() {
  const { id } = useParams();
  const { getDoctorById, isLoading } = useDokterData();
  const doctor = getDoctorById(id);

  if (isLoading) {
    return <CustomerLoading text="Memuat profil dokter..." />;
  }

  if (!doctor) {
    return <Navigate to="/tentang-kami/dokter" />;
  }

  // Gunakan email dari backend, atau fallback dummy
  const firstName = doctor.nama ? doctor.nama.replace('Dr. ', '').split(' ')[0] : 'Dokter';
  const email = doctor.email || `${firstName.charAt(0) + firstName.slice(1).toLowerCase()}@Gmail.Com`;

  // Format nama lengkap untuk diletakkan di dalam paragraf (Title Case)
  const fullNameTitleCase = doctor.nama
    ? doctor.nama
        .replace('Dr. ', '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    : '';

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-12 pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title Badge */}
        <div className="mb-10">
          <div className="bg-white inline-block px-8 md:px-12 py-4 md:py-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <h1 className="text-3xl md:text-4xl font-bold text-[#56BC36] tracking-wide">
              Biografi Dokter Klinik Mische
            </h1>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-row gap-6 md:gap-8 lg:gap-12 items-start w-full">

          {/* Kolom Kiri: Foto Dokter */}
          <div className="w-[40%] lg:w-1/3 flex-shrink-0">
            <div className="relative w-full h-[450px] md:h-[550px] lg:h-[620px] rounded-tl-[60px] rounded-bl-[60px] rounded-br-[60px] rounded-tr-xl overflow-hidden shadow-xl bg-gray-100">
              <img
                src={doctor.foto}
                alt={doctor.nama}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Kolom Kanan: Detail Deskripsi */}
          <div className="w-[60%] lg:w-2/3 flex-shrink-0">
            <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.07)] p-8 md:p-12 lg:p-14 flex flex-col justify-center">

              <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-8 tracking-tight">
                {doctor.nama}
              </h2>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-12 bg-[#56BC36] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <img src={EmailIcon} alt="Email" className="w-7 h-7 object-contain brightness-0 invert" />
                </div>
                <span className="text-black text-xl font-medium">
                  {email}
                </span>
              </div>

              <p className="text-gray-800 leading-relaxed text-justify text-base md:text-lg">
                {doctor.deskripsi}
              </p>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

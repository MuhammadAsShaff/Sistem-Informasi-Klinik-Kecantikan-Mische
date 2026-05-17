import React, { useState, useEffect } from 'react';
import { Clock, UserCircle } from 'lucide-react';
import axios from 'axios';
import StoreMische from '@/assets/images/StoreMische.png';

const AboutInfoSection = () => {
    const [clinicData, setClinicData] = useState(null);
    const [doctorCount, setDoctorCount] = useState(0);

    useEffect(() => {
        const fetchClinicInfo = async () => {
            try {
                // Customer endpoint does not require auth token
                const res = await axios.get('http://127.0.0.1:8000/api/customer/clinic');
                if (res.data.success && res.data.data && Object.keys(res.data.data).length > 0) {
                    setClinicData(res.data.data);
                }
            } catch (error) {
                console.error("Gagal mengambil profil klinik", error);
            }
        };

        const fetchDoctorCount = async () => {
            try {
                // Asumsi endpoint untuk mengambil data dokter (public)
                // Jika endpoint berbeda, cukup ganti URL ini
                const res = await axios.get('http://127.0.0.1:8000/api/customer/dokter');
                if (res.data.success && res.data.data) {
                    setDoctorCount(res.data.data.length || 0);
                }
            } catch (error) {
                console.error("Gagal mengambil data dokter", error);
            }
        };

        fetchClinicInfo();
        fetchDoctorCount();
    }, []);

    // Fallbacks
    const deskripsi = clinicData?.deskripsiPerusahaan || "";
    const visi = clinicData?.visi || "";
    const misi = clinicData?.misi || "";
    
    // Format jam if available
    let jamOperasional = "";
    if (clinicData?.jamBuka && clinicData?.jamTutup) {
        jamOperasional = `${clinicData.jamBuka.substring(0,5)} - ${clinicData.jamTutup.substring(0,5)} WIB`;
    }

    // Karena clinicData.fotoPerusahaan sudah berisi 'profil_perusahaan/nama_file.png', 
    // kita cukup panggil /storage/ saja di depannya.
    const imageSrc = clinicData?.fotoPerusahaan ? `http://127.0.0.1:8000/storage/${clinicData.fotoPerusahaan}` : StoreMische;
    return (
        <div className="w-full bg-white py-12 md:py-20">
            <div className="container mx-auto px-6 md:px-10 flex flex-col gap-10 md:gap-16 text-[#333333]">
                {/* Header paragraph */}
                <div>
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-black mb-2 md:mb-4">Mische Clinic</h2>
                    <div 
                        className="text-[10px] sm:text-sm md:text-base leading-relaxed text-gray-700 text-justify quill-content [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_em]:italic"
                        dangerouslySetInnerHTML={{ __html: deskripsi }}
                    />
                </div>

                {/* Image & Visi Misi Section */}
                <div className="flex flex-row gap-3 md:gap-16 items-start">
                    <div className="w-[45%] md:w-1/2 mt-2">
                        <img 
                            src={imageSrc} 
                            alt="Mische Clinic Building" 
                            className="w-full h-auto rounded-xl md:rounded-2xl shadow-md md:shadow-lg object-cover"
                        />
                    </div>
                    <div className="w-[55%] md:w-1/2 flex flex-col gap-3 md:gap-8">
                        <div>
                            <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-black mb-1 md:mb-2 text-left">Visi</h3>
                            <div 
                                className="text-[10px] sm:text-sm md:text-base text-gray-700 leading-normal md:leading-relaxed text-left md:text-justify quill-content [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_em]:italic"
                                dangerouslySetInnerHTML={{ __html: visi }}
                            />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-black mb-1 md:mb-2 text-left">Misi</h3>
                            <div 
                                className="text-[10px] sm:text-sm md:text-base text-gray-700 leading-normal md:leading-relaxed text-left md:text-justify quill-content [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_em]:italic"
                                dangerouslySetInnerHTML={{ __html: misi }}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats / Icons */}
                <div className="flex flex-row gap-4 md:gap-24 mt-4 md:mt-8 justify-between md:justify-start">
                    <div className="flex flex-col gap-2 md:gap-3 w-1/2 md:w-auto">
                        <span className="text-xs sm:text-lg md:text-xl font-bold text-black">Jam Operasional</span>
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="p-1.5 md:p-4 bg-[#baf5c6] rounded-full text-[#4BAF3A]">
                                <Clock className="w-5 h-5 md:w-9 md:h-9" />
                            </div>
                            <span className="text-[12px] sm:text-2xl md:text-4xl font-extrabold text-black tracking-tight">{jamOperasional}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 md:gap-3 w-1/2 md:w-auto">
                        <span className="text-xs sm:text-lg md:text-xl font-bold text-black">Jumlah Dokter</span>
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="p-1.5 md:p-4 bg-[#baf5c6] rounded-full text-[#4BAF3A]">
                                <UserCircle className="w-5 h-5 md:w-9 md:h-9" />
                            </div>
                            <span className="text-[12px] sm:text-2xl md:text-4xl font-extrabold text-black tracking-tight">{doctorCount} Dokter Aktif</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutInfoSection;

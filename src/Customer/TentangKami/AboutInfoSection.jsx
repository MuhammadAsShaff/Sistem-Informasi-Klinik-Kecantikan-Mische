import React from 'react';
import { Clock, UserCircle } from 'lucide-react';
import StoreMische from '../../assets/StoreMische.png';

const AboutInfoSection = () => {
    return (
        <div className="w-full bg-white py-12 md:py-20">
            <div className="container mx-auto px-6 md:px-10 flex flex-col gap-10 md:gap-16 text-[#333333]">
                {/* Header paragraph */}
                <div>
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-black mb-2 md:mb-4">Mische Clinic</h2>
                    <p className="text-[10px] sm:text-sm md:text-base leading-relaxed text-gray-700 text-justify">
                        Dengan Rangkaian Produk Yang Diformulasikan Khusus Untuk Perawatan Kulit Wajah, MISCHE Skincare Menghadirkan Manfaat Lengkap Yang Dibutuhkan Kulitmu. Mulai Dari Mencerahkan Warna Kulit, Menjaga Kelembapan Optimal, Hingga Mengatasi Tanda-Tanda Penuaan Dini. Produk Klinik Mische Juga Efektif Dalam Merawat Kulit Berjerawat Dan Membantu Mengembalikan Kilau Alami Wajahmu. Dengan Harga Yang Terjangkau, Klinik Mische Menjadi Pilihan Tepat Bagi Kamu Yang Ingin Merawat Kulit Secara Menyeluruh Dan Tampil Percaya Diri Setiap Hari.
                    </p>
                </div>

                {/* Image & Visi Misi Section */}
                <div className="flex flex-row gap-3 md:gap-16 items-center">
                    <div className="w-[45%] md:w-1/2">
                        <img 
                            src={StoreMische} 
                            alt="Mische Clinic Building" 
                            className="w-full h-auto rounded-xl md:rounded-2xl shadow-md md:shadow-lg object-cover"
                        />
                    </div>
                    <div className="w-[55%] md:w-1/2 flex flex-col gap-3 md:gap-8">
                        <div>
                            <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-black mb-1 md:mb-2 text-left">Visi</h3>
                            <p className="text-[10px] sm:text-sm md:text-base text-gray-700 leading-normal md:leading-relaxed text-left md:text-justify">
                                Dengan Rangkaian Produk Yang Diformulasikan Khusus Untuk Perawatan Kulit Wajah, MISCHE Skincare Menghadirkan Manfaat Lengkap Yang Dibutuhkan Kulitmu. Mulai Dari Mencerahkan Warna Kulit, Menjaga Kelembapan Optima.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-black mb-1 md:mb-2 text-left">Misi</h3>
                            <p className="text-[10px] sm:text-sm md:text-base text-gray-700 leading-normal md:leading-relaxed text-left md:text-justify">
                                Dengan Rangkaian Produk Yang Diformulasikan Khusus Untuk Perawatan Kulit Wajah, MISCHE Skincare Menghadirkan Manfaat Lengkap Yang Dibutuhkan Kulitmu. Mulai Dari Mencerahkan Warna Kulit, Menjaga Kelembapan Optima.
                            </p>
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
                            <span className="text-[12px] sm:text-2xl md:text-4xl font-extrabold text-black tracking-tight">07:00 - 18:00 WIB</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 md:gap-3 w-1/2 md:w-auto">
                        <span className="text-xs sm:text-lg md:text-xl font-bold text-black">Jumlah Dokter</span>
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="p-1.5 md:p-4 bg-[#baf5c6] rounded-full text-[#4BAF3A]">
                                <UserCircle className="w-5 h-5 md:w-9 md:h-9" />
                            </div>
                            <span className="text-[12px] sm:text-2xl md:text-4xl font-extrabold text-black tracking-tight">2 Dokter Aktif</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutInfoSection;

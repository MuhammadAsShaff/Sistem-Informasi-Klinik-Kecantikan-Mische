import React from 'react';
import { Clock, UserCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import TeamMische from '../../assets/TeamMische.png';
import Logo_Mische from '../../assets/Logo_Mische.png';
import StoreMische from '../../assets/StoreMische.png';
import FotoKegiatan1 from '../../assets/FotoKegiatan1.png';
import FotoKegiatan2 from '../../assets/FotoKegiatan2.png';
import FotoKegiatan3 from '../../assets/FotoKegiatan3.png';
import FotoKegiatan4 from '../../assets/FotoKegiatan4.png';


export default function TentangKamiPage() {
    return (
        <div className="w-full flex flex-col font-sans">
            {/* HERO SECTION */}
            <div className="w-full bg-gradient-to-r from-[#56bc36] from-[30%] to-[#C6FFD1] relative overflow-hidden py-12 md:py-24">
                {/* Background Logo Watermark */}
                <img 
                    src={Logo_Mische} 
                    alt="Background Watermark" 
                    className="absolute top-1/2 right-0 -translate-y-1/2 h-[75%] md:h-full w-auto max-w-none pointer-events-none z-0 opacity-65"
                />

                <div className="container mx-auto px-4 md:px-10 flex flex-row items-center justify-between relative z-10 gap-3 md:gap-10">
                    {/* Placeholder for the doctor group image */}
                    <div className="w-[50%] md:w-1/2 flex justify-start">
                        <img 
                            src={TeamMische} 
                            alt="Dokter Mische" 
                            className="w-[115%] md:w-full scale-100 max-w-[600px] h-auto object-cover rounded-3xl"
                        />
                    </div>
                    {/* Welcome Text */}
                    <div className="w-[55%] md:w-1/2 flex flex-col justify-center text-white relative py-4 md:py-10 text-left items-start">
                        
                        {/* Text Content */}
                        <div className="relative z-10 w-full pl-2 md:pl-0">
                            <h2 className="text-[15px] sm:text-3xl md:text-6xl lg:text-7xl font-bold mb-1 md:mb-2 text-left">Selamat Datang</h2>
                            <h1 className="text-[10px] sm:text-sm md:text-2xl lg:text-3xl font-extrabold leading-tight text-left md:mt-2">
                                # THE FIRST ACNE EXPERT IN TOWN
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* WHITE SECTION (MISCHE CLINIC, VISI MISI) */}
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

            {/* GREEN GALLERY SECTION */}
            <div className="w-full bg-gradient-to-r from-[#56bc36] from-[30%] to-[#C6FFD1] relative overflow-hidden py-12 md:py-24">
                <img 
                    src={Logo_Mische} 
                    alt="Background Watermark" 
                    className="absolute top-1/2 right-0 -translate-y-1/2 h-[50%] md:h-full w-auto max-w-none pointer-events-none z-0 opacity-65"
                />
                <div className="container mx-auto px-6 md:px-10 flex flex-col items-center relative z-10 text-white">
                    <div className="w-full text-left md:text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-4xl font-bold mb-2">Inilah Kegiatan Harian Kami Dalam Memberikan Perawatan Terbaik.</h2>
                        <p className="text-sm md:text-base opacity-90 tracking-wide uppercase font-semibold">#BEING BEAUTY WITH MISCHE</p>
                    </div>

                    {/* Main Gallery Display */}
                    <div className="w-full max-w-5xl rounded-3xl overflow-hidden relative shadow-2xl mb-4 md:mb-6 group">
                        <img 
                            src={FotoKegiatan1} 
                            alt="Activity" 
                            className="w-full h-[200px] sm:h-[350px] md:h-[500px] object-cover"
                        />
                        {/* Carouseld Arrows Component Mock */}
                        <button className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-3 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white/50 transition">
                            <ChevronLeft size={28} />
                        </button>
                        <button className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 md:p-3 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white/50 transition">
                            <ChevronRight size={28} />
                        </button>
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 w-full max-w-5xl mb-10 md:mb-14">
                        <img src={FotoKegiatan2} className="w-full h-[80px] sm:h-[150px] md:h-[220px] object-cover rounded-xl md:rounded-3xl shadow-lg border-2 border-transparent hover:border-white transition-all cursor-pointer" alt="Thumbnail 1" />
                        <img src={FotoKegiatan3} className="w-full h-[80px] sm:h-[150px] md:h-[220px] object-cover rounded-xl md:rounded-3xl shadow-lg border-2 border-transparent hover:border-white transition-all cursor-pointer" alt="Thumbnail 2" />
                        <img src={FotoKegiatan4} className="w-full h-[80px] sm:h-[150px] md:h-[220px] object-cover rounded-xl md:rounded-3xl shadow-lg border-2 border-transparent hover:border-white transition-all cursor-pointer" alt="Thumbnail 3" />
                    </div>

                    {/* Action Button */}
                    <button className="bg-white text-[#56BC36] font-bold text-base md:text-lg px-8 md:px-14 py-3 md:py-4 rounded-full hover:bg-gray-100 transition shadow-xl active:scale-95">
                        Lihat Lainnya
                    </button>
                </div>
                
                 {/* Decoration Background Abstract (Right) */}
                 <div className="absolute right-0 top-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[800px] bg-[#6aba68] opacity-50 rounded-l-full blur-3xl translate-x-1/2 -translate-y-1/2 hidden md:block"></div>
                 {/* Decoration Background Abstract (Left) */}
                 <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-[#9ade97] opacity-40 rounded-r-full blur-3xl -translate-x-1/2 translate-y-1/4 hidden md:block"></div>
            </div>
        </div>
    );
}

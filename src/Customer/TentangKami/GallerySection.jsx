import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Logo_Mische from '../../assets/Logo_Mische.png';
import FotoKegiatan1 from '../../assets/FotoKegiatan1.png';
import FotoKegiatan2 from '../../assets/FotoKegiatan2.png';
import FotoKegiatan3 from '../../assets/FotoKegiatan3.png';
import FotoKegiatan4 from '../../assets/FotoKegiatan4.png';

const GallerySection = () => {
    return (
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
    );
};

export default GallerySection;

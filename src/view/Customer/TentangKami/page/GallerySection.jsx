import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Logo_Mische from '@/assets/images/Logo_Mische.png';

const GallerySection = () => {
    const [kegiatanList, setKegiatanList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchKegiatan = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/customer/kegiatan');
                if (res.data.success) {
                    setKegiatanList(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching kegiatan:", error);
            }
        };
        fetchKegiatan();
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? kegiatanList.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === kegiatanList.length - 1 ? 0 : prev + 1));
    };

    if (kegiatanList.length === 0) {
        return null;
    }

    const mainKegiatan = kegiatanList[currentIndex];
    const uniqueThumbnails = kegiatanList.length > 1 
      ? kegiatanList.filter((_, idx) => idx !== currentIndex).slice(0, 3) 
      : [];

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
                <div className="w-full max-w-5xl rounded-3xl overflow-hidden relative shadow-2xl mb-4 md:mb-6 group bg-black/10">
                    {mainKegiatan.foto ? (
                      <img 
                          src={`http://127.0.0.1:8000/storage/${mainKegiatan.foto}`} 
                          alt={mainKegiatan.namaKegiatan} 
                          className="w-full h-[200px] sm:h-[350px] md:h-[500px] object-cover transition-all duration-300"
                      />
                    ) : (
                      <div className="w-full h-[200px] sm:h-[350px] md:h-[500px] flex items-center justify-center bg-gray-200 text-gray-500">
                          Foto Tidak Tersedia
                      </div>
                    )}
                    
                    {/* Caption / Title */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12">
                        <h3 className="text-xl md:text-2xl font-bold">{mainKegiatan.namaKegiatan}</h3>
                        <p className="text-sm md:text-base opacity-90 mt-1 line-clamp-2">{mainKegiatan.deskripsi}</p>
                    </div>

                    {kegiatanList.length > 1 && (
                      <>
                        <button onClick={handlePrev} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-3 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white/50 transition opacity-0 group-hover:opacity-100">
                            <ChevronLeft size={28} />
                        </button>
                        <button onClick={handleNext} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 md:p-3 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white/50 transition opacity-0 group-hover:opacity-100">
                            <ChevronRight size={28} />
                        </button>
                      </>
                    )}
                </div>

                {/* Thumbnails */}
                {uniqueThumbnails.length > 0 && (
                  <div className="flex gap-2 sm:gap-4 md:gap-6 justify-center w-full max-w-5xl mb-10 md:mb-14">
                      {uniqueThumbnails.map((thumb, idx) => (
                          <div key={thumb.idKegiatan || idx} className="flex-1 max-w-[30%]">
                            <img 
                                src={`http://127.0.0.1:8000/storage/${thumb.foto}`} 
                                className="w-full h-[80px] sm:h-[150px] md:h-[220px] object-cover rounded-xl md:rounded-3xl shadow-lg border-2 border-transparent hover:border-white transition-all cursor-pointer opacity-70 hover:opacity-100" 
                                alt={thumb.namaKegiatan} 
                                onClick={() => {
                                   const newIndex = kegiatanList.findIndex(k => k.idKegiatan === thumb.idKegiatan);
                                   if (newIndex !== -1) setCurrentIndex(newIndex);
                                }}
                            />
                          </div>
                      ))}
                  </div>
                )}
            </div>
            
             {/* Decoration Background Abstract */}
             <div className="absolute right-0 top-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[800px] bg-[#6aba68] opacity-50 rounded-l-full blur-3xl translate-x-1/2 -translate-y-1/2 hidden md:block pointer-events-none"></div>
             <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-[#9ade97] opacity-40 rounded-r-full blur-3xl -translate-x-1/2 translate-y-1/4 hidden md:block pointer-events-none"></div>
        </div>
    );
};

export default GallerySection;

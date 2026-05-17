import HeroGirl from '@/assets/images/Bg-Hero.png';

export default function Card2() {
    return (
        // KONTEN UTAMA: Menggunakan gradasi hijau yang berbeda untuk variasi
        <div className="w-full h-full bg-gradient-to-r from-[#266E0F] via-[#4BAF3A] to-[#C6FFD1] overflow-hidden relative flex items-center">
            <div className="container mx-auto px-6 md:px-10 flex justify-between items-center h-full">

                {/* BAGIAN TEKS (Z-Index 20 agar di atas gambar) */}
                <div className="flex flex-col gap-2 sm:gap-3 md:gap-6 text-white max-w-[70%] md:max-w-[800px] text-left items-start z-20">
                    <h1 className="text-xl sm:text-2xl md:text-5xl lg:text-7xl font-bold leading-tight">
                        <span className="block">KULIT SEHAT</span>
                        <span className="block">PERCAYA DIRI NAIK</span>
                    </h1>

                    {/* LABEL HIJAU TRANSARAN */}
                    <p className="max-w-[90%] sm:max-w-[80%] md:max-w-[500px] bg-[#85C583] px-3 py-1.5 md:px-6 md:py-3 text-white font-regular text-[10px] sm:text-xs md:text-lg lg:text-[28px] shadow-lg leading-snug break-words">
                        Perawatan yang aman dan profesional
                    </p>

                    <button className="w-fit whitespace-nowrap bg-[#85C583] px-3 py-1.5 md:px-6 md:py-3 rounded-full text-[12px] sm:text-sm md:text-lg lg:text-[26px] font-regular hover:bg-[#2da509] transition duration-300 shadow-lg mt-1 md:mt-2">
                        Lihat Promo
                    </button>
                </div>

                {/* BAGIAN GAMBAR (Posisi Absolute) */}
                {/* w-[40%] di Mobile menjaga agar gambar tidak terlalu besar */}
                {/* -translate-x-4 geser dikit di HP, md:-translate-x-20 geser banyak di Laptop agar tidak kena Gradasi Gelap */}
                <div className="absolute right-0 bottom-0 h-full w-[40%] md:w-[50%] flex items-end justify-end z-10 transform -translate-x-4 md:-translate-x-20 lg:-translate-x-40">
                    <img
                        src={HeroGirl}
                        alt="slide2"
                        className="max-h-[85%] md:h-[85%] w-auto object-contain object-bottom drop-shadow-2xl"
                    />
                </div>
            </div>

            {/* INDIKATOR SLIDE (Garis ke-2 menyala) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                <div className="w-10 h-1.5 bg-white/30 rounded-full"></div>
                <div className="w-10 h-1.5 bg-white rounded-full"></div> {/* Status Aktif (Slide 2) */}
                <div className="w-10 h-1.5 bg-white/30 rounded-full"></div>
            </div>
        </div>
    );
}

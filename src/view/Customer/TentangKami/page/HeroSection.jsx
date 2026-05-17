import React from 'react';
import TeamMische from '@/assets/images/TeamMische.png';
import Logo_Mische from '@/assets/images/Logo_Mische.png';

const HeroSection = () => {
    return (
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
    );
};

export default HeroSection;

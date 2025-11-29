import HeroGirl from "../../../assets/Bg-Hero.png";

export default function Card1() {
    return (
        <div className="w-full h-full bg-gradient-to-r from-[#266E0F] via-[#4BAF3A] to-[#C6FFD1]">
            <div className="container mx-auto h-full flex items-center justify-between px-10">


                {/* TEXT */}
                <div className="flex flex-col gap-6 text-white max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        THE FIRST ACNE EXPERT <br /> IN TOWN
                    </h1>

                    <p className="bg-white/20 px-6 py-3 rounded-xl backdrop-blur-sm max-w-md text-white font-semibold">
                        Atasi Berbagai Masalah Kulit Dan Wajah
                    </p>

                    <button className="bg-[#85C583] px-8 py-3 rounded-full text-lg">
                        Reservasi Sekarang
                    </button>
                </div>

                {/* IMAGE */}
                <img
                    src={HeroGirl}
                    alt="slide1"
                    className="h-full object-contain drop-shadow-xl"
                />
            </div>
        </div>
    );
}

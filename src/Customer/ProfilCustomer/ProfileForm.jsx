import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const ProfileForm = () => {
    return (
        <div className="w-full">
            {/* ========================================================== */}
            {/* MOBILE VERSION (Sudah Pas) */}
            {/* ========================================================== */}
            <div className="flex md:hidden flex-col items-center bg-white rounded-[40px] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.04)] border border-gray-100 gap-8">
                {/* Profile Picture at Top and Centered */}
                <div className="flex flex-col items-center justify-center pt-4">
                    <div className="relative w-44 h-44 aspect-square mb-6">
                        <div className="w-full h-full rounded-full bg-[#d0eef2] p-1 shadow-2xl border-4 border-white overflow-hidden flex items-center justify-center">
                            <img
                                src="/src/assets/ProfilCustomer.png"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <button className="w-full max-w-[200px] bg-white border-2 border-gray-100 text-gray-500 font-extrabold text-base py-3 rounded-2xl shadow-sm">
                        Pilih Gambar
                    </button>
                </div>

                {/* Form Below */}
                <div className="w-full flex flex-col gap-6">
                    {[
                        { label: 'Nama', type: 'text', val: 'Bintang Puspita' },
                        { label: 'Alamat', type: 'text', val: 'Jl. Mangkubumi' },
                        { label: 'Nomor WhatsApp', type: 'text', val: '0821-8765-0987' },
                        { label: 'Email', type: 'email', val: 'bintang@gmail.com' },
                    ].map((item, idx) => (
                        <div key={idx} className="grid grid-cols-[80px_15px_1fr] items-center">
                            <label className="text-gray-800 font-extrabold text-sm">{item.label}</label>
                            <span className="text-gray-800 font-extrabold">:</span>
                            <input type={item.type} defaultValue={item.val} className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-gray-700 text-sm shadow-sm focus:outline-none" />
                        </div>
                    ))}

                    <div className="grid grid-cols-[80px_15px_1fr] items-center">
                        <label className="text-gray-800 font-extrabold text-sm">Tgl Lahir</label>
                        <span className="text-gray-800 font-extrabold">:</span>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none appearance-none"
                            />
                        </div>
                    </div>

                    <div className="w-full mt-4">
                        <button className="w-full bg-[#74b35e] text-white font-extrabold py-3 rounded-2xl shadow-lg">Simpan</button>
                    </div>
                </div>
            </div>

            {/* ========================================================== */}
            {/* DESKTOP VERSION (Custom Agresif) */}
            {/* ========================================================== */}
            <div className="hidden md:flex flex-row bg-white rounded-[40px] p-12 lg:p-16 shadow-[0_10px_50px_rgba(0,0,0,0.04)] border border-gray-100 gap-4 lg:gap-8 items-start justify-between overflow-hidden">

                {/* Left side: Form Inputs (Expanded to the Right) */}
                <div className="flex-1 flex flex-col gap-7 w-full">
                    <div className="flex flex-col gap-6">
                        {/* Nama */}
                        <div className="grid grid-cols-[180px_35px_1fr] items-center">
                            <label className="text-gray-800 font-extrabold text-xl">Nama</label>
                            <span className="text-gray-800 font-extrabold text-xl text-right pr-4">:</span>
                            <input type="text" defaultValue="Bintang Puspita" className="bg-white border border-gray-100 rounded-2xl px-7 py-4 text-gray-700 font-medium shadow-[0_5px_15px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#74b35e] transition-all" />
                        </div>

                        {/* Alamat */}
                        <div className="grid grid-cols-[180px_35px_1fr] items-center">
                            <label className="text-gray-800 font-extrabold text-xl">Alamat</label>
                            <span className="text-gray-800 font-extrabold text-xl text-right pr-4">:</span>
                            <input type="text" defaultValue="Jl. Mangkubumi" className="bg-white border border-gray-100 rounded-2xl px-7 py-4 text-gray-700 font-medium shadow-[0_5px_15px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#74b35e] transition-all" />
                        </div>

                        {/* Tanggal Lahir */}
                        <div className="grid grid-cols-[180px_35px_1fr] items-center">
                            <label className="text-gray-800 font-extrabold text-xl">Tanggal Lahir</label>
                            <span className="text-gray-800 font-extrabold text-xl text-right pr-4">:</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full bg-white border border-gray-100 rounded-2xl px-7 py-4 text-gray-700 font-medium shadow-[0_5px_15px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#74b35e] transition-all appearance-none"
                                />

                            </div>
                        </div>

                        {/* Jenis Kelamin */}
                        <div className="grid grid-cols-[180px_35px_1fr] items-center">
                            <label className="text-gray-800 font-extrabold text-xl">Jenis Kelamin</label>
                            <span className="text-gray-800 font-extrabold text-xl text-right pr-4">:</span>
                            <div className="relative">
                                <select className="w-full bg-white border border-gray-100 rounded-2xl px-7 py-4 text-gray-700 font-medium shadow-[0_5px_15px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#74b35e] transition-all appearance-none cursor-pointer">
                                    <option>Perempuan</option>
                                    <option>Laki-laki</option>
                                </select>

                            </div>
                        </div>

                        {/* Nomor WhatsApp */}
                        <div className="grid grid-cols-[180px_35px_1fr] items-center">
                            <label className="text-gray-800 font-extrabold text-xl">Nomor WhatsApp</label>
                            <span className="text-gray-800 font-extrabold text-xl text-right pr-4">:</span>
                            <input type="text" defaultValue="0821-8765-0987" className="bg-white border border-gray-100 rounded-2xl px-7 py-4 text-gray-700 font-medium shadow-[0_5px_15px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#74b35e] transition-all" />
                        </div>

                        {/* Email */}
                        <div className="grid grid-cols-[180px_35px_1fr] items-center">
                            <label className="text-gray-800 font-extrabold text-xl">Email</label>
                            <span className="text-gray-800 font-extrabold text-xl text-right pr-4">:</span>
                            <input type="email" defaultValue="bintang@gmail.com" className="bg-white border border-gray-100 rounded-2xl px-7 py-3 text-[#3a7c36] underline font-bold shadow-[0_5px_15px_rgba(0,0,0,0.05)] focus:outline-none" />
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-[180px_35px_1fr] items-center">
                            <label className="text-gray-800 font-extrabold text-xl">Password</label>
                            <span className="text-gray-800 font-extrabold text-xl text-right pr-4">:</span>
                            <input type="password" defaultValue="*****" className="bg-white border border-gray-100 rounded-2xl px-7 py-4 text-gray-700 font-medium shadow-[0_5px_15_rgba(0,0,0,0.05)] focus:outline-none" />
                        </div>

                        {/* Konfirmasi Password */}
                        <div className="grid grid-cols-[180px_35px_1fr] items-center">
                            <label className="text-gray-800 font-extrabold text-xl">Konfirmasi Password</label>
                            <span className="text-gray-800 font-extrabold text-xl text-right pr-4">:</span>
                            <input type="password" defaultValue="*****" className="bg-white border border-gray-100 rounded-2xl px-7 py-4 text-gray-700 font-medium shadow-[0_5px_15px_rgba(0,0,0,0.05)] focus:outline-none" />
                        </div>
                    </div>

                    <div className="w-full mt-6">
                        <button className="w-full bg-[#74b35e] hover:bg-[#64a14e] text-white font-extrabold text-xl py-5 rounded-3xl shadow-[0_10px_25px_rgba(116,179,94,0.3)] active:scale-[0.98] transition-all">
                            Simpan
                        </button>
                    </div>
                </div>

                {/* Right side: Profile Picture (Pushed to Corner, Tight Gap with Form) */}
                <div className="w-[280px] lg:w-[320px] flex flex-col items-center justify-start pt-10 shrink-0">
                    <div className="relative w-33 h-33 lg:w-64 lg:h-64 aspect-square mb-10 shrink-0">
                        <div className="w-full h-full rounded-full bg-[#d0eef2] p-1 shadow-2xl border-4 border-white overflow-hidden flex items-center justify-center">
                            <img src="/src/assets/ProfilCustomer.png" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <button className="w-full max-w-[250px] bg-white border-2 border-gray-100 text-gray-500 font-extrabold text-lg py-4 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors">
                        Pilih Gambar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;

import React from "react";
import { X } from "lucide-react";

export default function ModalPerbaruiUser({ isOpen, onClose, userData }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[900px] rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* HEADER MODAL */}
        <div className="px-10 py-8 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Perbarui User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* FORM BODY */}
        <div className="px-10 py-8">
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-10">
            
            {/* Nama User */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Nama user</label>
              <input 
                type="text" 
                defaultValue={userData?.nama}
                placeholder="Nama user" 
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Email</label>
              <input 
                type="email" 
                defaultValue={userData?.email}
                placeholder="Email" 
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Jenis Kelamin */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Jenis Kelamin</label>
              <select defaultValue={userData?.gender} className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-700 font-medium">
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </div>

            {/* Alamat */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Alamat</label>
              <input 
                type="text" 
                defaultValue={userData?.alamat}
                placeholder="Alamat" 
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Role</label>
              <select defaultValue={userData?.role} className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-700 font-medium">
                <option>Admin</option>
                <option>Staff</option>
                <option>Customer</option>
              </select>
            </div>

            {/* Tanggal Lahir */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Tanggal Lahir</label>
              <input 
                type="date" 
                defaultValue={userData?.birth?.split('/').reverse().join('-')}
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all text-gray-700"
              />
            </div>

            {/* Nomor Whatsapp */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-bold text-[#1A1A1A]">Nomor Whatsapp</label>
              <input 
                type="text" 
                defaultValue={userData?.whatsapp}
                placeholder="Nomor Whatsapp" 
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7CC052] outline-none transition-all placeholder:text-gray-300"
              />
            </div>

          </div>

          {/* FOOTER ACTION */}
          <div className="flex justify-end pt-8 border-t border-gray-100">
            <button className="bg-[#7CC052] text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-[#68a741] transition-all shadow-lg shadow-green-100">
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

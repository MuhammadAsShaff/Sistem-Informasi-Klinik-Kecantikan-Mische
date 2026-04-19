import React from "react";
import { PencilLine, Trash2 } from "lucide-react";

export default function Tabel({ data, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-[#F9FAFB]/50">
              <th className="px-3 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider text-center">No</th>
              <th className="px-3 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider">Nama</th>
              <th className="px-3 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider">Alamat</th>
              <th className="px-3 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider">Jenis Kelamin</th>
              <th className="px-3 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider">Tanggal Lahir</th>
              <th className="px-3 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider text-center">Role</th>
              <th className="px-3 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-3 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider">Nomor Whatsapp</th>
              <th className="px-3 py-4 text-[11px] font-bold text-black uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-3.5 text-xs font-medium text-gray-500 text-center">{index + 1}</td>
                <td className="px-3 py-3.5 text-xs font-bold text-[#1A1A1A] whitespace-nowrap">{user.nama}</td>
                <td className="px-3 py-3.5 text-xs text-gray-500 font-medium max-w-[150px] truncate">{user.alamat}</td>
                <td className="px-3 py-3.5 text-xs text-gray-500 font-medium text-center">{user.gender}</td>
                <td className="px-3 py-3.5 text-xs text-gray-500 font-medium whitespace-nowrap">{user.birth}</td>
                <td className="px-3 py-3.5 text-xs font-bold text-center">
                  <span className={`px-2 py-1 rounded-md ${
                    user.role === 'Admin' ? 'bg-orange-50 text-orange-600' : 
                    user.role === 'Staff' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-3 py-3.5 text-xs text-gray-500 font-medium">{user.email}</td>
                <td className="px-3 py-3.5 text-xs text-gray-500 font-medium whitespace-nowrap">{user.whatsapp}</td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center justify-center gap-3">
                    <button 
                      onClick={() => onEdit(user)}
                      className="text-gray-400 hover:text-[#56BC36] transition-colors"
                    >
                      <PencilLine size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(user)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

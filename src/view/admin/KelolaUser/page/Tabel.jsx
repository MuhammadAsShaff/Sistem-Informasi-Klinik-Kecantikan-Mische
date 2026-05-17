import React from "react";
import { PencilLine, Trash2 } from "lucide-react";

export default function Tabel({ data, onEdit, onDelete, startIndex = 1 }) {
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
            {data && data.length > 0 ? (
              data.map((user, index) => (
                <tr key={user.idUser || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3.5 text-xs font-medium text-gray-500 text-center">{startIndex + index}</td>
                  {/* Membaca field 'nama' atau 'name' dari database */}
                  <td className="px-3 py-3.5 text-xs font-bold text-[#1A1A1A] whitespace-nowrap">{user.nama || user.name || "-"}</td>
                  
                  {/* Membaca field 'alamat' dari database */}
                  <td className="px-3 py-3.5 text-xs text-gray-500 font-medium max-w-[150px] truncate">{user.alamat || "-"}</td>
                  
                  {/* Membaca field 'jenisKelamin' dari JSON Laravel */}
                  <td className="px-3 py-3.5 text-xs text-gray-500 font-medium text-center">{user.jenisKelamin || user.gender || user.jenis_kelamin || "-"}</td>
                  
                  {/* Membaca field 'tanggalLahir' dari JSON Laravel */}
                  <td className="px-3 py-3.5 text-xs text-gray-500 font-medium whitespace-nowrap">{user.tanggalLahir || user.birth || user.tanggal_lahir || "-"}</td>
                  
                  {/* Menyesuaikan huruf besar/kecil dari role */}
                  <td className="px-3 py-3.5 text-xs font-bold text-center">
                    <span className={`px-2 py-1 rounded-md capitalize ${
                      (user.role || '').toLowerCase() === 'admin' ? 'bg-orange-50 text-orange-600' : 
                      (user.role || '').toLowerCase() === 'staff' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
                    }`}>
                      {user.role || "-"}
                    </span>
                  </td>
                  
                  <td className="px-3 py-3.5 text-xs text-gray-500 font-medium">{user.email || "-"}</td>
                  
                  {/* Membaca field 'nomorWa' dari JSON Laravel */}
                  <td className="px-3 py-3.5 text-xs text-gray-500 font-medium whitespace-nowrap">{user.nomorWa || user.whatsapp || user.nomor_whatsapp || user.no_wa || "-"}</td>
                  
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
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-10 text-gray-500 font-medium">Belum ada data user.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

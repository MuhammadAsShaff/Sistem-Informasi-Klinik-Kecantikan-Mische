import React, { useState } from "react";
import { PencilLine, Trash2, ChevronDown } from "lucide-react";
import { STORAGE_BASE_URL } from "@/core/api/endpoints";

export default function Tabel({ data, onEdit, onDelete, onStatusChange, startIndex = 1 }) {
  const handleStatusSelect = (id, newStatus) => {
    onStatusChange(id, newStatus);
  };

  return (
    <div className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm mb-6">
      <div className="overflow-x-auto no-scrollbar w-full">
        <table className="w-full text-left border-collapse min-w-[800px] sm:min-w-0">
          <thead>
            <tr className="border-b border-gray-100 bg-[#F9FAFB]/50">
              <th className="px-5 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider text-center w-12">No</th>
              <th className="px-5 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider">Nama</th>
              <th className="px-5 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider text-center w-24">Foto</th>
              <th className="px-5 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-5 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider max-w-xs">Deskripsi</th>
              <th className="px-5 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider text-center w-36">Status</th>
              <th className="px-5 py-4 text-[11px] font-bold text-black uppercase tracking-wider text-center w-28">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data && data.length > 0 ? (
              data.map((dokter, index) => {
                const isAvailable = (dokter.status || "Tersedia") === "Tersedia";
                const docEmail = dokter.email || "-";
                const docId = dokter.idDokter || dokter.id;

                // Konstruksi URL gambar secara absolut
                const imageUrl = dokter.foto && !dokter.foto.startsWith('http') 
                  ? `${STORAGE_BASE_URL}${dokter.foto}` 
                  : (dokter.foto || "https://via.placeholder.com/150");

                return (
                  <tr key={docId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-xs font-medium text-gray-500 text-center">
                      {startIndex + index}
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-[#1A1A1A] whitespace-nowrap">
                      {dokter.nama}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm mx-auto bg-gray-50">
                        <img 
                          src={imageUrl} 
                          alt={dokter.nama} 
                          className="w-full h-full object-cover object-top" 
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 font-medium">
                      {docEmail}
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 font-medium max-w-xs truncate">
                      {dokter.deskripsi || "-"}
                    </td>
                    <td className="px-5 py-4 text-center relative">
                      <select
                        value={dokter.status || "Tersedia"}
                        onChange={(e) => handleStatusSelect(docId, e.target.value)}
                        className={`appearance-none inline-flex items-center gap-1.5 pl-4 pr-10 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer focus:outline-none focus:ring-0 ${
                          isAvailable
                            ? "bg-green-50 text-[#56BC36] border-[#56BC36]/30 hover:bg-green-100"
                            : "bg-red-50 text-red-500 border-red-500/30 hover:bg-red-100"
                        }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${isAvailable ? '%2356BC36' : '%23ef4444'}' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.6rem center',
                          backgroundSize: '14px 14px',
                        }}
                      >
                        <option value="Tersedia" className="text-black font-semibold">Tersedia</option>
                        <option value="Tidak Tersedia" className="text-black font-semibold">Tidak Tersedia</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => onEdit(dokter)}
                          className="text-gray-400 hover:text-[#56BC36] transition-colors cursor-pointer"
                        >
                          <PencilLine size={18} />
                        </button>
                        <button 
                          onClick={() => onDelete(dokter)}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-12 text-gray-500 font-medium">
                  Belum ada data dokter terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

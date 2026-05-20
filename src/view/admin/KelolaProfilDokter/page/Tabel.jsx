import React, { useState } from "react";
import { PencilLine, Trash2, ChevronDown } from "lucide-react";

export default function Tabel({ data, onEdit, onDelete, onStatusChange, startIndex = 1 }) {
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  const toggleDropdown = (id) => {
    if (activeDropdownId === id) {
      setActiveDropdownId(null);
    } else {
      setActiveDropdownId(id);
    }
  };

  const handleStatusSelect = (id, newStatus) => {
    onStatusChange(id, newStatus);
    setActiveDropdownId(null);
  };

  return (
    <div className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm mb-6">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
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
                const docEmail = dokter.email || `${dokter.name.toLowerCase().replace("dr. ", "").replace(/ /g, "")}@gmail.com`;

                return (
                  <tr key={dokter.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-xs font-medium text-gray-500 text-center">
                      {startIndex + index}
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-[#1A1A1A] whitespace-nowrap">
                      {dokter.name}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm mx-auto bg-gray-50">
                        <img 
                          src={dokter.image} 
                          alt={dokter.name} 
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
                      {dokter.description || "-"}
                    </td>
                    <td className="px-5 py-4 text-center relative">
                      <button
                        onClick={() => toggleDropdown(dokter.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                          isAvailable
                            ? "bg-green-50 text-[#56BC36] border-[#56BC36]/30 hover:bg-green-100"
                            : "bg-red-50 text-red-500 border-red-500/30 hover:bg-red-100"
                        }`}
                      >
                        {dokter.status || "Tersedia"}
                        <ChevronDown size={12} className="opacity-80" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeDropdownId === dokter.id && (
                        <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-30 animate-in fade-in duration-100">
                          <button
                            onClick={() => handleStatusSelect(dokter.id, "Tersedia")}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#56BC36] font-semibold hover:bg-green-50/50"
                          >
                            Tersedia
                          </button>
                          <button
                            onClick={() => handleStatusSelect(dokter.id, "Tidak Tersedia")}
                            className="w-full text-left px-3 py-1.5 text-xs text-red-500 font-semibold hover:bg-red-50/50"
                          >
                            Tidak Tersedia
                          </button>
                        </div>
                      )}
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

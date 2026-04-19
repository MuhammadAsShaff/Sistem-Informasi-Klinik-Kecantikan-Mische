import React from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

const JadwalTable = () => {
  // Data dummy untuk sementara
  const data = Array(10).fill({ id: 1, jamMulai: '', jamSelesai: '' });

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-100">
      {/* Search & Add Section */}
      <div className="flex justify-end items-center p-6 gap-3">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Cari..." 
            className="pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#56BC36] w-64"
          />
        </div>
        <button className="bg-[#56BC36] p-2 rounded-md text-white hover:bg-[#4aa52e]">
          <Search size={20} />
        </button>
        <button className="bg-[#56BC36] p-2 rounded-md text-white hover:bg-[#4aa52e]">
          <Plus size={20} />
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#FDFDFD] text-gray-500 font-semibold border-b border-gray-100 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 text-center text-xs">No</th>
              <th className="px-6 py-4 text-center text-xs">Jam Mulai</th>
              <th className="px-6 py-4 text-center text-xs">Jam Selesai</th>
              <th className="px-6 py-4 text-center text-xs">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-1 text-center">{index + 1}</td>
                <td className="px-6 py-1 h-12 text-center">{item.jamMulai}</td>
                <td className="px-6 py-1 text-center">{item.jamSelesai}</td>
                <td className="px-6 py-1 text-center">
                  <div className="flex justify-center gap-4">
                    <button className="text-gray-600 hover:text-blue-600 transition-colors">
                      <Edit size={22} />
                    </button>
                    <button className="text-gray-600 hover:text-red-600 transition-colors">
                      <Trash2 size={24} />
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
};

export default JadwalTable;

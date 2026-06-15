import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const Tabel = ({ data, onEdit, onDelete, currentPage = 1, itemsPerPage = 6 }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <table className="w-full text-sm text-left">
      <thead className="bg-[#FDFDFD] text-gray-600 border-b text-[11px]">
        <tr>
          <th className="px-6 py-4 font-medium text-center">No</th>
          <th className="px-6 py-4 font-medium text-center">Jam Mulai</th>
          <th className="px-6 py-4 font-medium text-center">Jam Selesai</th>
          <th className="px-6 py-4 font-bold text-center">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50 text-gray-700">
        {data.map((item, index) => (
          <tr key={index} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
            <td className="px-6 py-4 text-center h-16">{item.jamMulai ? item.jamMulai.substring(0,5) : ''}</td>
            <td className="px-6 py-4 text-center">{item.jamSelesai ? item.jamSelesai.substring(0,5) : ''}</td>
            <td className="px-6 py-4">
              <div className="flex justify-center gap-6">
                <button 
                  onClick={() => onEdit(item)} 
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Edit size={20}/>
                </button>
                <button 
                  onClick={() => onDelete(item)} 
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20}/>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Tabel;

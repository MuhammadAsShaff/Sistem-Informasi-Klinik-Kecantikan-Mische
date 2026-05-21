import React from 'react';
import { Edit, Trash2, Send, Eye } from 'lucide-react';

export default function Tabel({ events, onEdit, onDelete, onSend, onView }) {
  // Format Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="bg-white border border-gray-200 overflow-hidden text-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-[#FAFAFA]">
            <th className="py-4 px-6 text-center w-16">No</th>
            <th className="py-4 px-6">Nama</th>
            
            <th className="py-4 px-6">Tanggal Mulai</th>
            <th className="py-4 px-6">Tanggal Selesai</th>
            <th className="py-4 px-6">Lokasi</th>
            <th className="py-4 px-6 text-center w-32">Action</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event, index) => (
              <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-center text-gray-500">{index + 1}</td>
                <td className="py-4 px-6 font-medium text-gray-800">{event.nama}</td>
               
                <td className="py-4 px-6 text-gray-500">{formatDate(event.tanggalMulai)}</td>
                <td className="py-4 px-6 text-gray-500">{formatDate(event.tanggalSelesai)}</td>
                <td className="py-4 px-6 text-gray-500">{event.lokasi}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={() => onView(event)} className="text-gray-500 hover:text-[#56BC36] transition-colors" title="Lihat Detail">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => onEdit(event)} className="text-gray-500 hover:text-blue-600 transition-colors" title="Edit Event">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => onDelete(event)} className="text-gray-500 hover:text-red-600 transition-colors" title="Hapus Event">
                      <Trash2 size={18} />
                    </button>
                    <button onClick={() => onSend(event)} className="text-gray-500 hover:text-green-600 transition-colors" title="Kirim Notifikasi">
                      <Send size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-10 text-center text-gray-500">
                Tidak ada data event.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

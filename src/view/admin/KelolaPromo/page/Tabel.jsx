import React, { useState } from "react";
import { PencilLine, Trash2, Send, Eye } from "lucide-react";
import { STORAGE_BASE_URL } from "@/core/api/endpoints";

export default function Tabel({ data, onEdit, onDelete, onDetail, onSend, updateStatus }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-white text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-4 px-4 font-medium whitespace-nowrap">No</th>
                <th className="py-4 px-4 font-medium whitespace-nowrap">Nama</th>
                <th className="py-4 px-4 font-medium whitespace-nowrap">Gambar</th>
                <th className="py-4 px-4 font-medium whitespace-nowrap">Kode Promo</th>
                <th className="py-4 px-4 font-medium whitespace-nowrap">Diskon</th>
                <th className="py-4 px-4 font-medium whitespace-nowrap">Minimal Transaksi</th>
                <th className="py-4 px-4 font-medium whitespace-nowrap">Status</th>
                <th className="py-4 px-4 font-bold whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors whitespace-nowrap">
                    <td className="py-4 px-4 align-top">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-4 px-4 align-top min-w-[150px] max-w-[200px] truncate" title={item.namaPromo || item.nama}>
                      {item.namaPromo || item.nama}
                    </td>
                    <td className="py-4 px-4 align-top text-center">
                      {item.gambar ? (
                        <img 
                          src={item.gambar.startsWith('http') ? item.gambar : `${STORAGE_BASE_URL}${item.gambar}`} 
                          alt="Promo" 
                          className="w-16 h-16 object-cover rounded-md mx-auto shadow-sm" 
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-md mx-auto flex items-center justify-center text-xs text-gray-400">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 align-top font-medium text-gray-800">{item.kode}</td>
                    <td className="py-4 px-4 align-top">{item.diskon}</td>
                    <td className="py-4 px-4 align-top">
                      {item.minimalTransaksi ? `Rp ${Number(item.minimalTransaksi).toLocaleString("id-ID")}` : "-"}
                    </td>
                    <td className="py-4 px-4 align-top">
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className={`text-sm bg-transparent font-semibold border-none cursor-pointer focus:outline-none focus:ring-0 ${
                          item.status === "Aktif" ? "text-[#56BC36]" : "text-red-500"
                        }`}
                      >
                        <option value="Aktif" className="text-black">Aktif</option>
                        <option value="Tidak Aktif" className="text-black">Tidak Aktif</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => onDetail(item)}
                          className="text-gray-600 hover:text-indigo-600 transition-colors"
                          title="Lihat Detail Promo"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onEdit(item)}
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                          title="Perbarui Promo"
                        >
                          <PencilLine size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="text-gray-600 hover:text-red-600 transition-colors"
                          title="Hapus Promo"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={() => onSend(item)}
                          className="text-gray-600 hover:text-green-600 transition-colors"
                          title="Kirim Info Promo"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-gray-500">
                    Tidak ada data promo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span className="text-lg">←</span> Previous
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                  currentPage === i + 1
                    ? "bg-[#56BC36] text-white font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next <span className="text-lg">→</span>
          </button>
        </div>
      )}
    </div>
  );
}

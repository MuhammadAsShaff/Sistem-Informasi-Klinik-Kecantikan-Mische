import React from "react";

/**
 * Global Table Component
 * 
 * @param {Array} columns - Array of objects defining the columns: { key, label, render, className, cellClassName }
 * @param {Array} data - Array of data objects
 * @param {String} emptyStateText - Text to show when data is empty
 * @param {Number} startIndex - For continuous numbering across pagination
 */
export default function Table({ 
  columns, 
  data, 
  emptyStateText = "Tidak ada data.",
  startIndex = 1,
  isLoading = false
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500 font-bold bg-white rounded-xl shadow-sm border border-gray-100">
        Mengambil data dari server...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 bg-[#FAFAFA]">
              {columns.map((col, idx) => (
                <th key={idx} className={`py-4 px-6 font-medium whitespace-nowrap ${col.className || ''}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data && data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr key={`${item.idPenjualan || item.idKategori || item.idProduk || item.idEvent || item.idTestimoni || item.id || item._id || item.idUser || 'row'}-${rowIndex}`} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`py-4 px-6 ${col.cellClassName || ''}`}>
                      {col.render ? col.render(item, rowIndex + startIndex) : item[col.key] || '-'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-gray-500 font-medium">
                  {emptyStateText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';

const Tabel = ({ data, onEdit, onDelete }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden mb-6 w-full font-poppins rounded">
        <div className="overflow-x-auto no-scrollbar w-full">
          <table className="w-full text-[13px] text-left">
            <thead className="bg-white text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium whitespace-nowrap text-center">No</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap text-center">Foto</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap text-center">Nama</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap text-center">Tanggal</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap text-center">Deskripsi</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap text-center">Jenis Testimoni</th>
                <th className="py-4 px-4 font-bold whitespace-nowrap text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors whitespace-nowrap">
                    <td className="px-6 py-4 text-center">{index + 1}</td>
                    <td className="px-6 py-4 flex justify-center">
                      {item.foto ? (
                        <img src={item.foto} alt="Testimoni" className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-black max-w-[200px] truncate" title={item.nama}>{item.nama}</td>
                    <td className="px-6 py-4 text-center">{item.tanggal}</td>
                    <td className="px-6 py-4 text-center max-w-[200px] truncate" title={item.deskripsi}>{item.deskripsi}</td>
                    <td className="px-6 py-4 text-center">{item.jenis}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3 items-center">
                        <button
                          onClick={() => onEdit(item)}
                          className="text-gray-500 hover:text-black transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="text-gray-500 hover:text-black transition-colors"
                          title="Hapus"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  {[...Array(6)].map((_, index) => (
                    <tr key={index} className="h-16">
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3 items-center opacity-50">
                          <button disabled className="text-gray-500 cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                          </button>
                          <button disabled className="text-gray-500 cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tabel;

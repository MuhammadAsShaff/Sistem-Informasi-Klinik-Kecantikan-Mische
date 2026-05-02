import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const Tabel = ({ isLoading, data, meta, page, setPage, onEditStatus, onDelete, onDetail }) => {
  // Pagination helpers
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (meta && page < meta.last_page) setPage(page + 1);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6 w-full font-poppins">
        <div className="overflow-x-auto no-scrollbar w-full">
          <table className="w-full text-[13px] text-left">
            <thead className="bg-white text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Nama Customer</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Kategori Treatment</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Jenis Treatment</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Jam</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Tanggal</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Dokter</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Nomor</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center">Status dan Result</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {data && data.length > 0 ? (
                data.map((item, index) => {

                  // Tentukan warna status untuk button dropdown
                  let statusBg = "bg-gray-100";
                  let statusText = "text-gray-600";
                  let statusIcon = "text-gray-400";

                  if (item.status === 'Konfirmasi' || item.status === 'Dikonfirmasi' || item.status === 'Selesai') {
                    statusBg = "bg-[#56BC36]";
                    statusText = "text-white";
                    statusIcon = "text-white";
                  } else if (item.status === 'Tidak Datang' || item.status === 'Dibatalkan') {
                    statusBg = "bg-[#C43636]"; // Merah tua seperti di desain
                    statusText = "text-white";
                    statusIcon = "text-white";
                  } else if (item.status === 'Datang') {
                    statusBg = "bg-[#65d343]"; // Hijau lebih terang
                    statusText = "text-white";
                    statusIcon = "text-white";
                  } else if (item.status === 'Menunggu') {
                    statusBg = "bg-yellow-500";
                    statusText = "text-white";
                    statusIcon = "text-white";
                  }

                  // Label yang ditampilkan di UI
                  let displayStatus = item.status;
                  if (displayStatus === 'Dikonfirmasi') displayStatus = 'Konfirmasi';

                  return (
                    <tr key={item.idReservasi || item.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-black">{item.namaCustomer}</td>
                      <td className="px-4 py-4">{item.kategoriReservasi || "-"}</td>
                      <td className="px-4 py-4">{item.jenisReservasi}</td>
                      <td className="px-4 py-4">
                        {item.jadwal ? `${item.jadwal.jamMulai.substring(0, 5)} - ${item.jadwal.jamSelesai.substring(0, 5)}` : "-"}
                      </td>
                      <td className="px-4 py-4">{item.tanggalReservasi}</td>
                      <td className="px-4 py-4">{item.dokter?.nama || "-"}</td>
                      <td className="px-4 py-4">{item.nomorWa || item.nomor || "-"}</td>

                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => onEditStatus(item)}
                          className={`inline-flex items-center justify-between w-32 px-3 py-1.5 rounded-full text-xs font-medium ${statusBg} ${statusText} shadow-sm transition-transform active:scale-95 mx-auto`}
                        >
                          <span className="flex-1 text-center">{displayStatus}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`ml-1 ${statusIcon}`}><path d="m6 9 6 6 6-6" /></svg>
                        </button>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-3 items-center">

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
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-gray-500 font-medium">
                    Belum ada data reservasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex w-full justify-between items-center font-poppins px-2">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors shadow-sm ${
            page === 1 ? 'text-gray-500 bg-gray-100 border-gray-300 font-medium cursor-default' : 'text-gray-900 border-gray-400 bg-white hover:bg-gray-100 font-semibold cursor-pointer'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Previous
        </button>

        <div className="flex items-center gap-1">
          <div className="bg-[#97E779] text-black font-semibold w-8 h-8 rounded flex items-center justify-center text-sm shadow-sm">
            {page}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!meta || page >= meta.last_page}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors shadow-sm ${
            (!meta || page >= meta.last_page) ? 'text-gray-500 bg-gray-100 border-gray-300 font-medium cursor-default' : 'text-gray-900 border-gray-400 bg-white hover:bg-gray-100 font-semibold cursor-pointer'
          }`}
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>
    </div>
  );
};

export default Tabel;

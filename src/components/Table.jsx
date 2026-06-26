import React from "react";

/* 
 * KOMPONEN: Table
 * FUNGSI: Komponen utama (pusat) untuk menampilkan data dalam bentuk tabel baris dan kolom.
 *         Dibuat hanya sekali di sini, namun bisa dipanggil dan dipakai oleh semua halaman Admin (Admin User, Produk, dll).
 */
export default function Table({ 
  columns,          // Daftar kolom apa saja yang mau dibuat (seperti Nama, Harga, Aksi)
  data,             // Daftar data dari Database yang akan dimasukkan ke dalam tabel
  emptyStateText = "Tidak ada data.", // Pesan darurat jika datanya kosong
  startIndex = 1,   // Nomor urut awal (berguna agar penomoran tabel tidak terulang dari angka 1 terus saat ganti halaman)
  isLoading = false // Penanda apakah data sedang di-download dari server
}) {
  
  // Jika data masih dalam proses loading, jangan tampilkan tabelnya dulu, melainkan tampilkan tulisan ini:
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
          
          {/* ======================================= */}
          {/* BAGIAN KEPALA TABEL (Judul Kolom / th)  */}
          {/* ======================================= */}
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 bg-[#FAFAFA]">
              {/* Berkeliling (map) membaca pengaturan 'columns' untuk mencetak nama-nama judul kolom */}
              {columns.map((col, idx) => (
                <th key={idx} className={`py-4 px-6 font-medium whitespace-nowrap ${col.className || ''}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* ======================================= */}
          {/* BAGIAN BADAN TABEL (Isi Data / tr & td) */}
          {/* ======================================= */}
          <tbody className="divide-y divide-gray-50">
            {/* Syarat: Jika 'data' itu ada wujudnya dan jumlah isinya lebih besar dari 0, kerjakan yang bawah: */}
            {data && data.length > 0 ? (
              
              // JIKA ADA DATA: Cetak baris per baris ke bawah
              data.map((item, rowIndex) => (
                // Membuat 1 Baris Utama (tr) untuk setiap item
                <tr key={`${item.idPenjualan || item.idKategori || item.idProduk || item.idEvent || item.idTestimoni || item.id || item._id || item.idUser || 'row'}-${rowIndex}`} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Di dalam 1 Baris itu, kita isi sel-sel kolomnya (td) sesuai dengan urutan 'columns' */}
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`py-4 px-6 ${col.cellClassName || ''}`}>
                      {/* Pengecekan cerdas: 
                          Apakah kolom ini butuh kustomisasi HTML tambahan (disebut 'render')?
                          - Jika YA: jalankan 'render' dari halaman pemanggil.
                          - Jika TIDAK: langsung cetak nilainya saja, kalau kosong tampilkan strip '-'. 
                      */}
                      {col.render ? col.render(item, rowIndex + startIndex) : item[col.key] || '-'}
                    </td>
                  ))}
                </tr>
              ))
              
            ) : (
              // JIKA DATA KOSONG: Munculkan 1 baris khusus untuk memberitahu bahwa tabel ini isinya kosong
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

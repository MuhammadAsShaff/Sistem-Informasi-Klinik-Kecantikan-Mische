<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PenjualanExport;
use App\Exports\ReservasiExport;

class ReportController extends Controller
{
    /**
     * exportReportPenjualan
     * 
     * Mengunduh Laporan Rekapitulasi Keuangan Penjualan Produk dalam bentuk file Excel.
     * Memiliki filter opsional berdasarkan rentang tanggal atau produk tertentu.
     * 
     * @response 200 application/octet-stream (Return berupa Binary File, bukan text JSON)
     */
    public function exportReportPenjualan(Request $request): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        // Tangkap parameter filter yang dilempar dari Form Laporan di Frontend
        $filters = $request->only(['idProduk', 'tanggalMulai', 'tanggalSelesai']);
        
        // Buat nama file dinamis sesuai tanggal detik ini di-download
        $filename = 'Laporan_Penjualan_' . date('Y-m-d_H-i-s') . '.xlsx';
        
        // Excel::download adalah fitur dari library 'maatwebsite/excel' yang akan menggenerate kelas PenjualanExport
        return Excel::download(new PenjualanExport($filters), $filename);
    }

    /**
     * exportReportReservasi
     * 
     * Mengunduh Laporan Rekapitulasi Riwayat Kunjungan/Reservasi Pasien Klinik dalam format Excel.
     * Memiliki filter kompleks: Kategori Treatment, Status Reservasi, Rentang Tanggal, dll.
     * 
     * @response 200 application/octet-stream
     */
    public function exportReportReservasi(Request $request): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        // Tangkap parameter filter yang dilempar dari Form Laporan di Frontend
        $filters = $request->only(['kategoriReservasi', 'jenisReservasi', 'status', 'tanggalMulai', 'tanggalSelesai']);
        
        // Buat nama file dinamis
        $filename = 'Laporan_Reservasi_' . date('Y-m-d_H-i-s') . '.xlsx';
        
        // Lemparkan beban query ke class ReservasiExport dan kembalikan wujud jadinya berupa file Excel (.xlsx)
        return Excel::download(new ReservasiExport($filters), $filename);
    }
}

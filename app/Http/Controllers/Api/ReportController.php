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
     * Download Excel Report untuk Penjualan
     * 
     * @response 200 application/octet-stream
     */
    public function exportReportPenjualan(Request $request): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $filters = $request->only(['idProduk', 'idKategori', 'tanggalMulai', 'tanggalSelesai']);
        
        $filename = 'Laporan_Penjualan_' . date('Y-m-d_H-i-s') . '.xlsx';
        
        return Excel::download(new PenjualanExport($filters), $filename);
    }

    /**
     * Download Excel Report untuk Reservasi
     * 
     * @response 200 application/octet-stream
     */
    public function exportReportReservasi(Request $request): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $filters = $request->only(['jenisTreatment', 'status', 'tanggalMulai', 'tanggalSelesai']);
        
        $filename = 'Laporan_Reservasi_' . date('Y-m-d_H-i-s') . '.xlsx';
        
        return Excel::download(new ReservasiExport($filters), $filename);
    }
}

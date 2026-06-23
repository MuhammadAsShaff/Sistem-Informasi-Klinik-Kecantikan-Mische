<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Penjualan;
use App\Models\Reservasi;
use App\Models\DetailPenjualan;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * getDashboardData
     * 
     * Mengambil dan menghitung berbagai metrik statistik untuk ditampilkan pada halaman Dashboard Panel Admin.
     */
    public function getDashboardData()
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // 1. Hitung jumlah pendaftaran customer baru khusus di bulan ini saja
        $newCustomersThisMonth = User::where('role', 'customer')
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();

        // 2. Hitung Total Omzet Penjualan Produk pada bulan ini
        $totalSalesThisMonth = Penjualan::whereMonth('tanggal', $currentMonth)
            ->whereYear('tanggal', $currentYear)
            ->sum('total');

        // 3. Hitung jumlah Customer yang melakukan Reservasi Klinik bulan ini
        $reservationsThisMonth = Reservasi::whereMonth('tanggalReservasi', $currentMonth)
            ->whereYear('tanggalReservasi', $currentYear)
            ->count();

        // 4. Data untuk Line Chart (Grafik) Pertumbuhan Customer dari Bulan 1 s.d 12 (Tahun Ini)
        $customerGrowthData = User::where('role', 'customer')
            ->whereYear('created_at', $currentYear)
            ->get()
            // Mengelompokkan berdasarkan bulan (01, 02, 03, dst)
            ->groupBy(function($date) {
                return Carbon::parse($date->created_at)->format('m');
            })
            // Menghitung jumlah di masing-masing grup bulan tersebut
            ->map(function ($row) {
                return $row->count();
            });

        // 5. Tabel Produk Terlaris (Top 5 Best Seller)
        // Menjumlahkan total qty yang terjual per produk
        $topProducts = DetailPenjualan::select('idProduk', DB::raw('SUM(jumlahProduk) as total_terjual'))
            ->groupBy('idProduk')
            ->orderByDesc('total_terjual') // Urutkan dari yang terbanyak
            ->take(5) // Ambil 5 teratas
            ->with('produk:idProduk,nama,harga,gambar') // Relasi untuk menarik nama dan gambar produk
            ->get();

        // 6. Data untuk Pie Chart Perbandingan Kategori Treatment (Facial vs Laser vs dll)
        $treatmentComparison = Reservasi::select('kategoriReservasi', DB::raw('count(*) as total'))
            ->whereNotNull('kategoriReservasi')
            ->groupBy('kategoriReservasi')
            ->get();

        // 7. Data untuk Line Chart (Grafik) Omzet Penjualan dari Bulan 1 s.d 12 (Tahun Ini)
        $salesGrowthData = Penjualan::whereYear('tanggal', $currentYear)
            ->get()
            ->groupBy(function($date) {
                return Carbon::parse($date->tanggal)->format('m');
            })
            ->map(function ($row) {
                return $row->sum('total'); // Kalau ini bukan di-count, tapi di-SUM (total uangnya)
            });

        // ========================================================
        // FORMATTING DATA GRAFIK AGAR RAPI (BULAN 1 - 12 LENGKAP)
        // ========================================================
        $chartCustomer = [];
        $chartSales = [];
        
        // Loop 12 kali (Bulan 1 sampai Bulan 12)
        for ($i = 1; $i <= 12; $i++) {
            // Tambah angka 0 di depan jika bulan < 10 (Contoh: '01', '02', '11')
            $monthStr = str_pad($i, 2, '0', STR_PAD_LEFT);
            
            // Jika ada datanya ambil, jika kosong di bulan itu, kasih nilai 0
            $chartCustomer[$monthStr] = $customerGrowthData->get($monthStr, 0);
            $chartSales[$monthStr] = $salesGrowthData->get($monthStr, 0);
        }

        // 8. Kirim respon JSON lengkap ke Frontend
        return response()->json([
            'status' => 'success',
            'data' => [
                'summary' => [
                    'new_customers_this_month' => $newCustomersThisMonth,
                    'total_sales_this_month' => $totalSalesThisMonth,
                    'reservations_this_month' => $reservationsThisMonth,
                ],
                'charts' => [
                    'customer_growth_per_month' => $chartCustomer,
                    'sales_growth_per_month' => $chartSales,
                    'treatment_comparison' => $treatmentComparison,
                ],
                'top_products' => $topProducts
            ]
        ], 200);
    }
}

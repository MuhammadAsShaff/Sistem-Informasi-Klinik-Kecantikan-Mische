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
     * Menampilkan data statistik untuk Dashboard Admin
     */
    public function getDashboardData()
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // 1. Jumlah customer pada bulan ini (berdasarkan waktu register)
        $newCustomersThisMonth = User::where('role', 'customer')
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();

        // 2. Total penjualan pada bulan ini
        $totalSalesThisMonth = Penjualan::whereMonth('tanggal', $currentMonth)
            ->whereYear('tanggal', $currentYear)
            ->sum('total');

        // 3. Reservasi pada bulan ini
        $reservationsThisMonth = Reservasi::whereMonth('tanggalReservasi', $currentMonth)
            ->whereYear('tanggalReservasi', $currentYear)
            ->count();

        // 4. Grafik customer per bulan (tahun ini)
        $customerGrowthData = User::where('role', 'customer')
            ->whereYear('created_at', $currentYear)
            ->get()
            ->groupBy(function($date) {
                return Carbon::parse($date->created_at)->format('m');
            })
            ->map(function ($row) {
                return $row->count();
            });

        // 5. Produk terlaris (Join dengan ProdukKlinik)
        $topProducts = DetailPenjualan::select('idProduk', DB::raw('SUM(jumlahProduk) as total_terjual'))
            ->groupBy('idProduk')
            ->orderByDesc('total_terjual')
            ->take(5)
            ->with('produk:idProduk,nama,harga,gambar') // asumsi relasi 'produk' ada di DetailPenjualan
            ->get();

        // 6. Perbandingan reservasi treatment (Pie Chart)
        $treatmentComparison = Reservasi::select('jenisTreatment', DB::raw('count(*) as total'))
            ->whereNotNull('jenisTreatment')
            ->groupBy('jenisTreatment')
            ->get();

        // 7. Grafik penjualan per bulan (tahun ini)
        $salesGrowthData = Penjualan::whereYear('tanggal', $currentYear)
            ->get()
            ->groupBy(function($date) {
                return Carbon::parse($date->tanggal)->format('m');
            })
            ->map(function ($row) {
                return $row->sum('total');
            });

        // Format output array bulan 1-12 agar berurutan untuk grafik
        $chartCustomer = [];
        $chartSales = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthStr = str_pad($i, 2, '0', STR_PAD_LEFT);
            $chartCustomer[$monthStr] = $customerGrowthData->get($monthStr, 0);
            $chartSales[$monthStr] = $salesGrowthData->get($monthStr, 0);
        }

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

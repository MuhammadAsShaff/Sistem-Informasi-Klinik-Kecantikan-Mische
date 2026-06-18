<?php

namespace App\Exports;

use App\Models\DetailPenjualan;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PenjualanExport implements FromArray, WithHeadings, ShouldAutoSize, WithStyles
{
    protected $filters;
    protected $totalRowCounter = 0; // Untuk styling dinamis baris kesimpulan

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function array(): array
    {
        $query = DetailPenjualan::with(['penjualan.user', 'penjualan.alamat', 'penjualan.promo', 'produk']);

        if (!empty($this->filters['idProduk']) && !in_array(strtolower($this->filters['idProduk']), ['semua', 'all', '0', 'semua produk'])) {
            $query->where('idProduk', $this->filters['idProduk']);
        }

        if (!empty($this->filters['tanggalMulai']) && !empty($this->filters['tanggalSelesai'])) {
            $query->whereHas('penjualan', function ($q) {
                $q->whereBetween('tanggal', [
                    $this->filters['tanggalMulai'],
                    $this->filters['tanggalSelesai']
                ]);
            });
        }

        $details = $query->get();

        $rows = [];
        $invoicesPaid = [];
        $totalProdukTerjual = 0;
        $totalDiskonDiberikan = [];

        foreach ($details as $detail) {
            $penjualan = $detail->penjualan;
            if (!$penjualan) continue;

            $user = $penjualan->user;
            $alamat = $penjualan->alamat;
            $promo = $penjualan->promo;
            $produk = $detail->produk;

            // Perhitungan per produk
            $hargaSatuan = $produk->harga ?? 0;
            $subtotalProduk = $detail->jumlahProduk * $hargaSatuan;

            // Info Alamat
            $alamatLengkap = '-';
            if ($alamat) {
                $alamatLengkap = $alamat->detailAlamat . " (Telp: " . $alamat->nomorHp . ")";
            }

            // Info Promo / Diskon (hanya dicatat 1 kali per invoice untuk rekap total)
            $diskon = 0;
            if ($promo) {
                $diskon = $promo->diskon;
                $totalDiskonDiberikan[$penjualan->idPenjualan] = $diskon;
            }

            // Status Lunas?
            $isLunas = (strtolower($penjualan->paymentStatus) === 'paid' || strtolower($penjualan->orderStatus) === 'selesai');
            
            if ($isLunas) {
                $invoicesPaid[$penjualan->idPenjualan] = $penjualan->total;
                $totalProdukTerjual += $detail->jumlahProduk;
            }

            $rows[] = [
                $penjualan->invoiceNumber ?? $penjualan->idPenjualan,
                $penjualan->tanggal ?? '-',
                $user->nama ?? 'Unknown',
                $user->nomorWa ?? '-',
                $alamatLengkap,
                ($penjualan->shippingCourier ?? '-') . ' / ' . ($penjualan->shippingService ?? '-'),
                $penjualan->nomorResi ?? '-',
                $produk->nama ?? '-',
                $detail->jumlahProduk,
                $hargaSatuan,
                $diskon,
                $subtotalProduk,
                $penjualan->total ?? 0,
                $penjualan->paymentStatus ?? '-',
                $penjualan->orderStatus ?? '-'
            ];
        }

        // Catat di mana data berakhir untuk keperluan styling
        $this->totalRowCounter = count($rows) + 1; // +1 untuk Header

        // Agregasi
        $totalTransaksiBerhasil = count($invoicesPaid);
        $totalPendapatanBersih = array_sum($invoicesPaid);
        
        $totalDiskonSum = 0;
        foreach ($invoicesPaid as $idPenjualan => $val) {
            if (isset($totalDiskonDiberikan[$idPenjualan])) {
                $totalDiskonSum += $totalDiskonDiberikan[$idPenjualan];
            }
        }

        // Tambahkan spasi kosong
        $rows[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        $rows[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

        // Tambahkan Header Kesimpulan
        $rows[] = ['KESIMPULAN LAPORAN (Hanya transaksi PAID / SELESAI)', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        
        $rows[] = ['Total Transaksi Berhasil', $totalTransaksiBerhasil . ' Transaksi', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        $rows[] = ['Total Produk Terjual', $totalProdukTerjual . ' Item', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        $rows[] = ['Total Diskon Diberikan', 'Rp ' . number_format($totalDiskonSum, 0, ',', '.'), '', '', '', '', '', '', '', '', '', '', '', '', ''];
        $rows[] = ['Total Pendapatan Bersih', 'Rp ' . number_format($totalPendapatanBersih, 0, ',', '.'), '', '', '', '', '', '', '', '', '', '', '', '', ''];

        return $rows;
    }

    public function headings(): array
    {
        return [
            'Nomor Invoice',
            'Tanggal',
            'Nama Customer',
            'Nomor WA',
            'Alamat Pengiriman',
            'Kurir / Layanan',
            'Nomor Resi',
            'Nama Produk',
            'Qty',
            'Harga Satuan',
            'Diskon Promo',
            'Subtotal Produk',
            'Total Bayar Invoice',
            'Status Bayar',
            'Status Pesanan'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $styles = [
            // Styling untuk baris Header pertama
            1 => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF4F81BD']]
            ],
        ];

        // Hitung baris untuk Kesimpulan
        $summaryStartRow = $this->totalRowCounter + 3;

        // Styling untuk Header Kesimpulan
        $styles[$summaryStartRow] = [
            'font' => ['bold' => true, 'size' => 12],
            'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFF2F2F2']]
        ];

        // Styling untuk value kesimpulan
        $styles[$summaryStartRow + 1] = ['font' => ['bold' => true]];
        $styles[$summaryStartRow + 2] = ['font' => ['bold' => true]];
        $styles[$summaryStartRow + 3] = ['font' => ['bold' => true]];
        $styles[$summaryStartRow + 4] = ['font' => ['bold' => true]];

        return $styles;
    }
}

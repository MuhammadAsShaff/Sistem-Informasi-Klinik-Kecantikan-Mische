<?php

namespace App\Exports;

use App\Models\DetailPenjualan;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PenjualanExport implements FromCollection, WithHeadings, WithMapping
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = DetailPenjualan::with(['penjualan.user', 'produk.kategori']);

        if (!empty($this->filters['idProduk']) && !in_array(strtolower($this->filters['idProduk']), ['semua', 'all', '0', 'semua produk'])) {
            $query->where('idProduk', $this->filters['idProduk']);
        }

        if (!empty($this->filters['idKategori']) && !in_array(strtolower($this->filters['idKategori']), ['semua', 'all', '0', 'semua kategori'])) {
            $query->whereHas('produk', function ($q) {
                $q->where('idKategori', $this->filters['idKategori']);
            });
        }

        if (!empty($this->filters['tanggalMulai']) && !empty($this->filters['tanggalSelesai'])) {
            $query->whereHas('penjualan', function ($q) {
                $q->whereBetween('tanggal', [
                    $this->filters['tanggalMulai'],
                    $this->filters['tanggalSelesai']
                ]);
            });
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID Transaksi',
            'Tanggal',
            'Nama Customer',
            'Kategori Produk',
            'Nama Produk',
            'Jumlah',
            'Harga Satuan',
            'Subtotal',
            'Status Transaksi'
        ];
    }

    public function map($detail): array
    {
        $hargaSatuan = $detail->produk->harga ?? 0;
        $subtotal = $detail->jumlahProduk * $hargaSatuan;

        return [
            $detail->idPenjualan,
            $detail->penjualan->tanggal ?? '-',
            $detail->penjualan->user->nama ?? 'Unknown',
            $detail->produk->kategori->namaKategori ?? '-',
            $detail->produk->nama ?? '-',
            $detail->jumlahProduk,
            $hargaSatuan,
            $subtotal,
            $detail->penjualan->status ?? '-'
        ];
    }
}

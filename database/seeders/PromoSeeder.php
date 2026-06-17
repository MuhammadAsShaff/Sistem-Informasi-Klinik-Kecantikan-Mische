<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Promo;
use App\Models\KategoriProduk;
use App\Models\ProdukKlinik;
use Carbon\Carbon;

class PromoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan kategori & produk ada
        $kategori = KategoriProduk::firstOrCreate([
            'nama' => 'Skincare',
            'deskripsi' => 'Kategori Skincare'
        ]);

        $produk = ProdukKlinik::firstOrCreate([
            'nama' => 'Mische Serum Glow',
            'harga' => 150000,
            'stock' => 100,
            'gambar' => 'default.jpg',
            'deskripsi' => 'Serum untuk kulit bercahaya.',
            'idKategori' => $kategori->idKategori
        ]);

        $promos = [
            [
                'gambar' => 'promo_gajian.jpg',
                'namaPromo' => 'Promo Gajian Skincare',
                'jenisPromo' => 'Diskon Produk',
                'kode' => 'GAJIAN10',
                'diskon' => 10000,
                'deskripsi' => 'Diskon 10 ribu untuk pembelian serum glow.',
                'tanggalMulai' => Carbon::now()->format('Y-m-d'),
                'tanggalSelesai' => Carbon::now()->addDays(5)->format('Y-m-d'),
                'minimalTransaksi' => 100000,
                'status' => true,
                'idKategori' => $kategori->idKategori,
                'idProduk' => null
            ],
            [
                'gambar' => 'promo_new_year.jpg',
                'namaPromo' => 'Promo Tahun Baru',
                'jenisPromo' => 'Diskon Spesial',
                'kode' => 'NEWYEAR20',
                'diskon' => 20000,
                'deskripsi' => 'Diskon 20 ribu menyambut tahun baru.',
                'tanggalMulai' => Carbon::now()->subDays(10)->format('Y-m-d'),
                'tanggalSelesai' => Carbon::now()->subDays(1)->format('Y-m-d'), // Expired
                'minimalTransaksi' => 150000,
                'status' => false,
                'idKategori' => null,
                'idProduk' => $produk->idProduk
            ],
            [
                'gambar' => 'promo_global.jpg',
                'namaPromo' => 'Promo Bebas Belanja',
                'jenisPromo' => 'Diskon Semua',
                'kode' => 'BEBAS10K',
                'diskon' => 10000,
                'deskripsi' => 'Diskon 10 ribu untuk semua produk dan kategori.',
                'tanggalMulai' => Carbon::now()->format('Y-m-d'),
                'tanggalSelesai' => Carbon::now()->addDays(30)->format('Y-m-d'),
                'minimalTransaksi' => 50000,
                'status' => true,
                'idKategori' => null,
                'idProduk' => null
            ]
        ];

        foreach ($promos as $promo) {
            Promo::firstOrCreate(
                ['kode' => $promo['kode']],
                $promo
            );
        }
    }
}

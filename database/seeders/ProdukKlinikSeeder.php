<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProdukKlinik;
use App\Models\KategoriProduk;

class ProdukKlinikSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Pastikan ada kategori dulu untuk direlasikan
        $kategori = KategoriProduk::first();
        if (!$kategori) {
            $kategori = KategoriProduk::create([
                'nama' => 'Kategori Default',
                'deskripsi' => 'Kategori Default'
            ]);
        }

        $produk = [
            [
                'nama' => 'Facial Wash Anti Acne',
                'deskripsi' => 'Sabun cuci muka khusus untuk kulit berjerawat.',
                'harga' => 75000,
                'stock' => 50,
                'gambar' => 'facial_wash.jpg',
                'idKategori' => $kategori->idKategori
            ],
            [
                'nama' => 'Serum Whitening Plus',
                'deskripsi' => 'Serum untuk mencerahkan wajah dengan ekstrak vitamin C.',
                'harga' => 150000,
                'stock' => 30,
                'gambar' => 'serum.jpg',
                'idKategori' => $kategori->idKategori
            ],
            [
                'nama' => 'Night Cream Rejuvenation',
                'deskripsi' => 'Krim malam untuk meremajakan kulit dan mengurangi kerutan.',
                'harga' => 200000,
                'stock' => 20,
                'gambar' => 'night_cream.jpg',
                'idKategori' => $kategori->idKategori
            ],
            [
                'nama' => 'Sunblock SPF 50',
                'deskripsi' => 'Tabir surya dengan perlindungan maksimal SPF 50.',
                'harga' => 90000,
                'stock' => 100,
                'gambar' => 'sunblock.jpg',
                'idKategori' => $kategori->idKategori
            ],
            [
                'nama' => 'Toner Hydrating',
                'deskripsi' => 'Toner pelembap wajah yang menyegarkan.',
                'harga' => 60000,
                'stock' => 75,
                'gambar' => 'toner.jpg',
                'idKategori' => $kategori->idKategori
            ]
        ];

        foreach ($produk as $item) {
            ProdukKlinik::create($item);
        }
    }
}

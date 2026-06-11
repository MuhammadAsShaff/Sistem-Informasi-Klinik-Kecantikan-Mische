<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\KategoriProduk;

class KategoriProdukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $kategori = [
            [
                'nama' => 'Perawatan Wajah',
                'deskripsi' => 'Produk untuk perawatan wajah seperti krim, serum, facial wash, dan toner.'
            ],
            [
                'nama' => 'Perawatan Tubuh',
                'deskripsi' => 'Produk untuk perawatan kulit tubuh seperti body lotion, lulur, dan sabun mandi cair.'
            ],
            [
                'nama' => 'Perawatan Rambut',
                'deskripsi' => 'Produk perawatan rambut seperti shampo, kondisioner, hair tonic, dan serum rambut.'
            ],
            [
                'nama' => 'Suplemen Kulit',
                'deskripsi' => 'Vitamin dan suplemen oral untuk menjaga kesehatan dan kecerahan kulit dari dalam.'
            ],
            [
                'nama' => 'Kosmetik',
                'deskripsi' => 'Produk riasan wajah harian yang aman untuk kulit sensitif, seperti bedak, cushion, dan lip cream.'
            ],
            [
                'nama' => 'Alat Kecantikan',
                'deskripsi' => 'Perangkat pendukung perawatan kulit mandiri seperti derma roller, face massager, dan cleansing brush.'
            ],
            [
                'nama' => 'Paket Bundling Khusus',
                'deskripsi' => 'Kumpulan produk untuk paket penyelesaian masalah kulit spesifik (Misal: Paket Anti Acne, Paket Whitening).'
            ]
        ];

        foreach ($kategori as $item) {
            KategoriProduk::create($item);
        }
    }
}

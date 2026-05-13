<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kegiatan;
use Carbon\Carbon;

class KegiatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Kegiatan 1
        Kegiatan::create([
            'namaKegiatan' => 'Seminar Edukasi: Mitos Anti-Aging',
            'deskripsi' => 'Bergabunglah bersama para dokter spesialis kulit dari Mische Beauty Clinic dalam acara seminar edukatif yang mengupas tuntas mitos-mitos seputar penuaan dini (Anti-Aging) di era modern. Tersedia konsultasi gratis dan pembagian sampel produk skincare eksklusif.',
            'foto' => 'kegiatan/default-kegiatan-1.png',
            'tanggalKegiatan' => Carbon::now()->addDays(5)->toDateString() // 5 hari ke depan
        ]);

        // Kegiatan 2
        Kegiatan::create([
            'namaKegiatan' => 'Promo Spesial: Laser Rejuvenation',
            'deskripsi' => 'Dalam rangka menyambut hari raya, Mische Beauty Clinic memberikan potongan harga hingga 50% untuk semua paket Laser Rejuvenation. Promo ini sangat terbatas dan hanya berlaku bagi 100 pendaftar pertama. Segera amankan kuota Anda!',
            'foto' => 'kegiatan/default-kegiatan-2.png',
            'tanggalKegiatan' => Carbon::now()->subDays(2)->toDateString() // 2 hari yang lalu
        ]);

        // Kegiatan 3
        Kegiatan::create([
            'namaKegiatan' => 'Grand Launching: Serum Formula Baru',
            'deskripsi' => 'Kami dengan bangga meluncurkan produk serum terbaru hasil riset selama 3 tahun. Serum ini dirancang khusus untuk menangani hiperpigmentasi dan flek hitam menahun. Hadiri acara peluncurannya untuk mendapatkan harga promo!',
            'foto' => 'kegiatan/default-kegiatan-3.png',
            'tanggalKegiatan' => Carbon::now()->addDays(14)->toDateString() // 14 hari ke depan
        ]);

        // Kegiatan 4
        Kegiatan::create([
            'namaKegiatan' => 'Bincang Santai: Merawat Kulit Berjerawat',
            'deskripsi' => 'Acara talkshow interaktif "Acne-Free Journey" bersama para Dermatologist senior. Anda bisa bertanya langsung mengenai rutinitas kulit yang benar untuk mengatasi masalah jerawat batu maupun bekas jerawat kemerahan (PIE).',
            'foto' => 'kegiatan/default-kegiatan-4.png',
            'tanggalKegiatan' => Carbon::now()->addDays(20)->toDateString() // 20 hari ke depan
        ]);

        // Kegiatan 5
        Kegiatan::create([
            'namaKegiatan' => 'Hari Pelanggan Nasional: Diskon Treatment 30%',
            'deskripsi' => 'Sebagai bentuk apresiasi terhadap kesetiaan para pelanggan Mische Beauty Clinic, kami mengadakan flash sale berupa diskon 30% untuk semua tindakan estetika medis non-bedah. Berlaku kelipatan!',
            'foto' => 'kegiatan/default-kegiatan-5.png',
            'tanggalKegiatan' => Carbon::now()->subDays(10)->toDateString() // 10 hari yang lalu
        ]);

        // Kegiatan 6
        Kegiatan::create([
            'namaKegiatan' => 'Workshop: Pentingnya Tabir Surya (Sunscreen)',
            'deskripsi' => 'Kulit kusam sering kali disebabkan oleh paparan sinar UV yang tidak ditangani. Pada workshop kali ini, peserta akan diajarkan cara membaca kandungan SPF dan PA+++ pada tabir surya agar tepat guna sesuai tipe kulit Anda di iklim tropis.',
            'foto' => 'kegiatan/default-kegiatan-6.png',
            'tanggalKegiatan' => Carbon::now()->addDays(30)->toDateString() // 30 hari ke depan
        ]);
    }
}

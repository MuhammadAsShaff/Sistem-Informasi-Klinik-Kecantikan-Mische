<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Testimoni;

class TestimoniSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Testimoni::create([
            'namaTester' => 'Rina S.',
            'jenisTestimoni' => 'Perawatan Wajah',
            'deskripsi' => 'Perawatan wajah di Mische sangat memuaskan, wajah saya jadi lebih cerah dan bersih!',
            'tanggalTreatment' => '2025-08-15',
            'buktiFoto' => 'testimoni/testi1.jpg'
        ]);

        Testimoni::create([
            'namaTester' => 'Budi T.',
            'jenisTestimoni' => 'Laser Acne',
            'deskripsi' => 'Jerawat saya jauh berkurang setelah 3 kali sesi laser acne. Dokter dan perawat sangat ramah.',
            'tanggalTreatment' => '2025-09-10',
            'buktiFoto' => 'testimoni/testi2.jpg'
        ]);

        Testimoni::create([
            'namaTester' => 'Sinta P.',
            'jenisTestimoni' => 'Facial Glowing',
            'deskripsi' => 'Tempatnya sangat nyaman dan bersih, hasil facialnya langsung terlihat glowing. Rekomendasi banget!',
            'tanggalTreatment' => '2025-10-05',
            'buktiFoto' => 'testimoni/testi3.jpg'
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JadwalReservasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jadwalData = [
            ['jamMulai' => '08:00', 'jamSelesai' => '09:00'],
            ['jamMulai' => '09:00', 'jamSelesai' => '10:00'],
            ['jamMulai' => '10:00', 'jamSelesai' => '11:00'],
            ['jamMulai' => '11:00', 'jamSelesai' => '12:00'],
            // Istirahat siang 12:00 - 13:00
            ['jamMulai' => '13:00', 'jamSelesai' => '14:00'],
            ['jamMulai' => '14:00', 'jamSelesai' => '15:00'],
            ['jamMulai' => '15:00', 'jamSelesai' => '16:00'],
            ['jamMulai' => '16:00', 'jamSelesai' => '17:00'],
            // Istirahat sore 17:00 - 18:00
            ['jamMulai' => '18:00', 'jamSelesai' => '19:00'],
            ['jamMulai' => '19:00', 'jamSelesai' => '20:00'],
        ];

        foreach ($jadwalData as $jadwal) {
            \App\Models\JadwalReservasi::create($jadwal);
        }
    }
}

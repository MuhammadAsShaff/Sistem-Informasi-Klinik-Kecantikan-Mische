<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Memanggil daftar class seeder yang ingin dijalankan secara sentral
        $this->call([
            UserSeeder::class,
            ProfilePerusahaanSeeder::class,
            JadwalReservasiSeeder::class,
        ]);
    }
}

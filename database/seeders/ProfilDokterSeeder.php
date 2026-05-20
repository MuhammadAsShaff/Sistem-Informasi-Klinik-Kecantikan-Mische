<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProfilDokter;

class ProfilDokterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dokters = [
            [
                'nama' => 'Dr. Jane Smith, Sp.KK',
                'foto' => 'dokter_jane.jpg',
                'email' => 'jane@dokter.com',
                'deskripsi' => 'Dokter spesialis kulit dan kelamin dengan pengalaman lebih dari 10 tahun.'
            ],
            [
                'nama' => 'Dr. Budi Santoso',
                'foto' => 'dokter_budi.jpg',
                'email' => 'budi@dokter.com',
                'deskripsi' => 'Dokter estetika bersertifikasi nasional.'
            ]
        ];

        foreach ($dokters as $dokter) {
            ProfilDokter::firstOrCreate(
                ['email' => $dokter['email']],
                $dokter
            );
        }
    }
}

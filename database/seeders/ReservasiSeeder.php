<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reservasi;
use App\Models\User;
use App\Models\ProfilDokter;
use App\Models\JadwalReservasi;
use Illuminate\Support\Carbon;

class ReservasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ambil/Buat Dokter
        $dokter = ProfilDokter::first();
        if (!$dokter) {
            $dokter = ProfilDokter::create([
                'nama' => 'Dr. Jane Smith, Sp.KK',
                'foto' => 'dokter_dummy.jpg',
                'email' => 'jane@dokter.com',
                'deskripsi' => 'Dokter spesialis kulit dan kelamin.'
            ]);
        }

        // 2. Ambil/Buat User Customer
        $customer = User::where('role', 'customer')->first();
        if (!$customer) {
            $customer = User::create([
                'nama' => 'Dummy Customer',
                'alamat' => 'Jl. Dummy',
                'jenisKelamin' => 'Perempuan',
                'tanggalLahir' => '1995-01-01',
                'role' => 'customer',
                'email' => 'customer_dummy@example.com',
                'nomorWa' => '08123456789',
                'password' => bcrypt('Password123')
            ]);
        }

        // 3. Ambil Jadwal Reservasi
        $jadwal1 = JadwalReservasi::where('jamMulai', '09:00')->first();
        $jadwal2 = JadwalReservasi::where('jamMulai', '10:00')->first();
        
        // Buat dummy jadwal kalau belum ada dari JadwalReservasiSeeder
        if (!$jadwal1) {
            $jadwal1 = JadwalReservasi::create(['jamMulai' => '09:00', 'jamSelesai' => '10:00']);
        }
        if (!$jadwal2) {
            $jadwal2 = JadwalReservasi::create(['jamMulai' => '10:00', 'jamSelesai' => '11:00']);
        }

        // 4. Data Reservasi Default
        $reservasiData = [
            [
                'namaCustomer' => $customer->nama,
                'nomorWa' => $customer->nomorWa,
                'jenisTreatment' => 'Facial Glowing',
                'tanggalReservasi' => Carbon::now()->addDays(2)->format('Y-m-d'),
                'status' => 'Menunggu',
                'idUser' => $customer->idUser,
                'idDokter' => $dokter->idDokter,
                'idJadwal' => $jadwal1->idJadwal,
            ],
            [
                'namaCustomer' => $customer->nama,
                'nomorWa' => $customer->nomorWa,
                'jenisTreatment' => 'Laser Acne',
                'tanggalReservasi' => Carbon::now()->addDays(5)->format('Y-m-d'),
                'status' => 'Dikonfirmasi',
                'idUser' => $customer->idUser,
                'idDokter' => $dokter->idDokter,
                'idJadwal' => $jadwal2->idJadwal,
            ]
        ];

        foreach ($reservasiData as $data) {
            Reservasi::create($data);
        }
    }
}

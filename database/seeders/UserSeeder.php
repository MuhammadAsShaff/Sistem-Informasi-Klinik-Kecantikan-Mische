<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ==========================================================
        // 1. DATA 5 AKUN ADMINISTRATOR
        // ==========================================================
        
        User::create([
            'nama'         => 'Admin Utama Mische',
            'alamat'       => 'Jl. Sudirman No 1',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1990-01-01',
            'role'         => 'admin',
            'email'        => 'admin1@mische.com',
            'nomorWa'      => '081234567801',
            'password'     => Hash::make('MischeAdmin1!')
        ]);

        User::create([
            'nama'         => 'Admin Operasional Mische',
            'alamat'       => 'Jl. Sudirman No 2',
            'jenisKelamin' => 'Laki-Laki',
            'tanggalLahir' => '1992-02-02',
            'role'         => 'admin',
            'email'        => 'admin2@mische.com',
            'nomorWa'      => '081234567802',
            'password'     => Hash::make('MischeAdmin2!')
        ]);

        User::create([
            'nama'         => 'Admin Keuangan Mische',
            'alamat'       => 'Jl. Sudirman No 3',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1993-03-03',
            'role'         => 'admin',
            'email'        => 'admin3@mische.com',
            'nomorWa'      => '081234567803',
            'password'     => Hash::make('MischeAdmin3!')
        ]);

        User::create([
            'nama'         => 'Admin Pemasaran Mische',
            'alamat'       => 'Jl. Sudirman No 4',
            'jenisKelamin' => 'Laki-Laki',
            'tanggalLahir' => '1994-04-04',
            'role'         => 'admin',
            'email'        => 'admin4@mische.com',
            'nomorWa'      => '081234567804',
            'password'     => Hash::make('MischeAdmin4!')
        ]);

        User::create([
            'nama'         => 'Admin IT Mische',
            'alamat'       => 'Jl. Sudirman No 5',
            'jenisKelamin' => 'Laki-Laki',
            'tanggalLahir' => '1995-05-05',
            'role'         => 'admin',
            'email'        => 'admin5@mische.com',
            'nomorWa'      => '081234567805',
            'password'     => Hash::make('MischeAdmin5!')
        ]);

        // ==========================================================
        // 2. DATA 10 AKUN CUSTOMER
        // ==========================================================

        User::create([
            'nama'         => 'Budi Santoso',
            'alamat'       => 'Jl. Mawar No 10',
            'jenisKelamin' => 'Laki-Laki',
            'tanggalLahir' => '1995-10-10',
            'role'         => 'customer',
            'email'        => 'customer1@gmail.com',
            'nomorWa'      => '081111111101',
            'password'     => Hash::make('PasienBudi123!')
        ]);

        User::create([
            'nama'         => 'Siti Aminah',
            'alamat'       => 'Jl. Melati No 11',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1996-11-11',
            'role'         => 'customer',
            'email'        => 'customer2@gmail.com',
            'nomorWa'      => '081111111102',
            'password'     => Hash::make('PasienSiti123!')
        ]);

        User::create([
            'nama'         => 'Andi Wijaya',
            'alamat'       => 'Jl. Anggrek No 12',
            'jenisKelamin' => 'Laki-Laki',
            'tanggalLahir' => '1997-12-12',
            'role'         => 'customer',
            'email'        => 'customer3@gmail.com',
            'nomorWa'      => '081111111103',
            'password'     => Hash::make('PasienAndi123!')
        ]);

        User::create([
            'nama'         => 'Rina Rahmawati',
            'alamat'       => 'Jl. Dahlia No 13',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1998-01-13',
            'role'         => 'customer',
            'email'        => 'customer4@gmail.com',
            'nomorWa'      => '081111111104',
            'password'     => Hash::make('PasienRina123!')
        ]);

        User::create([
            'nama'         => 'Dewi Lestari',
            'alamat'       => 'Jl. Kamboja No 14',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1999-02-14',
            'role'         => 'customer',
            'email'        => 'customer5@gmail.com',
            'nomorWa'      => '081111111105',
            'password'     => Hash::make('PasienDewi123!')
        ]);

        User::create([
            'nama'         => 'Bagus Prasetyo',
            'alamat'       => 'Jl. Kenanga No 15',
            'jenisKelamin' => 'Laki-Laki',
            'tanggalLahir' => '1990-03-15',
            'role'         => 'customer',
            'email'        => 'customer6@gmail.com',
            'nomorWa'      => '081111111106',
            'password'     => Hash::make('PasienBagus123!')
        ]);

        User::create([
            'nama'         => 'Nia Ramadhani',
            'alamat'       => 'Jl. Cempaka No 16',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1991-04-16',
            'role'         => 'customer',
            'email'        => 'customer7@gmail.com',
            'nomorWa'      => '081111111107',
            'password'     => Hash::make('PasienNia123!')
        ]);

        User::create([
            'nama'         => 'Hendra Setiawan',
            'alamat'       => 'Jl. Flamboyan No 17',
            'jenisKelamin' => 'Laki-Laki',
            'tanggalLahir' => '1992-05-17',
            'role'         => 'customer',
            'email'        => 'customer8@gmail.com',
            'nomorWa'      => '081111111108',
            'password'     => Hash::make('PasienHendra123!')
        ]);

        User::create([
            'nama'         => 'Maya Putri',
            'alamat'       => 'Jl. Teratai No 18',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1993-06-18',
            'role'         => 'customer',
            'email'        => 'customer9@gmail.com',
            'nomorWa'      => '081111111109',
            'password'     => Hash::make('PasienMaya123!')
        ]);

        User::create([
            'nama'         => 'Joko Santoso',
            'alamat'       => 'Jl. Alamanda No 19',
            'jenisKelamin' => 'Laki-Laki',
            'tanggalLahir' => '1994-07-19',
            'role'         => 'customer',
            'email'        => 'customer10@gmail.com',
            'nomorWa'      => '081111111110',
            'password'     => Hash::make('PasienJoko123!')
        ]);

    }
}

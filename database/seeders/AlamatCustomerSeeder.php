<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AlamatCustomer;
use App\Models\User;

class AlamatCustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil beberapa customer dari database (berdasarkan UserSeeder)
        $customer1 = User::where('email', 'customer1@gmail.com')->first();
        $customer2 = User::where('email', 'customer2@gmail.com')->first();

        if ($customer1) {
            // Alamat Utama Budi
            $alamatUtamaBudi = AlamatCustomer::create([
                'idUser'       => $customer1->idUser,
                'namaPenerima' => 'Budi Santoso',
                'nomorHp'      => '081111111101',
                'detailAlamat' => 'Jl. Merdeka No. 10, RT 01 RW 02, Kel. Sukamaju, Kec. Maju Terus',
                'provinceId'   => '9', // Jawa Barat (id RajaOngkir dummy)
                'cityId'       => '115', // Depok (id RajaOngkir dummy)
                'districtId'   => '1605',
                'kodePos'      => '16411'
            ]);

            // Set alamat utama
            $customer1->update(['idAlamatUtama' => $alamatUtamaBudi->id]);

            // Alamat Kantor Budi
            AlamatCustomer::create([
                'idUser'       => $customer1->idUser,
                'namaPenerima' => 'Budi Santoso (Kantor)',
                'nomorHp'      => '081111111101',
                'detailAlamat' => 'Gedung Sudirman Center Lantai 5, Jl. Jend. Sudirman Kav 10',
                'provinceId'   => '6', // DKI Jakarta
                'cityId'       => '152', // Jakarta Pusat
                'districtId'   => '2081',
                'kodePos'      => '10220'
            ]);
        }

        if ($customer2) {
            // Alamat Utama Siti
            $alamatUtamaSiti = AlamatCustomer::create([
                'idUser'       => $customer2->idUser,
                'namaPenerima' => 'Siti Aminah',
                'nomorHp'      => '081111111102',
                'detailAlamat' => 'Perumahan Indah Asri Blok C No. 5',
                'provinceId'   => '10', // Jawa Tengah
                'cityId'       => '398', // Semarang
                'districtId'   => '5391',
                'kodePos'      => '50111'
            ]);

            // Set alamat utama
            $customer2->update(['idAlamatUtama' => $alamatUtamaSiti->id]);
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Keranjang;
use App\Models\User;
use App\Models\ProdukKlinik;

class KeranjangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $customer = User::where('role', 'customer')->first();
        $produk1 = ProdukKlinik::first();
        $produk2 = ProdukKlinik::skip(1)->first();

        if ($customer && $produk1) {
            Keranjang::create([
                'idUser' => $customer->idUser,
                'idProduk' => $produk1->idProduk,
                'jumlahProduk' => 2
            ]);
        }

        if ($customer && $produk2) {
            Keranjang::create([
                'idUser' => $customer->idUser,
                'idProduk' => $produk2->idProduk,
                'jumlahProduk' => 1
            ]);
        }
    }
}

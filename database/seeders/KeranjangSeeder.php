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
        $customers = User::where('role', 'customer')->get();
        $produks = ProdukKlinik::take(3)->get();

        if ($customers->isNotEmpty() && $produks->isNotEmpty()) {
            foreach ($customers as $index => $customer) {
                // Setiap customer diberikan 1-2 produk secara acak ke keranjang
                foreach ($produks as $pIndex => $produk) {
                    if ($pIndex == 0 || $pIndex == ($index % count($produks))) {
                        Keranjang::create([
                            'idUser' => $customer->idUser,
                            'idProduk' => $produk->idProduk,
                            'jumlahProduk' => rand(1, 3)
                        ]);
                    }
                }
            }
        }
    }
}

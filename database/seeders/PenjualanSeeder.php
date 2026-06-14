<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Penjualan;
use App\Models\DetailPenjualan;
use App\Models\User;
use App\Models\ProdukKlinik;

class PenjualanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $customer = User::where('role', 'customer')->first();
        $produk = ProdukKlinik::first();

        if ($customer && $produk) {
            $penjualan = Penjualan::create([
                'tanggal' => now(),
                'invoiceNumber' => 'INV-' . time() . '-1',
                'subtotal' => $produk->harga * 2,
                'shippingCost' => 15000,
                'shippingCourier' => 'jne',
                'shippingService' => 'REG',
                'total' => ($produk->harga * 2) + 15000,
                'paymentStatus' => 'unpaid',
                'orderStatus' => 'pending',
                'idUser' => $customer->idUser,
                'idPromo' => null,
                'idAlamat' => null
            ]);

            DetailPenjualan::create([
                'idPenjualan' => $penjualan->idPenjualan,
                'idProduk' => $produk->idProduk,
                'jumlahProduk' => 2
            ]);

            $penjualanSelesai = Penjualan::create([
                'tanggal' => now()->subDays(2),
                'invoiceNumber' => 'INV-' . time() . '-2',
                'subtotal' => $produk->harga * 1,
                'shippingCost' => 20000,
                'shippingCourier' => 'pos',
                'shippingService' => 'Kilat',
                'total' => ($produk->harga * 1) + 20000,
                'paymentStatus' => 'paid',
                'orderStatus' => 'selesai',
                'paidAt' => now()->subDays(2),
                'idUser' => $customer->idUser,
                'idPromo' => null,
                'idAlamat' => null
            ]);

            DetailPenjualan::create([
                'idPenjualan' => $penjualanSelesai->idPenjualan,
                'idProduk' => $produk->idProduk,
                'jumlahProduk' => 1
            ]);
        }
    }
}

<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Penjualan;
use App\Models\DetailPenjualan;
use App\Models\Promo;
use App\Models\KategoriProduk;
use App\Models\ProdukKlinik;
use Tymon\JWTAuth\Facades\JWTAuth;

class PenjualanApiTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $customer;
    protected $tokenAdmin;
    protected $tokenCustomer;
    protected $promo;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'nama' => 'Admin Test',
            'email' => 'admin' . time() . '@test.com',
            'password' => bcrypt('password123'),
            
            'nomorWa' => '081234567890',
            'jenisKelamin' => 'Laki-laki',
            'tanggalLahir' => '1990-01-01',
            'role' => 'admin'
        ]);

        $this->customer = User::create([
            'nama' => 'Customer Test',
            'email' => 'customer' . time() . '@test.com',
            'password' => bcrypt('password123'),
            
            'nomorWa' => '081234567891',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01',
            'role' => 'customer'
        ]);

        $this->tokenAdmin = JWTAuth::fromUser($this->admin);
        $this->tokenCustomer = JWTAuth::fromUser($this->customer);

        $kategori = KategoriProduk::create([
            'nama' => 'Kategori Test',
            'deskripsi' => 'Deskripsi Kategori'
        ]);

        $produk = ProdukKlinik::create([
            'nama' => 'Produk Test',
            'deskripsi' => 'Deskripsi',
            'stock' => 10,
            'harga' => 100000,
            'gambar' => 'default.png',
            'idKategori' => $kategori->idKategori
        ]);

        $this->promo = Promo::create([
            'namaPromo' => 'Promo Test',
            'deskripsi' => 'Deskripsi Promo',
            'diskon' => 10,
            'kode' => 'PROMO10',
            'jenisPromo' => 'Diskon',
            'tanggalMulai' => now(),
            'tanggalSelesai' => now()->addDays(7),
            'minimalTransaksi' => 10000,
            'status' => 'aktif',
            'gambar' => 'default.png',
            'idKategori' => $kategori->idKategori,
            'idProduk' => $produk->idProduk
        ]);
    }

    /** @test */
    public function admin_bisa_melihat_semua_penjualan()
    {
        Penjualan::create([
            'tanggal' => now(),
            'invoiceNumber' => 'INV-' . time() . '-1',
            'subtotal' => 50000,
            'shippingCost' => 0,
            'shippingCourier' => 'jne',
            'shippingService' => 'REG',
            'total' => 50000,
            'paymentStatus' => 'paid',
            'orderStatus' => 'pending',
            'idUser' => $this->customer->idUser,
            'idPromo' => $this->promo->idPromo
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->tokenAdmin,
        ])->getJson('/api/admin/penjualan');

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);
    }

    /** @test */
    public function admin_bisa_update_status_penjualan()
    {
        $penjualan = Penjualan::create([
            'tanggal' => now(),
            'invoiceNumber' => 'INV-' . time() . '-2',
            'subtotal' => 50000,
            'shippingCost' => 0,
            'shippingCourier' => 'jne',
            'shippingService' => 'REG',
            'total' => 50000,
            'paymentStatus' => 'paid',
            'orderStatus' => 'pending',
            'idUser' => $this->customer->idUser,
            'idPromo' => $this->promo->idPromo
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->tokenAdmin,
        ])->patchJson('/api/admin/penjualan/' . $penjualan->idPenjualan, [
            'orderStatus' => 'dikirim'
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.orderStatus', 'dikirim');
    }

    /** @test */
    public function admin_bisa_hapus_penjualan()
    {
        $penjualan = Penjualan::create([
            'tanggal' => now(),
            'invoiceNumber' => 'INV-' . time() . '-3',
            'subtotal' => 50000,
            'shippingCost' => 0,
            'shippingCourier' => 'jne',
            'shippingService' => 'REG',
            'total' => 50000,
            'paymentStatus' => 'paid',
            'orderStatus' => 'pending',
            'idUser' => $this->customer->idUser,
            'idPromo' => $this->promo->idPromo
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->tokenAdmin,
        ])->deleteJson('/api/admin/penjualan/' . $penjualan->idPenjualan);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);
    }

    /** @test */
    public function customer_bisa_menerima_barang()
    {
        $penjualan = Penjualan::create([
            'tanggal' => now(),
            'invoiceNumber' => 'INV-' . time() . '-4',
            'subtotal' => 50000,
            'shippingCost' => 0,
            'shippingCourier' => 'jne',
            'shippingService' => 'REG',
            'total' => 50000,
            'paymentStatus' => 'paid',
            'orderStatus' => 'dikirim',
            'idUser' => $this->customer->idUser,
            'idPromo' => $this->promo->idPromo
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->tokenCustomer,
        ])->patchJson('/api/customer/penjualan/' . $penjualan->idPenjualan);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.orderStatus', 'selesai');
    }
}

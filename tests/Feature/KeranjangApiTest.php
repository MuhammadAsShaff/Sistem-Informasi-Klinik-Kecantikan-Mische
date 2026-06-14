<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\ProdukKlinik;
use App\Models\KategoriProduk;
use App\Models\Keranjang;
use Tymon\JWTAuth\Facades\JWTAuth;

class KeranjangApiTest extends TestCase
{
    use RefreshDatabase;

    protected $customer;
    protected $token;
    protected $produk;

    protected function setUp(): void
    {
        parent::setUp();

        $this->customer = User::create([
            'nama' => 'Customer Test',
            'email' => 'customer' . time() . '@test.com',
            'password' => bcrypt('password123'),
            
            'nomorWa' => '08123456789',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01',
            'role' => 'customer'
        ]);

        $this->token = JWTAuth::fromUser($this->customer);

        $kategori = KategoriProduk::create([
            'nama' => 'Kategori Test',
            'deskripsi' => 'Deskripsi Kategori'
        ]);

        $this->produk = ProdukKlinik::create([
            'nama' => 'Produk A',
            'deskripsi' => 'Deskripsi',
            'stock' => 10,
            'harga' => 100000,
            'gambar' => 'default.png',
            'idKategori' => $kategori->idKategori
        ]);
    }

    /** @test */
    public function customer_bisa_melihat_keranjang()
    {
        Keranjang::create([
            'idUser' => $this->customer->idUser,
            'idProduk' => $this->produk->idProduk,
            'jumlahProduk' => 2
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/customer/card');

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);
    }

    /** @test */
    public function customer_bisa_menambah_keranjang()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/customer/card', [
            'idProduk' => $this->produk->idProduk,
            'jumlahProduk' => 1
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true);
    }

    /** @test */
    public function customer_bisa_mengubah_jumlah_keranjang()
    {
        $keranjang = Keranjang::create([
            'idUser' => $this->customer->idUser,
            'idProduk' => $this->produk->idProduk,
            'jumlahProduk' => 2
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->patchJson('/api/customer/card/' . $keranjang->idKeranjang, [
            'jumlahProduk' => 5
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.jumlahProduk', 5);
    }

    /** @test */
    public function customer_bisa_menghapus_item_keranjang()
    {
        $keranjang = Keranjang::create([
            'idUser' => $this->customer->idUser,
            'idProduk' => $this->produk->idProduk,
            'jumlahProduk' => 2
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->deleteJson('/api/customer/card/' . $keranjang->idKeranjang);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);
    }
}

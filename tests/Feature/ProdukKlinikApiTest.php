<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\KategoriProduk;
use App\Models\ProdukKlinik;
use App\Models\Promo;

class ProdukKlinikApiTest extends TestCase
{
    use RefreshDatabase;

    protected function getAdminToken()
    {
        $admin = User::create([
            'nama' => 'Admin Test',
            
            'jenisKelamin' => 'Laki-Laki',
            'tanggalLahir' => '1990-01-01',
            'role' => 'admin',
            'email' => 'admin@test.com',
            'nomorWa' => '08111222333',
            'password' => bcrypt('Password123')
        ]);

        return auth('api')->login($admin);
    }

    protected function getCustomerToken()
    {
        $customer = User::create([
            'nama' => 'Customer Test',
            
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01',
            'role' => 'customer',
            'email' => 'customer@test.com',
            'nomorWa' => '08999888777',
            'password' => bcrypt('Password123')
        ]);

        return auth('api')->login($customer);
    }

    public function test_admin_bisa_menambah_produk()
    {
        $token = $this->getAdminToken();
        $kategori = KategoriProduk::create(['nama' => 'Kategori A', 'deskripsi' => 'Deskripsi Kategori A']);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/admin/product', [
            'nama' => 'Produk Baru',
            'deskripsi' => 'Deskripsi Produk Baru',
            'harga' => 100000,
            'stock' => 50,
            'berat' => 200,
            'gambar' => \Illuminate\Http\UploadedFile::fake()->image('gambar_baru.jpg'),
            'idKategori' => $kategori->idKategori
        ]);

        $response->assertStatus(201)
                 ->assertJson(['status' => 'success']);

        $this->assertDatabaseHas('produkklinik', [
            'nama' => 'Produk Baru',
            'stock' => 50,
            'berat' => 200
        ]);
    }

    public function test_admin_bisa_memperbarui_stok_produk()
    {
        $token = $this->getAdminToken();
        $kategori = KategoriProduk::create(['nama' => 'Kategori A', 'deskripsi' => 'Deskripsi Kategori A']);
        $produk = ProdukKlinik::create([
            'nama' => 'Produk Stok Lama',
            'deskripsi' => 'Deskripsi Lama',
            'harga' => 50000,
            'stock' => 10,
            'berat' => 100,
            'gambar' => 'gambar_lama.jpg',
            'idKategori' => $kategori->idKategori
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->patchJson("/api/admin/product/{$produk->idProduk}", [
            'stock' => 20
        ]);

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success']);

        $this->assertDatabaseHas('produkklinik', [
            'idProduk' => $produk->idProduk,
            'stock' => 20
        ]);
    }

    public function test_customer_bisa_memesan_produk()
    {
        $token = $this->getCustomerToken();
        $kategori = KategoriProduk::create(['nama' => 'Kategori A', 'deskripsi' => 'Deskripsi Kategori A']);
        $produk = ProdukKlinik::create([
            'nama' => 'Produk Order',
            'deskripsi' => 'Deskripsi Order',
            'harga' => 50000,
            'stock' => 10,
            'berat' => 100,
            'gambar' => 'gambar_order.jpg',
            'idKategori' => $kategori->idKategori
        ]);

        $promo = Promo::create([
            'gambar' => 'promo.jpg',
            'namaPromo' => 'Promo Diskon Test',
            'jenisPromo' => 'Diskon Harga',
            'kode' => 'PROMO123',
            'diskon' => 5000,
            'deskripsi' => 'Syarat dan ketentuan promo diskon',
            'tanggalMulai' => '2026-01-01',
            'tanggalSelesai' => '2026-12-31',
            'minimalTransaksi' => 10000,
            'status' => 'Aktif',
            'idKategori' => $kategori->idKategori,
            'idProduk' => $produk->idProduk
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson("/api/customer/product/{$produk->idProduk}/order", [
            'jumlah' => 2,
            'idPromo' => $promo->idPromo
        ]);
        
        if ($response->status() !== 201) {
            $response->dump();
        }

        $response->assertStatus(201)
                 ->assertJson(['status' => 'success']);

        // Pastikan stok berkurang
        $this->assertDatabaseHas('produkklinik', [
            'idProduk' => $produk->idProduk,
            'stock' => 8
        ]);

        // Pastikan penjualan tercatat
        $this->assertDatabaseHas('penjualan', [
            'subtotal' => 100000,
            'orderStatus' => 'pending'
        ]);
    }

    public function test_customer_bisa_melihat_produk_publik()
    {
        $kategori = KategoriProduk::create(['nama' => 'Kategori A', 'deskripsi' => 'Deskripsi Kategori A']);
        ProdukKlinik::create([
            'nama' => 'Produk Publik',
            'deskripsi' => 'Deskripsi Publik',
            'harga' => 50000,
            'stock' => 10,
            'berat' => 150,
            'gambar' => 'gambar_publik.jpg',
            'idKategori' => $kategori->idKategori
        ]);

        $response = $this->getJson('/api/customer/product');

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success']);
    }
}

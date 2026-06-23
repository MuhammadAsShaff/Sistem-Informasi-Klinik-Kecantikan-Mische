<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\KategoriProduk;
use App\Models\ProdukKlinik;
use App\Models\Promo;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

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

    public function test_admin_bisa_melihat_semua_produk()
    {
        $token = $this->getAdminToken();
        $kategori = KategoriProduk::create(['nama' => 'Kategori A', 'deskripsi' => 'Deskripsi Kategori A']);
        ProdukKlinik::create([
            'nama' => 'Produk A', 'deskripsi' => 'A', 'harga' => 100, 'stock' => 10, 'berat' => 10, 'gambar' => 'a.jpg', 'idKategori' => $kategori->idKategori
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/admin/product');

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success']);
    }

    public function test_admin_bisa_menambah_produk()
    {
        $token = $this->getAdminToken();
        Storage::fake('public');
        $kategori = KategoriProduk::create(['nama' => 'Kategori A', 'deskripsi' => 'Deskripsi Kategori A']);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/admin/product', [
            'nama' => 'Produk Baru',
            'deskripsi' => 'Deskripsi Produk Baru',
            'harga' => 100000,
            'stock' => 50,
            'berat' => 200,
            'gambar' => UploadedFile::fake()->image('gambar_baru.jpg'),
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

    public function test_admin_bisa_memperbarui_data_produk_penuh()
    {
        $token = $this->getAdminToken();
        $kategori = KategoriProduk::create(['nama' => 'Kategori A', 'deskripsi' => 'Deskripsi Kategori A']);
        $produk = ProdukKlinik::create([
            'nama' => 'Produk Lama',
            'deskripsi' => 'Deskripsi Lama',
            'harga' => 50000,
            'stock' => 10,
            'berat' => 100,
            'gambar' => 'gambar_lama.jpg',
            'idKategori' => $kategori->idKategori
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->putJson("/api/admin/product/{$produk->idProduk}", [
            'nama' => 'Produk Updated',
            'deskripsi' => 'Deskripsi Baru',
            'harga' => 75000,
            'stock' => 15,
            'berat' => 250,
            'idKategori' => $kategori->idKategori
        ]);

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success']);

        $this->assertDatabaseHas('produkklinik', [
            'idProduk' => $produk->idProduk,
            'nama' => 'Produk Updated',
            'harga' => 75000
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

    public function test_admin_bisa_menghapus_produk()
    {
        $token = $this->getAdminToken();
        $kategori = KategoriProduk::create(['nama' => 'Kategori A', 'deskripsi' => 'Deskripsi Kategori A']);
        $produk = ProdukKlinik::create([
            'nama' => 'Produk Dihapus',
            'deskripsi' => 'Deskripsi Lama',
            'harga' => 50000,
            'stock' => 10,
            'berat' => 100,
            'gambar' => 'gambar_lama.jpg',
            'idKategori' => $kategori->idKategori
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->deleteJson("/api/admin/product/{$produk->idProduk}");

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success']);

        $this->assertDatabaseMissing('produkklinik', [
            'idProduk' => $produk->idProduk
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
                 ->assertJson(['status' => 'success'])
                 ->assertJsonCount(1, 'data');
    }

    public function test_customer_bisa_melihat_detail_satu_produk()
    {
        $kategori = KategoriProduk::create(['nama' => 'Kategori A', 'deskripsi' => 'Deskripsi Kategori A']);
        $produk = ProdukKlinik::create([
            'nama' => 'Produk Tunggal',
            'deskripsi' => 'Deskripsi Publik',
            'harga' => 50000,
            'stock' => 10,
            'berat' => 150,
            'gambar' => 'gambar_publik.jpg',
            'idKategori' => $kategori->idKategori
        ]);

        $response = $this->getJson("/api/customer/product/{$produk->idProduk}");

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success'])
                 ->assertJsonPath('data.nama', 'Produk Tunggal');
    }

    public function test_customer_bisa_memfilter_produk_berdasarkan_kategori()
    {
        $kategori1 = KategoriProduk::create(['nama' => 'Skincare', 'deskripsi' => 'Deskripsi Skincare']);
        $kategori2 = KategoriProduk::create(['nama' => 'Haircare', 'deskripsi' => 'Deskripsi Haircare']);

        ProdukKlinik::create([
            'nama' => 'Produk A',
            'deskripsi' => 'Deskripsi',
            'harga' => 50000,
            'stock' => 10,
            'berat' => 150,
            'gambar' => 'a.jpg',
            'idKategori' => $kategori1->idKategori
        ]);

        ProdukKlinik::create([
            'nama' => 'Produk B',
            'deskripsi' => 'Deskripsi',
            'harga' => 50000,
            'stock' => 10,
            'berat' => 150,
            'gambar' => 'b.jpg',
            'idKategori' => $kategori2->idKategori
        ]);

        $response = $this->getJson('/api/customer/product?idKategori=' . $kategori1->idKategori);

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success'])
                 ->assertJsonCount(1, 'data');
        
        $this->assertEquals('Produk A', $response->json('data.0.nama'));
    }

    public function test_customer_bisa_melihat_kategori_produk()
    {
        KategoriProduk::create(['nama' => 'Skincare', 'deskripsi' => 'Deskripsi Skincare']);
        
        $response = $this->getJson('/api/customer/product/categories');

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success'])
                 ->assertJsonFragment(['nama' => 'Skincare']);
    }
}

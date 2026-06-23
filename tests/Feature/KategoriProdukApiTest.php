<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\KategoriProduk;
use App\Models\ProdukKlinik;

class KategoriProdukApiTest extends TestCase
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

    public function test_admin_bisa_melihat_semua_kategori()
    {
        $token = $this->getAdminToken();
        KategoriProduk::create([
            'nama' => 'Kategori A',
            'deskripsi' => 'Deskripsi Kategori A'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/admin/kategori');

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success'])
                 ->assertJsonCount(1, 'data');
    }
    
    public function test_admin_bisa_melihat_jumlah_produk_per_kategori()
    {
        $token = $this->getAdminToken();
        $kategori = KategoriProduk::create([
            'nama' => 'Kategori Test Count',
            'deskripsi' => 'Deskripsi Kategori A'
        ]);
        
        // Buat 2 produk untuk kategori ini
        ProdukKlinik::create([
            'nama' => 'Produk A', 'deskripsi' => 'A', 'harga' => 100, 'stock' => 10, 'berat' => 10, 'gambar' => 'a.jpg', 'idKategori' => $kategori->idKategori
        ]);
        ProdukKlinik::create([
            'nama' => 'Produk B', 'deskripsi' => 'B', 'harga' => 100, 'stock' => 10, 'berat' => 10, 'gambar' => 'b.jpg', 'idKategori' => $kategori->idKategori
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/admin/kategori/count-products');

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success']);
                 
        $this->assertEquals(2, $response->json('data.0.jumlahProduk'));
    }

    public function test_admin_bisa_menambah_kategori_baru()
    {
        $token = $this->getAdminToken();

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/admin/kategori', [
            'nama' => 'Kategori Baru',
            'deskripsi' => 'Deskripsi Baru'
        ]);

        $response->assertStatus(201)
                 ->assertJson(['status' => 'success']);

        $this->assertDatabaseHas('kategoriproduk', [
            'nama' => 'Kategori Baru'
        ]);
    }

    public function test_admin_bisa_memperbarui_kategori()
    {
        $token = $this->getAdminToken();
        $kategori = KategoriProduk::create([
            'nama' => 'Kategori Lama',
            'deskripsi' => 'Deskripsi Lama'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->putJson("/api/admin/kategori/{$kategori->idKategori}", [
            'nama' => 'Kategori Diupdate',
            'deskripsi' => 'Deskripsi Diupdate'
        ]);

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success']);

        $this->assertDatabaseHas('kategoriproduk', [
            'nama' => 'Kategori Diupdate'
        ]);
    }

    public function test_admin_bisa_menghapus_kategori()
    {
        $token = $this->getAdminToken();
        $kategori = KategoriProduk::create([
            'nama' => 'Kategori Dihapus',
            'deskripsi' => 'Deskripsi Dihapus'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->deleteJson("/api/admin/kategori/{$kategori->idKategori}");

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success']);

        $this->assertDatabaseMissing('kategoriproduk', [
            'idKategori' => $kategori->idKategori
        ]);
    }
    
    public function test_admin_gagal_menghapus_kategori_yang_masih_punya_produk()
    {
        $token = $this->getAdminToken();
        $kategori = KategoriProduk::create([
            'nama' => 'Kategori Tidak Dihapus',
            'deskripsi' => 'Deskripsi Dihapus'
        ]);
        
        ProdukKlinik::create([
            'nama' => 'Produk A', 'deskripsi' => 'A', 'harga' => 100, 'stock' => 10, 'berat' => 10, 'gambar' => 'a.jpg', 'idKategori' => $kategori->idKategori
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->deleteJson("/api/admin/kategori/{$kategori->idKategori}");

        $response->assertStatus(400)
                 ->assertJson(['status' => 'error']);

        $this->assertDatabaseHas('kategoriproduk', [
            'idKategori' => $kategori->idKategori
        ]);
    }
}

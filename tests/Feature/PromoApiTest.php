<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Promo;
use App\Models\KategoriProduk;
use App\Models\ProdukKlinik;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PromoApiTest extends TestCase
{
    use RefreshDatabase;

    protected function getAdminToken()
    {
        $admin = User::create([
            'nama' => 'Admin Test',
            'alamat' => 'Jl. Admin Test',
            'jenisKelamin' => 'Laki-Laki',
            'tanggalLahir' => '1990-01-01',
            'role' => 'admin',
            'email' => 'admin@test.com',
            'nomorWa' => '08111222333',
            'password' => bcrypt('Password123')
        ]);

        return auth('api')->login($admin);
    }

    protected function createDummyDeps()
    {
        $kategori = KategoriProduk::create([
            'nama' => 'Kategori A',
            'deskripsi' => 'Deskripsi Kategori A'
        ]);
        $produk = ProdukKlinik::create([
            'nama' => 'Produk A',
            'harga' => 100000,
            'stock' => 10,
            'gambar' => 'default.jpg',
            'deskripsi' => 'Deskripsi',
            'idKategori' => $kategori->idKategori
        ]);
        return [$kategori, $produk];
    }

    public function test_admin_bisa_menambah_promo_baru()
    {
        $token = $this->getAdminToken();
        [$kategori, $produk] = $this->createDummyDeps();
        Storage::fake('public');

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/admin/promo', [
            'gambar' => UploadedFile::fake()->image('promo.jpg'),
            'namaPromo' => 'Promo A',
            'jenisPromo' => 'Diskon',
            'kode' => 'PROMO123',
            'diskon' => 15000,
            'deskripsi' => 'Deskripsi Promo',
            'tanggalMulai' => Carbon::now()->format('Y-m-d'),
            'tanggalSelesai' => Carbon::now()->addDays(5)->format('Y-m-d'),
            'minimalTransaksi' => 50000,
            'status' => true,
            'idKategori' => $kategori->idKategori,
            'idProduk' => $produk->idProduk
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('promo', [
            'kode' => 'PROMO123'
        ]);
    }

    public function test_admin_bisa_melihat_semua_promo()
    {
        $token = $this->getAdminToken();
        [$kategori, $produk] = $this->createDummyDeps();
        
        Promo::create([
            'gambar' => 'promo.jpg',
            'namaPromo' => 'Promo B',
            'jenisPromo' => 'Diskon',
            'kode' => 'PROMO321',
            'diskon' => 15000,
            'deskripsi' => 'Deskripsi Promo',
            'tanggalMulai' => Carbon::now()->format('Y-m-d'),
            'tanggalSelesai' => Carbon::now()->addDays(5)->format('Y-m-d'),
            'minimalTransaksi' => 50000,
            'status' => true,
            'idKategori' => $kategori->idKategori,
            'idProduk' => $produk->idProduk
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/admin/promo');

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
    }

    public function test_admin_bisa_memperbarui_promo()
    {
        $token = $this->getAdminToken();
        [$kategori, $produk] = $this->createDummyDeps();
        Storage::fake('public');
        
        $promo = Promo::create([
            'gambar' => 'promo.jpg',
            'namaPromo' => 'Promo C',
            'jenisPromo' => 'Diskon',
            'kode' => 'PROMOC',
            'diskon' => 15000,
            'deskripsi' => 'Deskripsi Promo',
            'tanggalMulai' => Carbon::now()->format('Y-m-d'),
            'tanggalSelesai' => Carbon::now()->addDays(5)->format('Y-m-d'),
            'minimalTransaksi' => 50000,
            'status' => true,
            'idKategori' => $kategori->idKategori,
            'idProduk' => $produk->idProduk
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->putJson("/api/admin/promo/{$promo->idPromo}", [
            'gambar' => UploadedFile::fake()->image('promo_updated.jpg'),
            'namaPromo' => 'Promo C Updated',
            'jenisPromo' => 'Diskon',
            'kode' => 'PROMOC',
            'diskon' => 20000,
            'deskripsi' => 'Deskripsi Promo',
            'tanggalMulai' => Carbon::now()->format('Y-m-d'),
            'tanggalSelesai' => Carbon::now()->addDays(5)->format('Y-m-d'),
            'minimalTransaksi' => 50000,
            'status' => true,
            'idKategori' => $kategori->idKategori,
            'idProduk' => $produk->idProduk
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('promo', [
            'namaPromo' => 'Promo C Updated'
        ]);
    }

    public function test_admin_bisa_menghapus_promo()
    {
        $token = $this->getAdminToken();
        [$kategori, $produk] = $this->createDummyDeps();
        
        $promo = Promo::create([
            'gambar' => 'promo.jpg',
            'namaPromo' => 'Promo D',
            'jenisPromo' => 'Diskon',
            'kode' => 'PROMOD',
            'diskon' => 15000,
            'deskripsi' => 'Deskripsi Promo',
            'tanggalMulai' => Carbon::now()->format('Y-m-d'),
            'tanggalSelesai' => Carbon::now()->addDays(5)->format('Y-m-d'),
            'minimalTransaksi' => 50000,
            'status' => true,
            'idKategori' => $kategori->idKategori,
            'idProduk' => $produk->idProduk
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->deleteJson("/api/admin/promo/{$promo->idPromo}");

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('promo', [
            'idPromo' => $promo->idPromo
        ]);
    }

    public function test_publik_hanya_bisa_melihat_promo_aktif()
    {
        [$kategori, $produk] = $this->createDummyDeps();
        
        // Promo Aktif
        Promo::create([
            'gambar' => 'promo.jpg',
            'namaPromo' => 'Promo E',
            'jenisPromo' => 'Diskon',
            'kode' => 'PROMOE',
            'diskon' => 15000,
            'deskripsi' => 'Deskripsi Promo',
            'tanggalMulai' => Carbon::now()->format('Y-m-d'),
            'tanggalSelesai' => Carbon::now()->addDays(5)->format('Y-m-d'),
            'minimalTransaksi' => 50000,
            'status' => true, // Aktif
            'idKategori' => $kategori->idKategori,
            'idProduk' => $produk->idProduk
        ]);

        // Promo Tidak Aktif
        Promo::create([
            'gambar' => 'promo.jpg',
            'namaPromo' => 'Promo F',
            'jenisPromo' => 'Diskon',
            'kode' => 'PROMOF',
            'diskon' => 15000,
            'deskripsi' => 'Deskripsi Promo',
            'tanggalMulai' => Carbon::now()->format('Y-m-d'),
            'tanggalSelesai' => Carbon::now()->addDays(5)->format('Y-m-d'),
            'minimalTransaksi' => 50000,
            'status' => false, // Tidak Aktif
            'idKategori' => $kategori->idKategori,
            'idProduk' => $produk->idProduk
        ]);

        $response = $this->getJson('/api/customer/promo');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonPath('data.0.namaPromo', 'Promo E')
                 ->assertJsonMissing(['namaPromo' => 'Promo F']);
    }
}

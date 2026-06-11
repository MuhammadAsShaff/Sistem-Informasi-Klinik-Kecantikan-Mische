<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\KategoriProduk;

class KategoriProdukApiTest extends TestCase
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
}

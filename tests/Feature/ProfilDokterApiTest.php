<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\ProfilDokter;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProfilDokterApiTest extends TestCase
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

    public function test_admin_bisa_menambah_dokter_baru()
    {
        $token = $this->getAdminToken();
        Storage::fake('public');

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/admin/doctors', [
            'nama' => 'Dr. Budi',
            'foto' => UploadedFile::fake()->image('foto_budi.jpg'),
            'email' => 'budi@mische.com',
            'deskripsi' => 'Dokter spesialis kulit'
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('profilDokter', [
            'email' => 'budi@mische.com'
        ]);
    }

    public function test_admin_bisa_melihat_semua_dokter()
    {
        $token = $this->getAdminToken();

        ProfilDokter::create([
            'nama' => 'Dr. A',
            'foto' => 'a.jpg',
            'email' => 'a@dokter.com',
            'deskripsi' => 'Dokter A'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/admin/doctors');

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
    }

    public function test_admin_bisa_memperbarui_data_dokter()
    {
        $token = $this->getAdminToken();
        Storage::fake('public');

        $dokter = ProfilDokter::create([
            'nama' => 'Dr. Cici',
            'foto' => 'foto_cici.jpg',
            'email' => 'cici@mische.com',
            'deskripsi' => 'Dokter'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->putJson("/api/admin/doctors/{$dokter->idDokter}", [
            'nama' => 'Dr. Cici Updated',
            'foto' => UploadedFile::fake()->image('foto_cici_updated.jpg'),
            'email' => 'cici_new@mische.com',
            'deskripsi' => 'Dokter spesialis'
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('profilDokter', [
            'nama' => 'Dr. Cici Updated'
        ]);
    }

    public function test_admin_bisa_menghapus_data_dokter()
    {
        $token = $this->getAdminToken();

        $dokter = ProfilDokter::create([
            'nama' => 'Dr. B',
            'foto' => 'b.jpg',
            'email' => 'b@dokter.com',
            'deskripsi' => 'Dokter B'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->deleteJson("/api/admin/doctors/{$dokter->idDokter}");

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('profilDokter', [
            'idDokter' => $dokter->idDokter
        ]);
    }

    public function test_publik_bisa_melihat_semua_dokter()
    {
        ProfilDokter::create([
            'nama' => 'Dr. C',
            'foto' => 'c.jpg',
            'email' => 'c@dokter.com',
            'deskripsi' => 'Dokter C'
        ]);

        $response = $this->getJson('/api/customer/doctors');

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
    }

    public function test_publik_bisa_melihat_detail_dokter()
    {
        $dokter = ProfilDokter::create([
            'nama' => 'Dr. D',
            'foto' => 'd.jpg',
            'email' => 'd@dokter.com',
            'deskripsi' => 'Dokter D'
        ]);

        $response = $this->getJson("/api/customer/doctors/{$dokter->idDokter}");

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonPath('data.nama', 'Dr. D');
    }

    public function test_admin_bisa_memperbarui_status_dokter()
    {
        $token = $this->getAdminToken();

        $dokter = ProfilDokter::create([
            'nama' => 'Dr. E',
            'foto' => 'e.jpg',
            'email' => 'e@dokter.com',
            'deskripsi' => 'Dokter E'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->patchJson("/api/admin/doctors/{$dokter->idDokter}/status", [
            'status' => 'Tidak Tersedia'
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('profilDokter', [
            'idDokter' => $dokter->idDokter,
            'status' => 'Tidak Tersedia'
        ]);
    }
}

<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\ProfilDokter;

class ProfilDokterApiTest extends TestCase
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

    public function test_admin_bisa_menambah_dokter_baru()
    {
        $token = $this->getAdminToken();

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/admin/doctors', [
            'nama' => 'Dr. Dummy Baru',
            'foto' => 'dummy_baru.jpg',
            'email' => 'dummybaru@dokter.com',
            'deskripsi' => 'Dokter spesialis kulit'
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('profilDokter', [
            'email' => 'dummybaru@dokter.com'
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

        $dokter = ProfilDokter::create([
            'nama' => 'Dr. A',
            'foto' => 'a.jpg',
            'email' => 'a@dokter.com',
            'deskripsi' => 'Dokter A'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->putJson("/api/admin/doctors/{$dokter->idDokter}", [
            'nama' => 'Dr. A Updated',
            'foto' => 'a_updated.jpg',
            'email' => 'a_updated@dokter.com',
            'deskripsi' => 'Dokter A Updated'
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('profilDokter', [
            'nama' => 'Dr. A Updated'
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
}

<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Kegiatan;

class KegiatanApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Membantu membuat akun Admin dan menghasilkan Token JWT
     */
    private function getAdminToken()
    {
        $admin = User::create([
            'nama' => 'Admin Tester', 'alamat' => 'Jl. Admin', 'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1990-01-01', 'role' => 'admin', 'email' => 'admin.kegiatan@mische.com',
            'nomorWa' => '08123456789', 'password' => bcrypt('password123')
        ]);
        return auth('api')->login($admin);
    }

    public function test_public_bisa_melihat_daftar_kegiatan()
    {
        Kegiatan::create(['namaKegiatan' => 'Test Kegiatan', 'deskripsi' => 'Deskripsi', 'tanggalKegiatan' => '2026-01-01', 'foto' => 'default.png']);
        
        $response = $this->getJson('/api/customer/kegiatan');
        $response->assertStatus(200);
    }

    public function test_admin_bisa_menambah_kegiatan_baru()
    {
        $token = $this->getAdminToken();
        
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/admin/kegiatan', [
                'namaKegiatan' => 'Kegiatan Baru',
                'deskripsi' => 'Deskripsi kegiatan baru yang seru',
                'tanggalKegiatan' => '2026-12-12'
            ]);
            
        $response->assertStatus(201)
                 ->assertJson(['success' => true]);
    }
}

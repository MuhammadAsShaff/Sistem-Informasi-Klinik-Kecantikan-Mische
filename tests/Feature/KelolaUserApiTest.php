<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class KelolaUserApiTest extends TestCase
{
    use RefreshDatabase;

    private function getAdminToken()
    {
        $admin = User::create([
            'nama' => 'Admin Tester', 'alamat' => 'Jl. Admin', 'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1990-01-01', 'role' => 'admin', 'email' => 'admin.users@mische.com',
            'nomorWa' => '08123456789', 'password' => bcrypt('password123')
        ]);
        return auth('api')->login($admin);
    }

    public function test_admin_bisa_melihat_semua_pengguna()
    {
        $token = $this->getAdminToken();
        
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->getJson('/api/admin/users');
            
        $response->assertStatus(200);
    }

    public function test_admin_bisa_mendaftarkan_pengguna_baru_secara_manual()
    {
        $token = $this->getAdminToken();
        
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/admin/users', [
                'nama' => 'Pasien Baru',
                'alamat' => 'Jl. Pasien',
                'jenisKelamin' => 'Laki-laki',
                'tanggalLahir' => '2000-01-01',
                'role' => 'Customer',
                'email' => 'pasien.baru@mische.com',
                'nomorWa' => '08111222333',
                'password' => 'SandiKuat123!'
            ]);
            
        $response->assertStatus(201)
                 ->assertJson(['success' => true]);
    }
}

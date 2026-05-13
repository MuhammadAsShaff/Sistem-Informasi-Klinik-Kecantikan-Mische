<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class ProfilAdminApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_bisa_melihat_profilnya_sendiri()
    {
        $admin = User::create([
            'nama' => 'Admin Tester', 'alamat' => 'Jl. Admin', 'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1990-01-01', 'role' => 'admin', 'email' => 'admin.profil@mische.com',
            'nomorWa' => '08123456789', 'password' => bcrypt('password123')
        ]);
        
        $token = auth('api')->login($admin);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->getJson('/api/admin/profile');
            
        $response->assertStatus(200)
                 ->assertJsonPath('data.email', 'admin.profil@mische.com');
    }
}

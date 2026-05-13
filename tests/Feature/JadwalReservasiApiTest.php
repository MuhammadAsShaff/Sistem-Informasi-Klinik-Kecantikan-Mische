<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class JadwalReservasiApiTest extends TestCase
{
    use RefreshDatabase;

    private function getAdminToken()
    {
        $admin = User::create([
            'nama' => 'Admin Tester', 'alamat' => 'Jl. Admin', 'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1990-01-01', 'role' => 'admin', 'email' => 'admin.jadwal@mische.com',
            'nomorWa' => '08123456789', 'password' => bcrypt('password123')
        ]);
        return auth('api')->login($admin);
    }

    public function test_admin_bisa_menambah_jadwal_baru()
    {
        $token = $this->getAdminToken();
        
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/admin/schedules', [
                'jamMulai' => '08:00',
                'jamSelesai' => '10:00'
            ]);
            
        $response->assertStatus(201)
                 ->assertJson(['success' => true]);
    }

    public function test_admin_gagal_menambah_jadwal_jika_jam_selesai_lebih_awal()
    {
        $token = $this->getAdminToken();
        
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/admin/schedules', [
                'jamMulai' => '10:00',
                'jamSelesai' => '08:00' // Sengaja disalahkan (mundur)
            ]);
            
        $response->assertStatus(400)
                 ->assertJson(['success' => false]);
    }
}

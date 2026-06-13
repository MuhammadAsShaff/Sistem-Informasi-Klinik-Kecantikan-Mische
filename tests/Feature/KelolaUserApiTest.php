<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class KelolaUserApiTest extends TestCase
{
    use RefreshDatabase;

    private function getAdminToken()
    {
        $admin = User::create([
            'nama' => 'Admin Utama', 'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1990-01-01', 'role' => 'admin', 'email' => 'admin.kelola@mische.com',
            'nomorWa' => '08123456789', 'password' => bcrypt('password123')
        ]);
        return auth('api')->login($admin);
    }

    public function test_admin_bisa_melihat_semua_pengguna_dengan_paginasi()
    {
        $token = $this->getAdminToken();
        
        // Buat 5 user tambahan
        for ($i = 0; $i < 5; $i++) {
            User::create([
                'nama' => "User $i", 'jenisKelamin' => 'Laki-laki',
                'tanggalLahir' => '1990-01-01', 'role' => 'customer', 'email' => "user$i@example.com",
                'nomorWa' => '08123456789', 'password' => bcrypt('password123')
            ]);
        }

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->getJson('/api/admin/users');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonStructure(['data' => ['data', 'current_page', 'last_page']]);
    }

    public function test_admin_bisa_mendaftarkan_pengguna_baru_secara_manual()
    {
        $token = $this->getAdminToken();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/admin/users', [
                'nama' => 'Pasien Baru',
                
                'jenisKelamin' => 'Laki-laki',
                'tanggalLahir' => '2000-01-01',
                'role' => 'customer',
                'email' => 'pasien@example.com',
                'nomorWa' => '08987654321',
                'password' => 'Password123'
            ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('user', [
            'email' => 'pasien@example.com',
            'nama' => 'Pasien Baru'
        ]);
    }

    public function test_admin_gagal_mendaftarkan_pengguna_tanpa_data_lengkap()
    {
        $token = $this->getAdminToken();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/admin/users', [
                'nama' => 'Pasien Baru'
            ]);

        $response->assertStatus(400)
                 ->assertJson(['success' => false])
                 ->assertJsonStructure(['errors']);
    }

    public function test_admin_bisa_memperbarui_data_pengguna()
    {
        $token = $this->getAdminToken();
        $user = User::create([
            'nama' => 'User Lama', 'jenisKelamin' => 'Laki-laki',
            'tanggalLahir' => '2000-01-01', 'role' => 'customer', 'email' => 'lama@example.com',
            'nomorWa' => '08987654321', 'password' => Hash::make('password123')
        ]);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->putJson('/api/admin/users/' . $user->idUser, [
                'nama' => 'User Update',
                
            ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('user', [
            'idUser' => $user->idUser,
            'nama' => 'User Update',
            
        ]);
    }

    public function test_admin_gagal_memperbarui_data_pengguna_dengan_email_sudah_ada()
    {
        $token = $this->getAdminToken();
        $user1 = User::create([
            'nama' => 'User Satu', 'jenisKelamin' => 'Laki-laki',
            'tanggalLahir' => '2000-01-01', 'role' => 'customer', 'email' => 'satu@example.com',
            'nomorWa' => '08987654321', 'password' => Hash::make('password123')
        ]);
        
        $user2 = User::create([
            'nama' => 'User Dua', 'jenisKelamin' => 'Laki-laki',
            'tanggalLahir' => '2000-01-01', 'role' => 'customer', 'email' => 'dua@example.com',
            'nomorWa' => '08987654321', 'password' => Hash::make('password123')
        ]);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->putJson('/api/admin/users/' . $user2->idUser, [
                'email' => 'satu@example.com' // Email user 1
            ]);

        $response->assertStatus(400)
                 ->assertJson(['success' => false])
                 ->assertJsonStructure(['errors' => ['email']]);
    }

    public function test_admin_bisa_menghapus_pengguna()
    {
        $token = $this->getAdminToken();
        $user = User::create([
            'nama' => 'User Hapus', 'jenisKelamin' => 'Laki-laki',
            'tanggalLahir' => '2000-01-01', 'role' => 'customer', 'email' => 'hapus@example.com',
            'nomorWa' => '08987654321', 'password' => Hash::make('password123')
        ]);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->deleteJson('/api/admin/users/' . $user->idUser);

        $response->assertStatus(204);

        $this->assertDatabaseMissing('user', [
            'idUser' => $user->idUser
        ]);
    }

    public function test_admin_gagal_menghapus_pengguna_yang_tidak_ada()
    {
        $token = $this->getAdminToken();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->deleteJson('/api/admin/users/999');

        $response->assertStatus(404)
                 ->assertJson(['success' => false]);
    }
}

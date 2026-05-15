<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ProfilAdminApiTest extends TestCase
{
    use RefreshDatabase;

    private function getAdminTokenAndUser()
    {
        $admin = User::create([
            'nama' => 'Admin Ganteng', 'alamat' => 'Jl. Admin', 'jenisKelamin' => 'Laki-laki',
            'tanggalLahir' => '1990-01-01', 'role' => 'admin', 'email' => 'admin.ganteng@mische.com',
            'nomorWa' => '08123456789', 'password' => bcrypt('password123')
        ]);
        $token = auth('api')->login($admin);
        return [$token, $admin];
    }

    public function test_admin_bisa_melihat_profilnya_sendiri()
    {
        [$token, $admin] = $this->getAdminTokenAndUser();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->getJson('/api/admin/profile');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonPath('data.email', $admin->email);
    }

    public function test_admin_bisa_memperbarui_profilnya_sendiri()
    {
        [$token, $admin] = $this->getAdminTokenAndUser();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->putJson('/api/admin/profile', [
                'nama' => 'Admin Update',
                'alamat' => 'Jl. Update',
                'jenisKelamin' => 'Laki-laki',
                'tanggalLahir' => '1990-01-01',
                'email' => 'admin.update@mische.com',
                'nomorWa' => '08111222333'
            ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('user', [
            'idUser' => $admin->idUser,
            'nama' => 'Admin Update',
            'email' => 'admin.update@mische.com'
        ]);
    }

    public function test_admin_bisa_mengubah_password_saat_update_profil()
    {
        [$token, $admin] = $this->getAdminTokenAndUser();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->putJson('/api/admin/profile', [
                'nama' => 'Admin Update',
                'alamat' => 'Jl. Update',
                'jenisKelamin' => 'Laki-laki',
                'tanggalLahir' => '1990-01-01',
                'email' => 'admin.update2@mische.com',
                'nomorWa' => '08111222333',
                'password' => 'PasswordBaru123'
            ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        // Verifikasi password terganti
        $userDiDb = User::find($admin->idUser);
        $this->assertTrue(Hash::check('PasswordBaru123', $userDiDb->password));
    }

    public function test_admin_gagal_memperbarui_profil_jika_format_salah()
    {
        [$token, $admin] = $this->getAdminTokenAndUser();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->putJson('/api/admin/profile', [
                'nama' => 'Admin Update'
                // Kurang parameter wajib lainnya
            ]);

        $response->assertStatus(400)
                 ->assertJson(['success' => false])
                 ->assertJsonStructure(['errors']);
    }
}

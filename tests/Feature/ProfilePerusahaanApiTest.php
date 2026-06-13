<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use App\Models\User;
use App\Models\ProfilPerusahaan;

class ProfilePerusahaanApiTest extends TestCase
{
    use RefreshDatabase;

    private function getAdminToken()
    {
        $admin = User::create([
            'nama' => 'Admin Klinik', 'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1990-01-01', 'role' => 'admin', 'email' => 'admin.klinik@mische.com',
            'nomorWa' => '08123456789', 'password' => bcrypt('password123')
        ]);
        return auth('api')->login($admin);
    }

    public function test_public_bisa_melihat_profil_perusahaan()
    {
        ProfilPerusahaan::create([
            'visi' => 'Menjadi klinik terbaik',
            'misi' => 'Memberikan layanan terbaik',
            'fotoPerusahaan' => 'profil_perusahaan/default.png',
            'deskripsiPerusahaan' => 'Klinik Kecantikan Mische',
            'nomorCustomerService' => '081234567890',
            'jamBuka' => '08:00:00',
            'jamTutup' => '20:00:00'
        ]);

        $response = $this->getJson('/api/customer/clinic');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonStructure(['data' => ['visi', 'misi', 'deskripsiPerusahaan']]);
    }

    public function test_public_mendapat_404_jika_profil_belum_ada()
    {
        $response = $this->getJson('/api/customer/clinic');

        $response->assertStatus(404)
                 ->assertJson(['success' => false]);
    }

    public function test_admin_bisa_melihat_profil_perusahaan()
    {
        $token = $this->getAdminToken();

        ProfilPerusahaan::create([
            'visi' => 'Menjadi klinik terbaik',
            'misi' => 'Memberikan layanan terbaik',
            'fotoPerusahaan' => 'profil_perusahaan/default.png',
            'deskripsiPerusahaan' => 'Klinik Kecantikan Mische',
            'nomorCustomerService' => '081234567890',
            'jamBuka' => '08:00:00',
            'jamTutup' => '20:00:00'
        ]);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->getJson('/api/admin/clinic');

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
    }

    public function test_admin_bisa_membuat_profil_perusahaan_baru()
    {
        Storage::fake('public');
        $token = $this->getAdminToken();

        $file = UploadedFile::fake()->image('klinik.jpg');

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/admin/clinic', [
                'visi' => 'Visi Baru',
                'misi' => 'Misi Baru',
                'fotoPerusahaan' => $file,
                'deskripsiPerusahaan' => 'Klinik Baru',
                'nomorCustomerService' => '08111222333',
                'jamBuka' => '09:00',
                'jamTutup' => '17:00'
            ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('profilperusahaan', [
            'visi' => 'Visi Baru',
            'deskripsiPerusahaan' => 'Klinik Baru'
        ]);
    }

    public function test_admin_gagal_membuat_profil_perusahaan_tanpa_foto()
    {
        $token = $this->getAdminToken();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/admin/clinic', [
                'visi' => 'Visi Baru',
                'misi' => 'Misi Baru',
                'deskripsiPerusahaan' => 'Klinik Baru',
                'nomorCustomerService' => '08111222333',
                'jamBuka' => '09:00',
                'jamTutup' => '17:00'
            ]);

        $response->assertStatus(400)
                 ->assertJson(['success' => false])
                 ->assertJsonStructure(['error' => ['fotoPerusahaan']]);
    }

    public function test_admin_bisa_memperbarui_profil_perusahaan()
    {
        $token = $this->getAdminToken();
        $profil = ProfilPerusahaan::create([
            'visi' => 'Visi Lama',
            'misi' => 'Misi Lama',
            'fotoPerusahaan' => 'profil_perusahaan/lama.png',
            'deskripsiPerusahaan' => 'Klinik Lama',
            'nomorCustomerService' => '081234567890',
            'jamBuka' => '08:00:00',
            'jamTutup' => '20:00:00'
        ]);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->putJson('/api/admin/clinic/' . $profil->idProfil, [
                'visi' => 'Visi Update',
                'misi' => 'Misi Update',
                'deskripsiPerusahaan' => 'Klinik Update',
                'nomorCustomerService' => '08111222333',
                'jamBuka' => '09:00',
                'jamTutup' => '21:00'
            ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('profilperusahaan', [
            'idProfil' => $profil->idProfil,
            'visi' => 'Visi Update'
        ]);
    }

    public function test_admin_bisa_menghapus_profil_perusahaan()
    {
        $token = $this->getAdminToken();
        $profil = ProfilPerusahaan::create([
            'visi' => 'Visi Hapus',
            'misi' => 'Misi Hapus',
            'fotoPerusahaan' => 'profil_perusahaan/hapus.png',
            'deskripsiPerusahaan' => 'Klinik Hapus',
            'nomorCustomerService' => '081234567890',
            'jamBuka' => '08:00:00',
            'jamTutup' => '20:00:00'
        ]);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->deleteJson('/api/admin/clinic/' . $profil->idProfil);

        $response->assertStatus(204);

        $this->assertDatabaseMissing('profilperusahaan', [
            'idProfil' => $profil->idProfil
        ]);
    }
}

<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use App\Models\User;
use App\Models\Kegiatan;

class KegiatanApiTest extends TestCase
{
    use RefreshDatabase;

    private function getAdminToken()
    {
        $admin = User::create([
            'nama' => 'Admin Tester', 'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1990-01-01', 'role' => 'admin', 'email' => 'admin.kegiatan@mische.com',
            'nomorWa' => '08123456789', 'password' => bcrypt('password123')
        ]);
        return auth('api')->login($admin);
    }

    public function test_public_bisa_melihat_daftar_kegiatan()
    {
        Kegiatan::create([
            'namaKegiatan' => 'Promo Lebaran',
            'deskripsi' => 'Diskon 50% untuk semua treatment',
            'tanggalKegiatan' => '2024-04-10',
            'foto' => 'kegiatan/default.png'
        ]);

        $response = $this->getJson('/api/customer/kegiatan');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(1, 'data');
    }

    public function test_public_mendapat_404_jika_tidak_ada_kegiatan()
    {
        $response = $this->getJson('/api/customer/kegiatan');

        $response->assertStatus(404)
                 ->assertJson(['success' => false, 'message' => 'Tidak ada data kegiatan yang tersedia.']);
    }

    public function test_admin_bisa_melihat_semua_kegiatan()
    {
        $token = $this->getAdminToken();

        Kegiatan::create([
            'namaKegiatan' => 'Promo Lebaran',
            'deskripsi' => 'Diskon 50%',
            'tanggalKegiatan' => '2024-04-10',
            'foto' => 'kegiatan/default.png'
        ]);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->getJson('/api/admin/kegiatan');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(1, 'data');
    }

    public function test_admin_bisa_menambah_kegiatan_baru()
    {
        Storage::fake('public');
        $token = $this->getAdminToken();

        $file = UploadedFile::fake()->image('kegiatan.jpg');

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/admin/kegiatan', [
                'namaKegiatan' => 'Kegiatan Baru',
                'deskripsi' => 'Deskripsi kegiatan baru',
                'tanggalKegiatan' => '2024-12-01',
                'foto' => $file
            ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('kegiatan', [
            'namaKegiatan' => 'Kegiatan Baru',
            'deskripsi' => 'Deskripsi kegiatan baru'
        ]);
    }

    public function test_admin_gagal_menambah_kegiatan_tanpa_field_wajib()
    {
        $token = $this->getAdminToken();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/admin/kegiatan', [
                'namaKegiatan' => 'Kegiatan Baru'
            ]);

        $response->assertStatus(400)
                 ->assertJson(['success' => false])
                 ->assertJsonStructure(['errors' => ['deskripsi', 'tanggalKegiatan']]);
    }

    public function test_admin_bisa_memperbarui_kegiatan()
    {
        $token = $this->getAdminToken();
        $kegiatan = Kegiatan::create([
            'namaKegiatan' => 'Promo Lama',
            'deskripsi' => 'Diskon 10%',
            'tanggalKegiatan' => '2024-01-01',
            'foto' => 'kegiatan/lama.png'
        ]);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->putJson('/api/admin/kegiatan/' . $kegiatan->idKegiatan, [
                'namaKegiatan' => 'Promo Baru',
                'deskripsi' => 'Diskon 20%',
                'tanggalKegiatan' => '2024-02-01'
            ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('kegiatan', [
            'idKegiatan' => $kegiatan->idKegiatan,
            'namaKegiatan' => 'Promo Baru',
            'deskripsi' => 'Diskon 20%'
        ]);
    }

    public function test_admin_bisa_menghapus_kegiatan()
    {
        $token = $this->getAdminToken();
        $kegiatan = Kegiatan::create([
            'namaKegiatan' => 'Promo Hapus',
            'deskripsi' => 'Diskon 10%',
            'tanggalKegiatan' => '2024-01-01',
            'foto' => 'kegiatan/hapus.png'
        ]);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->deleteJson('/api/admin/kegiatan/' . $kegiatan->idKegiatan);

        $response->assertStatus(204);

        $this->assertDatabaseMissing('kegiatan', [
            'idKegiatan' => $kegiatan->idKegiatan
        ]);
    }

    public function test_admin_gagal_menghapus_kegiatan_tidak_ada()
    {
        $token = $this->getAdminToken();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->deleteJson('/api/admin/kegiatan/999');

        $response->assertStatus(404)
                 ->assertJson(['success' => false]);
    }
}

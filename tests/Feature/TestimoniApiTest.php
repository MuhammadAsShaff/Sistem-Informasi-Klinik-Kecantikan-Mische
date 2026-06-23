<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\User;
use App\Models\Testimoni;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;

class TestimoniApiTest extends TestCase
{
    use RefreshDatabase;

    private function getAdminToken()
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

    public function test_admin_bisa_menambah_testimoni()
    {
        $token = $this->getAdminToken();
        Storage::fake('public');

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/admin/testimonials', [
            'namaTester' => 'Andi',
            'jenisTestimoni' => 'Facial',
            'deskripsi' => 'Mantap',
            'tanggalTreatment' => '2025-01-01',
            'buktiFoto' => UploadedFile::fake()->image('testi.jpg')
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('testimoni', [
            'namaTester' => 'Andi'
        ]);
    }

    public function test_admin_bisa_melihat_semua_testimoni()
    {
        $token = $this->getAdminToken();
        Testimoni::create([
            'namaTester' => 'Budi',
            'jenisTestimoni' => 'Laser',
            'deskripsi' => 'Bagus',
            'tanggalTreatment' => '2025-02-01',
            'buktiFoto' => 'testimoni/budi.jpg'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/admin/testimonials');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonFragment(['namaTester' => 'Budi']);
    }

    public function test_admin_bisa_melihat_detail_testimoni()
    {
        $token = $this->getAdminToken();
        $testimoni = Testimoni::create([
            'namaTester' => 'Budi Detail',
            'jenisTestimoni' => 'Laser',
            'deskripsi' => 'Bagus Sekali',
            'tanggalTreatment' => '2025-02-01',
            'buktiFoto' => 'testimoni/budi.jpg'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson("/api/admin/testimonials/{$testimoni->idTestimoni}");

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonFragment(['namaTester' => 'Budi Detail']);
    }

    public function test_admin_bisa_memperbarui_testimoni()
    {
        $token = $this->getAdminToken();
        Storage::fake('public');

        $testimoni = Testimoni::create([
            'namaTester' => 'Cici',
            'jenisTestimoni' => 'Peeling',
            'deskripsi' => 'Oke',
            'tanggalTreatment' => '2025-03-01',
            'buktiFoto' => 'testimoni/cici.jpg'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->putJson("/api/admin/testimonials/{$testimoni->idTestimoni}", [
            'namaTester' => 'Cici Updated',
            'jenisTestimoni' => 'Peeling',
            'deskripsi' => 'Sangat Oke',
            'tanggalTreatment' => '2025-03-01',
            'buktiFoto' => UploadedFile::fake()->image('cici_updated.jpg')
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('testimoni', [
            'namaTester' => 'Cici Updated'
        ]);
    }

    public function test_admin_bisa_menghapus_testimoni()
    {
        $token = $this->getAdminToken();

        $testimoni = Testimoni::create([
            'namaTester' => 'Didi',
            'jenisTestimoni' => 'Facial',
            'deskripsi' => 'Sip',
            'tanggalTreatment' => '2025-04-01',
            'buktiFoto' => 'testimoni/didi.jpg'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->deleteJson("/api/admin/testimonials/{$testimoni->idTestimoni}");

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('testimoni', [
            'idTestimoni' => $testimoni->idTestimoni
        ]);
    }

    public function test_publik_bisa_melihat_testimoni()
    {
        Testimoni::create([
            'namaTester' => 'Eka',
            'jenisTestimoni' => 'Laser',
            'deskripsi' => 'Keren',
            'tanggalTreatment' => '2025-05-01',
            'buktiFoto' => 'testimoni/eka.jpg'
        ]);

        $response = $this->getJson('/api/customer/testimonials');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonFragment(['namaTester' => 'Eka']);
    }
}

<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\JadwalReservasi;

class JadwalReservasiApiTest extends TestCase
{
    use RefreshDatabase;

    private function getAdminToken()
    {
        $admin = User::create([
            'nama' => 'Admin Tester', 'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1990-01-01', 'role' => 'admin', 'email' => 'admin.jadwal@mische.com',
            'nomorWa' => '08123456789', 'password' => bcrypt('password123')
        ]);
        return auth('api')->login($admin);
    }

    public function test_admin_bisa_melihat_semua_jadwal_reservasi()
    {
        $token = $this->getAdminToken();

        JadwalReservasi::create(['jamMulai' => '08:00:00', 'jamSelesai' => '10:00:00']);
        JadwalReservasi::create(['jamMulai' => '11:00:00', 'jamSelesai' => '13:00:00']);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->getJson('/api/admin/schedules');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(2, 'data');
    }

    public function test_publik_bisa_melihat_jadwal_reservasi()
    {
        JadwalReservasi::create(['jamMulai' => '08:00:00', 'jamSelesai' => '10:00:00']);

        $response = $this->getJson('/api/customer/schedules');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(1, 'data');
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
                 
        $this->assertDatabaseHas('jadwalreservasi', [
            'jamMulai' => '08:00',
            'jamSelesai' => '10:00'
        ]);
    }

    public function test_admin_gagal_menambah_jadwal_dengan_format_salah()
    {
        $token = $this->getAdminToken();
        
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/admin/schedules', [
                'jamMulai' => '8 AM', // Format salah
                'jamSelesai' => '10 AM'
            ]);
            
        $response->assertStatus(400)
                 ->assertJson(['success' => false])
                 ->assertJsonStructure(['errors' => ['jamMulai', 'jamSelesai']]);
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
                 ->assertJson(['success' => false, 'message' => 'Jam Selesai harus lebih besar dari Jam Mulai!']);
    }

    public function test_admin_bisa_memperbarui_jadwal_reservasi()
    {
        $token = $this->getAdminToken();
        $jadwal = JadwalReservasi::create(['jamMulai' => '08:00:00', 'jamSelesai' => '10:00:00']);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->putJson('/api/admin/schedules/' . $jadwal->idJadwal, [
                'jamMulai' => '09:00',
                'jamSelesai' => '11:00'
            ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('jadwalreservasi', [
            'idJadwal' => $jadwal->idJadwal,
            'jamMulai' => '09:00', // Controller uses format without seconds during update usually, let's see. Or 09:00:00
            'jamSelesai' => '11:00' 
        ]);
    }

    public function test_admin_gagal_memperbarui_jadwal_dengan_jam_selesai_lebih_awal()
    {
        $token = $this->getAdminToken();
        $jadwal = JadwalReservasi::create(['jamMulai' => '08:00:00', 'jamSelesai' => '10:00:00']);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->putJson('/api/admin/schedules/' . $jadwal->idJadwal, [
                'jamMulai' => '12:00',
                'jamSelesai' => '11:00'
            ]);

        $response->assertStatus(400)
                 ->assertJson(['success' => false, 'message' => 'Jam Selesai harus lebih besar dari Jam Mulai!']);
    }

    public function test_admin_bisa_menghapus_jadwal_reservasi()
    {
        $token = $this->getAdminToken();
        $jadwal = JadwalReservasi::create(['jamMulai' => '08:00:00', 'jamSelesai' => '10:00:00']);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->deleteJson('/api/admin/schedules/' . $jadwal->idJadwal);

        $response->assertStatus(204);
        
        $this->assertDatabaseMissing('jadwalreservasi', [
            'idJadwal' => $jadwal->idJadwal
        ]);
    }

    public function test_admin_gagal_menghapus_jadwal_yang_tidak_ada()
    {
        $token = $this->getAdminToken();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->deleteJson('/api/admin/schedules/999');

        $response->assertStatus(404)
                 ->assertJson(['success' => false, 'message' => 'Data jadwal tidak ditemukan']);
    }
}

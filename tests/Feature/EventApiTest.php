<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Event;
use Carbon\Carbon;

class EventApiTest extends TestCase
{
    use RefreshDatabase;

    protected function getAdminToken()
    {
        $admin = User::create([
            'nama' => 'Admin Test',
            'alamat' => 'Jl. Admin Test',
            'jenisKelamin' => 'Laki-Laki',
            'tanggalLahir' => '1990-01-01',
            'role' => 'admin',
            'email' => 'admin@test.com',
            'nomorWa' => '08111222333',
            'password' => bcrypt('Password123')
        ]);

        return auth('api')->login($admin);
    }

    public function test_admin_bisa_menambah_event_baru()
    {
        $token = $this->getAdminToken();

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/admin/event', [
            'nama' => 'Event A',
            'deskripsi' => 'Deskripsi Event A',
            'foto' => 'foto_a.jpg',
            'tanggalMulai' => Carbon::now()->format('Y-m-d'),
            'tanggalSelesai' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'lokasi' => 'Klinik Pusat'
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('event', [
            'nama' => 'Event A'
        ]);
    }

    public function test_admin_bisa_melihat_semua_event()
    {
        $token = $this->getAdminToken();
        Event::create([
            'nama' => 'Event B',
            'deskripsi' => 'Deskripsi B',
            'foto' => 'foto.jpg',
            'tanggalMulai' => Carbon::now()->format('Y-m-d'),
            'tanggalSelesai' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'lokasi' => 'Klinik Pusat'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/admin/event');

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
    }

    public function test_admin_bisa_memperbarui_event()
    {
        $token = $this->getAdminToken();
        $event = Event::create([
            'nama' => 'Event C',
            'deskripsi' => 'Deskripsi C',
            'foto' => 'foto.jpg',
            'tanggalMulai' => Carbon::now()->format('Y-m-d'),
            'tanggalSelesai' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'lokasi' => 'Klinik Pusat'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->putJson("/api/admin/event/{$event->idEvent}", [
            'nama' => 'Event C Updated',
            'deskripsi' => 'Deskripsi C',
            'foto' => 'foto.jpg',
            'tanggalMulai' => Carbon::now()->format('Y-m-d'),
            'tanggalSelesai' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'lokasi' => 'Klinik Pusat'
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('event', [
            'nama' => 'Event C Updated'
        ]);
    }

    public function test_admin_bisa_menghapus_event()
    {
        $token = $this->getAdminToken();
        $event = Event::create([
            'nama' => 'Event D',
            'deskripsi' => 'Deskripsi D',
            'foto' => 'foto.jpg',
            'tanggalMulai' => Carbon::now()->format('Y-m-d'),
            'tanggalSelesai' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'lokasi' => 'Klinik Pusat'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->deleteJson("/api/admin/event/{$event->idEvent}");

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('event', [
            'idEvent' => $event->idEvent
        ]);
    }

    public function test_publik_bisa_melihat_event()
    {
        Event::create([
            'nama' => 'Event E',
            'deskripsi' => 'Deskripsi E',
            'foto' => 'foto.jpg',
            'tanggalMulai' => Carbon::now()->format('Y-m-d'),
            'tanggalSelesai' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'lokasi' => 'Klinik Pusat'
        ]);

        $response = $this->getJson('/api/customer/event');

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
    }

    public function test_publik_bisa_melihat_detail_event()
    {
        $event = Event::create([
            'nama' => 'Event F',
            'deskripsi' => 'Deskripsi F',
            'foto' => 'foto.jpg',
            'tanggalMulai' => Carbon::now()->format('Y-m-d'),
            'tanggalSelesai' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'lokasi' => 'Klinik Pusat'
        ]);

        $response = $this->getJson("/api/customer/event/{$event->idEvent}");

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonPath('data.nama', 'Event F');
    }
}

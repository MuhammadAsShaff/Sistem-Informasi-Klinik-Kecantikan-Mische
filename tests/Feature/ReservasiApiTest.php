<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\ProfilDokter;
use App\Models\JadwalReservasi;
use App\Models\Reservasi;
use Illuminate\Support\Carbon;

class ReservasiApiTest extends TestCase
{
    use RefreshDatabase;

    protected function getAdminToken()
    {
        $admin = User::create([
            'nama' => 'Admin Test',
            
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1990-01-01',
            'role' => 'admin',
            'email' => 'admin_reservasi@example.com',
            'nomorWa' => '08123456789',
            'password' => bcrypt('Password123')
        ]);
        return auth('api')->login($admin);
    }

    protected function getCustomerToken(&$customer = null)
    {
        $customer = User::create([
            'nama' => 'Customer Test',
            
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01',
            'role' => 'customer',
            'email' => 'customer_reservasi@example.com',
            'nomorWa' => '08111222333',
            'password' => bcrypt('Password123')
        ]);
        return auth('api')->login($customer);
    }

    protected function createDummyDependencies(&$dokter, &$jadwal)
    {
        $dokter = ProfilDokter::create([
            'nama' => 'Dr. Dummy',
            'foto' => 'dummy.jpg',
            'email' => 'dokter@dummy.com',
            'deskripsi' => 'Dokter Umum'
        ]);

        $jadwal = JadwalReservasi::create([
            'jamMulai' => '09:00',
            'jamSelesai' => '10:00'
        ]);
    }

    public function test_admin_bisa_melihat_semua_reservasi()
    {
        $token = $this->getAdminToken();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->getJson('/api/admin/reservations');

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
    }

    public function test_customer_bisa_melihat_reservasi_miliknya_sendiri()
    {
        $customer = null;
        $token = $this->getCustomerToken($customer);

        $dokter = null; $jadwal = null;
        $this->createDummyDependencies($dokter, $jadwal);

        Reservasi::create([
            'namaCustomer' => $customer->nama,
            'nomorWa' => $customer->nomorWa,
            'kategoriReservasi' => 'Laser', 'jenisReservasi' => 'Laser Acne',
            'tanggalReservasi' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'status' => 'Menunggu',
            'idUser' => $customer->idUser,
            'idDokter' => $dokter->idDokter,
            'idJadwal' => $jadwal->idJadwal
        ]);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->getJson('/api/customer/reservations');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonPath('data.total', 1);
    }

    public function test_customer_bisa_membuat_reservasi_baru()
    {
        $customer = null;
        $token = $this->getCustomerToken($customer);

        $dokter = null; $jadwal = null;
        $this->createDummyDependencies($dokter, $jadwal);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/customer/reservations', [
                             'kategoriReservasi' => 'Facial', 'jenisReservasi' => 'Facial Treatment',
                             'tanggalReservasi' => Carbon::now()->addDays(3)->format('Y-m-d'),
                             'idDokter' => $dokter->idDokter,
                             'idJadwal' => $jadwal->idJadwal
                         ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('reservasi', [
            'kategoriReservasi' => 'Facial', 'jenisReservasi' => 'Facial Treatment',
            'status' => 'Menunggu'
        ]);
    }

    public function test_reservasi_gagal_jika_jadwal_sudah_dibooking_orang_lain()
    {
        $customer = null;
        $token = $this->getCustomerToken($customer);

        $dokter = null; $jadwal = null;
        $this->createDummyDependencies($dokter, $jadwal);
        
        $tanggal = Carbon::now()->addDays(3)->format('Y-m-d');

        // Buat reservasi pertama (oleh orang lain / customer sendiri)
        Reservasi::create([
            'namaCustomer' => 'Orang Lain',
            'nomorWa' => '0899999999',
            'kategoriReservasi' => 'Facial', 'jenisReservasi' => 'Facial Treatment',
            'tanggalReservasi' => $tanggal,
            'status' => 'Menunggu',
            'idUser' => $customer->idUser, // anggap aja
            'idDokter' => $dokter->idDokter,
            'idJadwal' => $jadwal->idJadwal
        ]);

        // Customer mencoba booking di waktu yang sama
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/customer/reservations', [
                             'kategoriReservasi' => 'Facial', 'jenisReservasi' => 'Facial Glowing',
                             'tanggalReservasi' => $tanggal,
                             'idDokter' => $dokter->idDokter,
                             'idJadwal' => $jadwal->idJadwal
                         ]);

        $response->assertStatus(400)
                 ->assertJson(['success' => false, 'message' => 'Jadwal dokter pada waktu tersebut sudah penuh dipesan.']);
    }

    public function test_customer_bisa_melihat_detail_reservasinya()
    {
        $customer = null;
        $token = $this->getCustomerToken($customer);

        $dokter = null; $jadwal = null;
        $this->createDummyDependencies($dokter, $jadwal);

        $reservasi = Reservasi::create([
            'namaCustomer' => $customer->nama,
            'nomorWa' => $customer->nomorWa,
            'kategoriReservasi' => 'Laser', 'jenisReservasi' => 'Laser Acne',
            'tanggalReservasi' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'status' => 'Menunggu',
            'idUser' => $customer->idUser,
            'idDokter' => $dokter->idDokter,
            'idJadwal' => $jadwal->idJadwal
        ]);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->getJson("/api/customer/reservations/{$reservasi->idReservasi}");

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonPath('data.jenisReservasi', 'Laser Acne')->assertJsonPath('data.kategoriReservasi', 'Laser');
    }

    public function test_customer_bisa_merubah_jadwal_reservasi_hanya_sekali()
    {
        $customer = null;
        $token = $this->getCustomerToken($customer);

        $dokter = null; $jadwal = null;
        $this->createDummyDependencies($dokter, $jadwal);

        $reservasi = Reservasi::create([
            'namaCustomer' => $customer->nama,
            'nomorWa' => $customer->nomorWa,
            'kategoriReservasi' => 'Laser', 'jenisReservasi' => 'Laser Acne',
            'tanggalReservasi' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'status' => 'Dikonfirmasi',
            'idUser' => $customer->idUser,
            'idDokter' => $dokter->idDokter,
            'idJadwal' => $jadwal->idJadwal,
            'is_rescheduled' => false
        ]);

        // Percobaan pertama merubah jadwal (Harus Berhasil)
        $response1 = $this->withHeaders(['Authorization' => "Bearer $token"])
                          ->putJson("/api/customer/reservations/{$reservasi->idReservasi}", [
                              'kategoriReservasi' => 'Laser', 'jenisReservasi' => 'Laser Acne Update',
                              'tanggalReservasi' => Carbon::now()->addDays(5)->format('Y-m-d'),
                              'idDokter' => $dokter->idDokter,
                              'idJadwal' => $jadwal->idJadwal
                          ]);

        $response1->assertStatus(200)
                  ->assertJson(['success' => true]);

        $this->assertDatabaseHas('reservasi', [
            'idReservasi' => $reservasi->idReservasi,
            'status' => 'Dikonfirmasi Merubah Jadwal',
            'is_rescheduled' => 1
        ]);

        // Percobaan kedua merubah jadwal (Harus Gagal)
        $response2 = $this->withHeaders(['Authorization' => "Bearer $token"])
                          ->putJson("/api/customer/reservations/{$reservasi->idReservasi}", [
                              'kategoriReservasi' => 'Laser', 'jenisReservasi' => 'Laser Acne Edit Lagi',
                              'tanggalReservasi' => Carbon::now()->addDays(10)->format('Y-m-d'),
                              'idDokter' => $dokter->idDokter,
                              'idJadwal' => $jadwal->idJadwal
                          ]);

        $response2->assertStatus(403)
                  ->assertJson(['success' => false, 'message' => 'Perubahan jadwal hanya bisa dilakukan maksimal 1 kali.']);
    }

    public function test_admin_bisa_mengubah_status_reservasi()
    {
        $adminToken = $this->getAdminToken();

        $customer = User::create([
            'nama' => 'Customer Test 2',
            
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01',
            'role' => 'customer',
            'email' => 'customer2@example.com',
            'nomorWa' => '08111222444',
            'password' => bcrypt('Password123')
        ]);

        $dokter = null; $jadwal = null;
        $this->createDummyDependencies($dokter, $jadwal);

        $reservasi = Reservasi::create([
            'namaCustomer' => $customer->nama,
            'nomorWa' => $customer->nomorWa,
            'kategoriReservasi' => 'Laser', 'jenisReservasi' => 'Laser Acne',
            'tanggalReservasi' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'status' => 'Menunggu',
            'idUser' => $customer->idUser,
            'idDokter' => $dokter->idDokter,
            'idJadwal' => $jadwal->idJadwal
        ]);

        $response = $this->withHeaders(['Authorization' => "Bearer $adminToken"])
                         ->patchJson("/api/admin/reservations/{$reservasi->idReservasi}", [
                             'status' => 'Dikonfirmasi'
                         ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('reservasi', [
            'idReservasi' => $reservasi->idReservasi,
            'status' => 'Dikonfirmasi'
        ]);
    }

    public function test_admin_bisa_menghapus_reservasi()
    {
        $adminToken = $this->getAdminToken();

        $customer = User::create([
            'nama' => 'Customer Test 3',
            
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01',
            'role' => 'customer',
            'email' => 'customer3@example.com',
            'nomorWa' => '08111222555',
            'password' => bcrypt('Password123')
        ]);

        $dokter = null; $jadwal = null;
        $this->createDummyDependencies($dokter, $jadwal);

        $reservasi = Reservasi::create([
            'namaCustomer' => $customer->nama,
            'nomorWa' => $customer->nomorWa,
            'kategoriReservasi' => 'Laser', 'jenisReservasi' => 'Laser Acne',
            'tanggalReservasi' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'status' => 'Menunggu',
            'idUser' => $customer->idUser,
            'idDokter' => $dokter->idDokter,
            'idJadwal' => $jadwal->idJadwal
        ]);

        $response = $this->withHeaders(['Authorization' => "Bearer $adminToken"])
                         ->deleteJson("/api/admin/reservations/{$reservasi->idReservasi}");

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('reservasi', [
            'idReservasi' => $reservasi->idReservasi
        ]);
    }
}

<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AutentikasiUnitTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Skenario 1: Menguji apakah tamu (Guest) bisa mendaftar akun baru
     */
    public function test_user_bisa_register_akun_baru()
    {
        // Data pendaftaran akun baru
        $payload = [
            'nama' => 'User Tester',
            'alamat' => 'Jl. Testing No. 1',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01',
            'role' => 'Customer',
            'email' => 'testerbaru@mische.com',
            'nomorWa' => '08123456789',
            'password' => 'SandiKuat123!'
        ];

        // Tembak URL pendaftaran
        $response = $this->postJson('/api/auth/register', $payload);

        // Pastikan sukses dibuat (Status 201)
        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Registrasi berhasil!'
            ]);

        // Pastikan email benar-benar masuk ke database
        $this->assertDatabaseHas('user', [
            'email' => 'testerbaru@mische.com'
        ]);
    }

    /**
     * Skenario 2: Menguji login dengan email dan sandi yang benar
     */
    public function test_user_bisa_login_dengan_kredensial_benar()
    {
        // 1. Buat 1 akun dummy di database
        User::create([
            'nama' => 'Login Tester',
            'alamat' => 'Jl. Test',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01',
            'role' => 'Customer',
            'email' => 'loginbenar@mische.com',
            'nomorWa' => '08123456789',
            'password' => Hash::make('SandiKuat123!')
        ]);

        // 2. Tembak endpoint login
        $response = $this->postJson('/api/auth/login', [
            'email' => 'loginbenar@mische.com',
            'password' => 'SandiKuat123!'
        ]);

        // 3. Verifikasi kembalian JSON memuat token JWT
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'token',
                'type',
                'expires_in'
            ]);
    }

    /**
     * Skenario 3: Menguji keamanan jika user salah memasukkan sandi
     */
    public function test_login_gagal_jika_password_salah()
    {
        // 1. Buat akun dummy
        User::create([
            'nama' => 'Login Gagal Tester',
            'alamat' => 'Jl. Test',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01',
            'role' => 'Customer',
            'email' => 'salahsandi@mische.com',
            'nomorWa' => '08123456789',
            'password' => Hash::make('SandiKuat123!')
        ]);

        // 2. Sengaja salahkan sandi saat login
        $response = $this->postJson('/api/auth/login', [
            'email' => 'salahsandi@mische.com',
            'password' => 'SandiSalah000'
        ]);

        // 3. Verifikasi bahwa sistem menolak akses dengan status 401 Unauthorized
        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Email atau password yang Anda masukkan salah.'
            ]);
    }

    /**
     * Skenario 4: Menguji proses Logout yang membutuhkan Token
     */
    public function test_user_bisa_logout_dengan_token()
    {
        // 1. Buat user dummy
        $user = User::create([
            'nama' => 'Logout Tester',
            'alamat' => 'Jl. Test',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01',
            'role' => 'Customer',
            'email' => 'logout@mische.com',
            'nomorWa' => '08123456789',
            'password' => Hash::make('SandiKuat123!')
        ]);

        // 2. Buatkan sesi/Token JWT secara paksa di memori untuk simulasi sudah login
        $token = auth('api')->login($user);

        // 3. Tembak endpoint logout SAMBIL menyematkan Token di kepala (Header) request
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/logout');

        // 4. Pastikan sesi diakhiri dengan mulus
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Sesi Anda berhasil diakhiri (Logout).'
            ]);
    }
}

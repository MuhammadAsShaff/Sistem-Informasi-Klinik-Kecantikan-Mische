<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AutentikasiUnitTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_bisa_register_akun_baru()
    {
        $response = $this->postJson('/api/auth/register', [
            'nama' => 'John Doe',
            'alamat' => 'Jl. Test No 123',
            'jenisKelamin' => 'Laki-laki',
            'tanggalLahir' => '1995-05-15',
            'email' => 'john.doe@example.com',
            'nomorWa' => '081234567890',
            'password' => 'Password123'
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true, 'message' => 'Registrasi berhasil!']);

        $this->assertDatabaseHas('user', [
            'email' => 'john.doe@example.com',
            'role' => 'customer'
        ]);
    }

    public function test_register_gagal_karena_email_sudah_terdaftar()
    {
        User::create([
            'nama' => 'Jane Doe', 'alamat' => 'Jl. Lama', 'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-05-15', 'role' => 'customer', 'email' => 'jane@example.com',
            'nomorWa' => '081234567890', 'password' => Hash::make('Password123')
        ]);

        $response = $this->postJson('/api/auth/register', [
            'nama' => 'Jane Doe 2',
            'alamat' => 'Jl. Baru',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-05-15',
            'email' => 'jane@example.com',
            'nomorWa' => '081234567890',
            'password' => 'Password123'
        ]);

        $response->assertStatus(400)
                 ->assertJsonStructure(['errors' => ['email']]);
    }

    public function test_user_bisa_login_dengan_kredensial_benar()
    {
        User::create([
            'nama' => 'John Login', 'alamat' => 'Jl. Test No 123', 'jenisKelamin' => 'Laki-laki',
            'tanggalLahir' => '1995-05-15', 'role' => 'customer', 'email' => 'login@example.com',
            'nomorWa' => '081234567890', 'password' => Hash::make('Password123')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'login@example.com',
            'password' => 'Password123'
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonStructure(['token', 'type', 'expires_in']);
    }

    public function test_login_gagal_jika_password_salah()
    {
        User::create([
            'nama' => 'John Login', 'alamat' => 'Jl. Test', 'jenisKelamin' => 'Laki-laki',
            'tanggalLahir' => '1995-05-15', 'role' => 'customer', 'email' => 'login2@example.com',
            'nomorWa' => '081234567890', 'password' => Hash::make('Password123')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'login2@example.com',
            'password' => 'SalahPassword'
        ]);

        $response->assertStatus(401)
                 ->assertJson(['success' => false, 'message' => 'Email atau password yang Anda masukkan salah.']);
    }

    public function test_user_bisa_mendapatkan_profil_saat_ini()
    {
        $user = User::create([
            'nama' => 'John Login', 'alamat' => 'Jl. Test', 'jenisKelamin' => 'Laki-laki',
            'tanggalLahir' => '1995-05-15', 'role' => 'customer', 'email' => 'profil@example.com',
            'nomorWa' => '081234567890', 'password' => Hash::make('Password123')
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->getJson('/api/auth/me');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonPath('data.email', 'profil@example.com');
    }

    public function test_gagal_mendapatkan_profil_tanpa_token()
    {
        $response = $this->getJson('/api/auth/me');

        $response->assertStatus(401)
                 ->assertJson(['success' => false]);
    }

    public function test_user_bisa_reset_password()
    {
        $user = User::create([
            'nama' => 'John Login', 'alamat' => 'Jl. Test', 'jenisKelamin' => 'Laki-laki',
            'tanggalLahir' => '1995-05-15', 'role' => 'customer', 'email' => 'reset@example.com',
            'nomorWa' => '081234567890', 'password' => Hash::make('PasswordLama123')
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/auth/reset-password', [
                             'password_lama' => 'PasswordLama123',
                             'password_baru' => 'PasswordBaru123'
                         ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        // Verifikasi password baru dapat digunakan untuk login
        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => 'reset@example.com',
            'password' => 'PasswordBaru123'
        ]);

        $loginResponse->assertStatus(200);
    }

    public function test_reset_password_gagal_jika_password_lama_salah()
    {
        $user = User::create([
            'nama' => 'John Login', 'alamat' => 'Jl. Test', 'jenisKelamin' => 'Laki-laki',
            'tanggalLahir' => '1995-05-15', 'role' => 'customer', 'email' => 'reset2@example.com',
            'nomorWa' => '081234567890', 'password' => Hash::make('PasswordLama123')
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/auth/reset-password', [
                             'password_lama' => 'PasswordSalah123',
                             'password_baru' => 'PasswordBaru123'
                         ]);

        $response->assertStatus(400)
                 ->assertJson(['success' => false, 'message' => 'Pembaruan gagal. Password lama yang Anda ketikkan salah.']);
    }

    public function test_user_bisa_logout_dengan_token()
    {
        $user = User::create([
            'nama' => 'John Login', 'alamat' => 'Jl. Test', 'jenisKelamin' => 'Laki-laki',
            'tanggalLahir' => '1995-05-15', 'role' => 'customer', 'email' => 'logout@example.com',
            'nomorWa' => '081234567890', 'password' => Hash::make('Password123')
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/auth/logout');

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
    }
}

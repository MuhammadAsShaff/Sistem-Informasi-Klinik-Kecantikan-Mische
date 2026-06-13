<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ProfilCustomerApiTest extends TestCase
{
    use RefreshDatabase;

    private function getCustomerTokenAndUser()
    {
        $customer = User::create([
            'nama' => 'Customer Cantik', 'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01', 'role' => 'customer', 'email' => 'customer.cantik@mische.com',
            'nomorWa' => '08123456789', 'password' => bcrypt('password123')
        ]);
        $token = auth('api')->login($customer);
        return [$token, $customer];
    }

    public function test_customer_bisa_melihat_profilnya_sendiri()
    {
        [$token, $customer] = $this->getCustomerTokenAndUser();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->getJson('/api/customer/profile');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonPath('data.email', $customer->email);
    }

    public function test_customer_bisa_memperbarui_profilnya_sendiri()
    {
        [$token, $customer] = $this->getCustomerTokenAndUser();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->putJson('/api/customer/profile', [
                'nama' => 'Customer Update',
                
                'jenisKelamin' => 'Perempuan',
                'tanggalLahir' => '1995-01-01',
                'email' => 'customer.update@mische.com',
                'nomorWa' => '08111222333'
            ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('user', [
            'idUser' => $customer->idUser,
            'nama' => 'Customer Update',
            'email' => 'customer.update@mische.com'
        ]);
    }

    public function test_customer_bisa_mengubah_password_saat_update_profil()
    {
        [$token, $customer] = $this->getCustomerTokenAndUser();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->putJson('/api/customer/profile', [
                'nama' => 'Customer Update',
                
                'jenisKelamin' => 'Perempuan',
                'tanggalLahir' => '1995-01-01',
                'email' => 'customer.update2@mische.com',
                'nomorWa' => '08111222333',
                'password' => 'PasswordBaru123'
            ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        // Verifikasi password terganti
        $userDiDb = User::find($customer->idUser);
        $this->assertTrue(Hash::check('PasswordBaru123', $userDiDb->password));
    }

    public function test_customer_gagal_memperbarui_profil_jika_format_salah()
    {
        [$token, $customer] = $this->getCustomerTokenAndUser();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->putJson('/api/customer/profile', [
                'nama' => 'Customer Update'
                // Kurang parameter wajib lainnya
            ]);

        $response->assertStatus(400)
                 ->assertJson(['success' => false])
                 ->assertJsonStructure(['errors']);
    }
}

<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class ProfilCustomerApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_bisa_melihat_profilnya_sendiri()
    {
        $customer = User::create([
            'nama' => 'Customer Tester', 'alamat' => 'Jl. Customer', 'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01', 'role' => 'customer', 'email' => 'customer.profil@mische.com',
            'nomorWa' => '08123456789', 'password' => bcrypt('password123')
        ]);
        
        $token = auth('api')->login($customer);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->getJson('/api/customer/profile');
            
        $response->assertStatus(200)
                 ->assertJsonPath('data.email', 'customer.profil@mische.com');
    }
}

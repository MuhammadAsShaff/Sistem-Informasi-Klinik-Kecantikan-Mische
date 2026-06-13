<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\AlamatCustomer;
use Tymon\JWTAuth\Facades\JWTAuth;

class AlamatCustomerApiTest extends TestCase
{
    use RefreshDatabase;

    protected $token;
    protected $customer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->customer = User::create([
            'nama' => 'Customer Tester',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-05-05',
            'role' => 'customer',
            'email' => 'customer_tester@mische.com',
            'nomorWa' => '081234567890',
            'password' => bcrypt('password')
        ]);

        $this->token = JWTAuth::fromUser($this->customer);
    }

    public function test_can_get_customer_addresses()
    {
        AlamatCustomer::create([
            'idUser' => $this->customer->idUser,
            'namaPenerima' => 'Penerima A',
            'nomorHp' => '0812345',
            'detailAlamat' => 'Detail A',
            'provinceId' => '1',
            'cityId' => '1',
            'kodePos' => '12345'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token
        ])->get('/api/customer/alamat');

        $response->assertStatus(200)
                 ->assertJsonFragment(['namaPenerima' => 'Penerima A']);
    }

    public function test_can_create_address_if_under_limit()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token
        ])->post('/api/customer/alamat', [
            'namaPenerima' => 'Penerima Baru',
            'nomorHp' => '0812345',
            'detailAlamat' => 'Jalan Baru No 1',
            'provinceId' => '1',
            'cityId' => '1',
            'kodePos' => '12345'
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['namaPenerima' => 'Penerima Baru']);
    }

    public function test_cannot_create_address_if_exceed_limit()
    {
        // Buat 3 alamat
        for ($i = 0; $i < 3; $i++) {
            AlamatCustomer::create([
                'idUser' => $this->customer->idUser,
                'namaPenerima' => "Penerima $i",
                'nomorHp' => '0812345',
                'detailAlamat' => "Detail $i",
                'provinceId' => '1',
                'cityId' => '1',
                'kodePos' => '12345'
            ]);
        }

        // Coba buat alamat ke-4
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token
        ])->post('/api/customer/alamat', [
            'namaPenerima' => 'Penerima Keempat',
            'nomorHp' => '0812345',
            'detailAlamat' => 'Jalan Baru No 4',
            'provinceId' => '1',
            'cityId' => '1',
            'kodePos' => '12345'
        ]);

        $response->assertStatus(400)
                 ->assertJsonFragment(['status' => 'error']);
    }

    public function test_can_update_address()
    {
        $alamat = AlamatCustomer::create([
            'idUser' => $this->customer->idUser,
            'namaPenerima' => 'Penerima A',
            'nomorHp' => '0812345',
            'detailAlamat' => 'Detail A',
            'provinceId' => '1',
            'cityId' => '1',
            'kodePos' => '12345'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token
        ])->put('/api/customer/alamat/' . $alamat->id, [
            'namaPenerima' => 'Penerima Update',
            'nomorHp' => '0812345',
            'detailAlamat' => 'Detail A',
            'provinceId' => '1',
            'cityId' => '1',
            'kodePos' => '12345'
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['namaPenerima' => 'Penerima Update']);
    }

    public function test_can_delete_address()
    {
        $alamat = AlamatCustomer::create([
            'idUser' => $this->customer->idUser,
            'namaPenerima' => 'Penerima A',
            'nomorHp' => '0812345',
            'detailAlamat' => 'Detail A',
            'provinceId' => '1',
            'cityId' => '1',
            'kodePos' => '12345'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token
        ])->delete('/api/customer/alamat/' . $alamat->id);

        $response->assertStatus(200)
                 ->assertJsonFragment(['status' => 'success']);
                 
        $this->assertDatabaseMissing('alamat_customer', ['id' => $alamat->id]);
    }
}

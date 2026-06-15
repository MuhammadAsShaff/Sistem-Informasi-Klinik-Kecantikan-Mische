<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\AlamatCustomer;
use Illuminate\Support\Facades\Http;
use Tymon\JWTAuth\Facades\JWTAuth;

class RajaOngkirApiTest extends TestCase
{
    use RefreshDatabase;

    protected $customer;
    protected $token;

    protected function setUp(): void
    {
        parent::setUp();

        // Buat Customer Test
        $this->customer = User::create([
            'nama' => 'Customer Ongkir Test',
            'email' => 'customer_ongkir@test.com',
            'password' => bcrypt('password123'),
            'nomorWa' => '08123456789',
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01',
            'role' => 'customer'
        ]);

        $this->token = JWTAuth::fromUser($this->customer);
    }

    /** @test */
    public function customer_bisa_mengambil_daftar_provinsi()
    {
        Http::fake([
            'rajaongkir.komerce.id/api/v1/destination/province' => Http::response([
                'meta' => ['message' => 'Success Get Province', 'code' => 200, 'status' => 'success'],
                'data' => [
                    ['id' => 1, 'name' => 'BALI'],
                    ['id' => 2, 'name' => 'BANGKA BELITUNG']
                ]
            ], 200)
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/customer/rajaongkir/provinces');

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonCount(2, 'data');
    }

    /** @test */
    public function customer_bisa_mengambil_daftar_kota_dengan_id_provinsi()
    {
        Http::fake([
            'rajaongkir.komerce.id/api/v1/destination/city/1' => Http::response([
                'meta' => ['message' => 'Success Get City By Province ID', 'code' => 200, 'status' => 'success'],
                'data' => [
                    ['id' => 1, 'province_id' => 1, 'name' => 'MATARAM'],
                    ['id' => 2, 'province_id' => 1, 'name' => 'BIMA']
                ]
            ], 200)
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/customer/rajaongkir/cities?province=1');

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonCount(2, 'data');
    }

    /** @test */
    public function ambil_kota_gagal_tanpa_province_query_parameter()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/customer/rajaongkir/cities');

        $response->assertStatus(422)
                 ->assertJsonPath('success', false)
                 ->assertJsonStructure(['errors' => ['province']]);
    }

    /** @test */
    public function check_cost_gagal_jika_destination_adalah_nol()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/customer/rajaongkir/cost', [
            'destination' => 0,
            'weight' => 1000,
            'courier' => 'jne'
        ]);

        $response->assertStatus(422)
                 ->assertJsonPath('success', false)
                 ->assertJsonStructure(['errors' => ['destination']]);
    }

    /** @test */
    public function customer_bisa_cek_ongkir_untuk_semua_kurir_berdasarkan_alamat()
    {
        // Buat Alamat Customer
        $alamat = AlamatCustomer::create([
            'idUser' => $this->customer->idUser,
            'namaPenerima' => 'Penerima Test',
            'nomorHp' => '08123456789',
            'detailAlamat' => 'Jalan Kebangsaan No. 12',
            'provinceId' => 1,
            'cityId' => 152, // Jakarta Barat
            'districtId' => 2100,
            'kodePos' => '11520'
        ]);

        // Mock response Komerce untuk JNE, POS, TIKI, J&T
        Http::fake([
            'rajaongkir.komerce.id/api/v1/calculate/domestic-cost?origin=326&destination=152&weight=1000&courier=jne' => Http::response([
                'meta' => ['code' => 200, 'status' => 'success'],
                'data' => [
                    ['service' => 'REG', 'description' => 'Layanan Reguler', 'cost' => 12000, 'etd' => '2-3 hari']
                ]
            ], 200),
            'rajaongkir.komerce.id/api/v1/calculate/domestic-cost?origin=326&destination=152&weight=1000&courier=pos' => Http::response([
                'meta' => ['code' => 200, 'status' => 'success'],
                'data' => [
                    ['service' => 'Pos Reguler', 'description' => 'Pos Reguler', 'cost' => 11000, 'etd' => '3-4 hari']
                ]
            ], 200),
            'rajaongkir.komerce.id/api/v1/calculate/domestic-cost?origin=326&destination=152&weight=1000&courier=tiki' => Http::response([
                'meta' => ['code' => 200, 'status' => 'success'],
                'data' => [
                    ['service' => 'REG', 'description' => 'Regular Service', 'cost' => 13000, 'etd' => '2 hari']
                ]
            ], 200),
            'rajaongkir.komerce.id/api/v1/calculate/domestic-cost?origin=326&destination=152&weight=1000&courier=jnt' => Http::response([
                'meta' => ['code' => 200, 'status' => 'success'],
                'data' => [
                    ['service' => 'EZ', 'description' => 'Regular Service', 'cost' => 15000, 'etd' => '2-3 hari']
                ]
            ], 200),
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/customer/rajaongkir/cost-by-address', [
            'idAlamat' => $alamat->id,
            'weight' => 1000
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonCount(4, 'data'); // 4 kurir rekomendasi (jne, pos, tiki, jnt)

        // Validasi struktur data hasil mapping
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'code',
                    'name',
                    'costs' => [
                        '*' => [
                            'service',
                            'description',
                            'cost' => [
                                '*' => ['value', 'etd', 'note']
                            ]
                        ]
                    ]
                ]
            ]
        ]);
    }
}

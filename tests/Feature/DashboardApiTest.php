<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Penjualan;
use App\Models\Reservasi;
use App\Models\ProdukKlinik;
use App\Models\DetailPenjualan;
use Illuminate\Support\Carbon;

class DashboardApiTest extends TestCase
{
    use RefreshDatabase;

    protected function getAdminToken()
    {
        $admin = User::create([
            'nama' => 'Admin Dashboard',
            
            'jenisKelamin' => 'Laki-Laki',
            'tanggalLahir' => '1990-01-01',
            'role' => 'admin',
            'email' => 'admin_dashboard@test.com',
            'nomorWa' => '081234567890',
            'password' => bcrypt('Password123')
        ]);

        return auth('api')->login($admin);
    }

    public function test_admin_bisa_melihat_data_dashboard()
    {
        $token = $this->getAdminToken();

        // 1. Buat Customer (Bulan Ini)
        $customer = User::create([
            'nama' => 'Customer Baru',
            
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01',
            'nomorWa' => '08111222333',
            'role' => 'customer',
            'email' => 'customer_baru@test.com',
            'password' => bcrypt('123456'),
            'created_at' => Carbon::now()
        ]);

        // 1.5 Buat Kategori Produk
        $kategori = \App\Models\KategoriProduk::create([
            'nama' => 'Skincare',
            'deskripsi' => 'Produk Skincare'
        ]);

        // 2. Buat Produk
        $produk = ProdukKlinik::create([
            'nama' => 'Serum Anti Aging',
            'deskripsi' => 'Serum wajah terbaik',
            'harga' => 100000,
            'stock' => 50,
            'gambar' => 'serum.jpg',
            'idKategori' => $kategori->idKategori
        ]);

        // 3. Buat Penjualan & Detail (Bulan Ini)
        $penjualan = Penjualan::create([
            'tanggal' => Carbon::now(),
            'invoiceNumber' => 'INV-' . time() . '-1',
            'subtotal' => 200000,
            'shippingCost' => 0,
            'shippingCourier' => 'jne',
            'shippingService' => 'REG',
            'total' => 200000,
            'paymentStatus' => 'paid',
            'orderStatus' => 'selesai',
            'idUser' => $customer->idUser
        ]);

        DetailPenjualan::create([
            'idPenjualan' => $penjualan->idPenjualan,
            'idProduk' => $produk->idProduk,
            'jumlahProduk' => 2
        ]);

        // 3.5 Buat Dokter
        $dokter = \App\Models\ProfilDokter::create([
            'nama' => 'Dr. Dummy',
            'spesialis' => 'Kecantikan',
            'jadwalPraktek' => 'Senin-Jumat',
            'foto' => 'dummy.jpg',
            'status' => 'Aktif',
            'email' => 'dokter@dummy.com',
            'noTelepon' => '08123456789',
            'deskripsi' => 'Dokter spesialis kecantikan'
        ]);

        // 3.7 Buat Jadwal
        $jadwal = \App\Models\JadwalReservasi::create([
            'jamMulai' => '09:00',
            'jamSelesai' => '10:00'
        ]);

        // 4. Buat Reservasi (Bulan Ini)
        Reservasi::create([
            'namaCustomer' => 'Customer Baru',
            'nomorWa' => '081234567891',
            'kategoriReservasi' => 'Facial',
            'jenisReservasi' => 'Facial Glowing',
            'tanggalReservasi' => Carbon::now(),
            'status' => 'Selesai',
            'idUser' => $customer->idUser,
            'idDokter' => $dokter->idDokter,
            'idJadwal' => $jadwal->idJadwal
        ]);

        // Hit Endpoint
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/admin/dashboard');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'status',
                     'data' => [
                         'summary' => [
                             'new_customers_this_month',
                             'total_sales_this_month',
                             'reservations_this_month'
                         ],
                         'charts' => [
                             'customer_growth_per_month',
                             'sales_growth_per_month',
                             'treatment_comparison'
                         ],
                         'top_products'
                     ]
                 ]);

        // Validasi isi data
        $response->assertJsonPath('data.summary.new_customers_this_month', 1);
        $response->assertJsonPath('data.summary.total_sales_this_month', 200000);
        $response->assertJsonPath('data.summary.reservations_this_month', 1);
        
        $this->assertEquals(2, $response->json('data.top_products.0.total_terjual'));
        $this->assertEquals('Facial', $response->json('data.charts.treatment_comparison.0.kategoriReservasi'));
        $this->assertEquals(1, $response->json('data.charts.treatment_comparison.0.total'));
    }

    public function test_customer_tidak_bisa_mengakses_dashboard()
    {
        $customer = User::create([
            'nama' => 'Customer',
            
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01',
            'nomorWa' => '08111222333',
            'role' => 'customer',
            'email' => 'customer@test.com',
            'password' => bcrypt('Password123')
        ]);
        
        $token = auth('api')->login($customer);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/admin/dashboard');

        // Middleware role:admin seharusnya menolak
        $response->assertStatus(403);
    }
}

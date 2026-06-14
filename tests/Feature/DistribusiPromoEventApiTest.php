<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;
use App\Models\User;
use App\Models\Promo;
use App\Models\Kegiatan;
use App\Models\KategoriProduk;
use App\Models\ProdukKlinik;

class DistribusiPromoEventApiTest extends TestCase
{
    use RefreshDatabase;

    protected function getAdminToken()
    {
        $admin = User::create([
            'nama' => 'Admin Test',
            
            'jenisKelamin' => 'Laki-Laki',
            'tanggalLahir' => '1990-01-01',
            'role' => 'admin',
            'email' => 'admin_dist@test.com',
            'nomorWa' => '08111222333',
            'password' => bcrypt('Password123')
        ]);

        return auth('api')->login($admin);
    }

    protected function createCustomers()
    {
        $customers = [];
        for ($i = 1; $i <= 3; $i++) {
            $customers[] = User::create([
                'nama' => "Customer $i",
                
                'jenisKelamin' => 'Perempuan',
                'tanggalLahir' => '1995-01-01',
                'role' => 'customer',
                'email' => "customer$i@test.com",
                'nomorWa' => "0899988877$i",
                'password' => bcrypt('Password123')
            ]);
        }
        return $customers;
    }

    public function test_admin_bisa_melihat_daftar_customer_untuk_distribusi()
    {
        $token = $this->getAdminToken();
        $this->createCustomers();

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->getJson('/api/admin/distribusi/customers');

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success'])
                 ->assertJsonCount(3, 'data');
    }

    public function test_admin_bisa_distribusi_promo_ke_semua_customer()
    {
        Http::fake([
            'api.fonnte.com/send' => Http::response(['status' => true, 'detail' => 'Message queued'], 200),
        ]);

        $token = $this->getAdminToken();
        $this->createCustomers();

        $kategori = KategoriProduk::create(['nama' => 'Kategori A', 'deskripsi' => 'Deskripsi Kategori A']);
        $produk = ProdukKlinik::create([
            'nama' => 'Produk A',
            'deskripsi' => 'Deskripsi A',
            'harga' => 50000,
            'stock' => 10,
            'gambar' => 'gambar_a.jpg',
            'idKategori' => $kategori->idKategori
        ]);

        $promo = Promo::create([
            'gambar' => 'promo.jpg',
            'namaPromo' => 'Promo Lebaran',
            'jenisPromo' => 'Diskon',
            'kode' => 'LBRN2026',
            'diskon' => 15000,
            'deskripsi' => 'Diskon Lebaran',
            'tanggalMulai' => '2026-01-01',
            'tanggalSelesai' => '2026-12-31',
            'minimalTransaksi' => 50000,
            'status' => 'Aktif',
            'idKategori' => $kategori->idKategori,
            'idProduk' => $produk->idProduk
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/admin/distribusi/promo', [
            'idPromo' => $promo->idPromo,
            'type' => 'all'
        ]);

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success']);

        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'api.fonnte.com/send');
        });
    }

    public function test_admin_bisa_distribusi_promo_ke_customer_tertentu()
    {
        Http::fake([
            'api.fonnte.com/send' => Http::response(['status' => true, 'detail' => 'Message queued'], 200),
        ]);

        $token = $this->getAdminToken();
        $customers = $this->createCustomers();

        $kategori = KategoriProduk::create(['nama' => 'Kategori A', 'deskripsi' => 'Deskripsi Kategori A']);
        $produk = ProdukKlinik::create([
            'nama' => 'Produk A',
            'deskripsi' => 'Deskripsi A',
            'harga' => 50000,
            'stock' => 10,
            'gambar' => 'gambar_a.jpg',
            'idKategori' => $kategori->idKategori
        ]);

        $promo = Promo::create([
            'gambar' => 'promo.jpg',
            'namaPromo' => 'Promo Terbatas',
            'jenisPromo' => 'Diskon',
            'kode' => 'TRBTS',
            'diskon' => 10000,
            'deskripsi' => 'Diskon Terbatas',
            'tanggalMulai' => '2026-01-01',
            'tanggalSelesai' => '2026-12-31',
            'minimalTransaksi' => 50000,
            'status' => 'Aktif',
            'idKategori' => $kategori->idKategori,
            'idProduk' => $produk->idProduk
        ]);

        // Pilih hanya 2 customer
        $selectedIds = [$customers[0]->idUser, $customers[1]->idUser];

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/admin/distribusi/promo', [
            'idPromo' => $promo->idPromo,
            'type' => 'selected',
            'customer_ids' => $selectedIds
        ]);

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success']);

        Http::assertSent(function ($request) use ($customers) {
            $payload = $request->data();
            // Memastikan target sesuai dengan yang dipilih
            $expectedTarget = $customers[0]->nomorWa . ',' . $customers[1]->nomorWa;
            return str_contains($request->url(), 'api.fonnte.com/send') &&
                   $payload['target'] === $expectedTarget;
        });
    }

    public function test_admin_bisa_distribusi_event_ke_semua_customer()
    {
        Http::fake([
            'api.fonnte.com/send' => Http::response(['status' => true, 'detail' => 'Message queued'], 200),
        ]);

        $token = $this->getAdminToken();
        $this->createCustomers();

        $kegiatan = Kegiatan::create([
            'namaKegiatan' => 'Beauty Seminar',
            'deskripsi' => 'Seminar kecantikan untuk kulit sehat',
            'foto' => 'seminar.jpg',
            'tanggalKegiatan' => '2026-10-10'
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/admin/distribusi/event', [
            'idKegiatan' => $kegiatan->idKegiatan,
            'type' => 'all'
        ]);

        $response->assertStatus(200)
                 ->assertJson(['status' => 'success']);

        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'api.fonnte.com/send');
        });
    }

    public function test_validasi_error_saat_distribusi()
    {
        $token = $this->getAdminToken();

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson('/api/admin/distribusi/promo', []); // Data kosong

        $response->assertStatus(422)
                 ->assertJsonStructure(['message' => ['idPromo', 'type']]);
    }
}

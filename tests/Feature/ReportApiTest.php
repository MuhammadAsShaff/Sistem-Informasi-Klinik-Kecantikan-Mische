<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PenjualanExport;
use App\Exports\ReservasiExport;

class ReportApiTest extends TestCase
{
    use RefreshDatabase;

    protected function getAdminToken()
    {
        $admin = User::create([
            'nama' => 'Admin Report',
            
            'jenisKelamin' => 'Laki-Laki',
            'tanggalLahir' => '1990-01-01',
            'role' => 'admin',
            'email' => 'admin_report@test.com',
            'nomorWa' => '081234567892',
            'password' => bcrypt('Password123')
        ]);

        return auth('api')->login($admin);
    }

    public function test_admin_bisa_download_report_penjualan()
    {
        Excel::fake();

        $token = $this->getAdminToken();

        $filename = 'Laporan_Penjualan_' . date('Y-m-d_H-i-s') . '.xlsx';
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->get('/api/admin/report/penjualan?tanggalMulai=2026-01-01&tanggalSelesai=2026-12-31');

        $response->assertStatus(200);

        Excel::assertDownloaded($filename, function (PenjualanExport $export) {
            return true;
        });
    }

    public function test_admin_bisa_download_report_reservasi()
    {
        Excel::fake();

        $token = $this->getAdminToken();

        $filename = 'Laporan_Reservasi_' . date('Y-m-d_H-i-s') . '.xlsx';
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->get('/api/admin/report/reservasi?kategoriReservasi=Facial');

        $response->assertStatus(200);

        Excel::assertDownloaded($filename, function (ReservasiExport $export) {
            return true;
        });
    }

    public function test_customer_tidak_bisa_download_report()
    {
        $customer = User::create([
            'nama' => 'Customer',
            
            'jenisKelamin' => 'Perempuan',
            'tanggalLahir' => '1995-01-01',
            'nomorWa' => '08111222333',
            'role' => 'customer',
            'email' => 'customer_report@test.com',
            'password' => bcrypt('Password123')
        ]);
        
        $token = auth('api')->login($customer);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->get('/api/admin/report/penjualan');

        $response->assertStatus(403);
    }
}

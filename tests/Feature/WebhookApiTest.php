<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Penjualan;
use App\Models\User;

class WebhookApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function midtrans_webhook_bisa_mengubah_status_pesanan_menjadi_paid()
    {
        $customer = User::create([
            'nama' => 'Webhook Test',
            'email' => 'webhook@test.com',
            'password' => bcrypt('password123'),
            'nomorWa' => '081234567890',
            'jenisKelamin' => 'Laki-laki',
            'tanggalLahir' => '1990-01-01',
            'role' => 'customer'
        ]);

        $penjualan = Penjualan::create([
            'tanggal' => now(),
            'invoiceNumber' => 'INV-20260617-0001',
            'subtotal' => 50000,
            'shippingCost' => 10000,
            'shippingCourier' => 'jne',
            'shippingService' => 'REG',
            'total' => 60000,
            'paymentStatus' => 'unpaid',
            'orderStatus' => 'pending',
            'idUser' => $customer->idUser,
        ]);

        $payload = [
            'transaction_status' => 'settlement',
            'order_id' => $penjualan->invoiceNumber,
            'fraud_status' => 'accept'
        ];

        // Midtrans mengirim POST ke webhook endpoint
        $response = $this->postJson('/api/webhook/midtrans', $payload);

        $response->assertStatus(200);

        $this->assertDatabaseHas('penjualan', [
            'invoiceNumber' => 'INV-20260617-0001',
            'paymentStatus' => 'paid'
        ]);
    }
}

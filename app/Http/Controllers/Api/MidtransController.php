<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Penjualan;
use Illuminate\Support\Facades\Log;
use App\Services\MidtransService;

class MidtransController extends Controller
{
    /**
     * midtransNotification
     * 
     * Webhook/Listener untuk menerima pesan otomatis (Push) dari server Midtrans.
     * Ketika customer selesai membayar (lewat gopay, indomaret, dll), Midtrans akan diam-diam mengirim POST request ke fungsi ini.
     */
    public function midtransNotification(Request $request, MidtransService $midtransService)
    {
        $orderId = $request->order_id;       // Nomor invoice kita (Contoh: INV-20231201-0001)
        $statusCode = $request->status_code; // Kode status dari midtrans (200, 201, dll)
        $grossAmount = $request->gross_amount; // Total uang yang dibayar
        $signatureKey = $request->signature_key; // Kunci rahasia dari Midtrans
        
        // 1. KEAMANAN: Verifikasi Signature Key
        // Ini memastikan bahwa yang mengirim request benar-benar Midtrans, bukan Hacker yang mencoba memalsukan pembayaran
        if (!$midtransService->verifySignature($orderId, $statusCode, $grossAmount, $signatureKey)) {
            Log::error('Midtrans Webhook: Invalid Signature', ['order_id' => $orderId]);
            return response()->json(['status' => 'error', 'message' => 'Invalid signature key'], 403);
        }

        // Ambil status spesifik dari pembayaran
        $transactionStatus = $request->transaction_status; // Contoh: 'settlement' (lunas), 'pending', 'expire'
        $paymentType = $request->payment_type;             // Contoh: 'gopay', 'bank_transfer'
        $fraudStatus = $request->fraud_status;             // Contoh: 'accept' (aman dari fraud)

        // Cari transaksi penjualan di database kita berdasarkan orderId
        $penjualan = Penjualan::where('invoiceNumber', $orderId)->first();

        if (!$penjualan) {
            Log::error('Midtrans Webhook: Order Not Found', ['order_id' => $orderId]);
            return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
        }

        // 2. UPDATE STATUS DATABASE BERDASARKAN RESPON MIDTRANS
        if ($transactionStatus == 'capture') {
            // Berlaku untuk pembayaran Kartu Kredit
            if ($fraudStatus == 'accept') {
                $penjualan->update([
                    'paymentStatus' => 'paid',            // Lunas
                    'paymentMethod' => $paymentType,      // Simpan metode bayarnya (Contoh: credit_card)
                    'orderStatus' => 'diproses',          // Otomatis ubah status pesanan ke "diproses" oleh Admin
                    'paidAt' => now()
                ]);
            }
        } else if ($transactionStatus == 'settlement') {
            // Berlaku untuk Gopay, ShopeePay, Virtual Account, Indomaret (Selesai dibayar)
            $penjualan->update([
                'paymentStatus' => 'paid',
                'paymentMethod' => $paymentType,
                'orderStatus' => 'diproses',              // Admin sekarang siap memproses barang
                'paidAt' => now()
            ]);
        } else if ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
            // Jika dibatalkan, ditolak, atau waktunya habis (kadaluwarsa 24 jam)
            $penjualan->update([
                'paymentStatus' => 'failed',
                'orderStatus' => 'dibatalkan'
            ]);
            // Catatan: Anda mungkin ingin menambahkan logika "Restore Stock" (Kembalikan stok) di sini jika dibutuhkan
        } else if ($transactionStatus == 'pending') {
            // Customer sudah klik checkout tapi belum transfer
            $penjualan->update([
                'paymentStatus' => 'unpaid'
            ]);
        }

        // Catat ke log file laravel agar mudah di-debug jika terjadi kendala
        Log::info('Midtrans Webhook: Success', ['order_id' => $orderId, 'status' => $transactionStatus]);

        // Beri tahu Midtrans bahwa pesan sudah kita terima (Response 200 OK)
        return response()->json(['status' => 'success', 'message' => 'Notification processed successfully']);
    }

    /**
     * checkStatus
     * 
     * Pengecekan status manual dari Frontend (Metode Pull)
     * Digunakan ketika Popup Midtrans di layar customer ditutup (Selesai).
     * Frontend akan memanggil API ini untuk 'menyuruh' Backend bertanya langsung ke Midtrans.
     */
    public function checkStatus(Request $request, MidtransService $midtransService)
    {
        $orderId = $request->order_id;
        
        $penjualan = Penjualan::where('invoiceNumber', $orderId)->first();
        if (!$penjualan) {
            return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
        }

        try {
            // 1. Meminta status terbaru langsung dari server Midtrans (Tanya ke Server Aslinya) via Service
            $statusResponse = $midtransService->checkTransactionStatus($orderId);
            
            $transactionStatus = $statusResponse->transaction_status;
            
            // Ambil metode pembayaran. Jika Midtrans belum mengembalikan tipe pembayarannya, gunakan yang lama (jika ada)
            $paymentType = $statusResponse->payment_type ?? $penjualan->paymentMethod;
            
            // 2. Sinkronisasi Data Database dengan Status Asli dari Midtrans
            if ($transactionStatus == 'capture' || $transactionStatus == 'settlement') {
                $penjualan->update([
                    'paymentStatus' => 'paid',            // Tandai sudah dibayar
                    'paymentMethod' => $paymentType,      // Catat bayarnya pakai apa (bca_va, gopay, dll)
                    'orderStatus' => 'diproses',          // Pesanan langsung masuk antrean kemas/proses admin
                    'paidAt' => now()                     // Catat jam pembayarannya
                ]);
            } else if ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
                $penjualan->update([
                    'paymentStatus' => 'failed',
                    'orderStatus' => 'dibatalkan'
                ]);
            }

            return response()->json([
                'status' => 'success', 
                'message' => 'Status updated', 
                'data' => $penjualan
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error', 
                'message' => 'Failed to check status: ' . $e->getMessage()
            ], 500);
        }
    }
}

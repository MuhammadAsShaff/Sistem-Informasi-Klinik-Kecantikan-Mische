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
     * Handler Notifikasi dari Midtrans
     */
    public function midtransNotification(Request $request, MidtransService $midtransService)
    {
        $orderId = $request->order_id;
        $statusCode = $request->status_code;
        $grossAmount = $request->gross_amount;
        $signatureKey = $request->signature_key;
        
        // Verifikasi Signature Key via Service
        if (!$midtransService->verifySignature($orderId, $statusCode, $grossAmount, $signatureKey)) {
            Log::error('Midtrans Webhook: Invalid Signature', ['order_id' => $orderId]);
            return response()->json(['status' => 'error', 'message' => 'Invalid signature key'], 403);
        }

        $transactionStatus = $request->transaction_status;
        $paymentType = $request->payment_type;
        $fraudStatus = $request->fraud_status;

        $penjualan = Penjualan::where('invoiceNumber', $orderId)->first();

        if (!$penjualan) {
            Log::error('Midtrans Webhook: Order Not Found', ['order_id' => $orderId]);
            return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
        }

        if ($transactionStatus == 'capture') {
            if ($fraudStatus == 'accept') {
                $penjualan->update([
                    'paymentStatus' => 'paid',
                    'paymentMethod' => $paymentType,
                    'orderStatus' => 'diproses',
                    'paidAt' => now()
                ]);
            }
        } else if ($transactionStatus == 'settlement') {
            $penjualan->update([
                'paymentStatus' => 'paid',
                'paymentMethod' => $paymentType,
                'orderStatus' => 'diproses',
                'paidAt' => now()
            ]);
        } else if ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
            $penjualan->update([
                'paymentStatus' => 'failed',
                'orderStatus' => 'dibatalkan'
            ]);
        } else if ($transactionStatus == 'pending') {
            $penjualan->update([
                'paymentStatus' => 'unpaid'
            ]);
        }

        Log::info('Midtrans Webhook: Success', ['order_id' => $orderId, 'status' => $transactionStatus]);

        return response()->json(['status' => 'success', 'message' => 'Notification processed successfully']);
    }

    /**
     * Pengecekan status manual dari Frontend (Pull Method)
     */
    public function checkStatus(Request $request, MidtransService $midtransService)
    {
        $orderId = $request->order_id;
        
        $penjualan = Penjualan::where('invoiceNumber', $orderId)->first();
        if (!$penjualan) {
            return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
        }

        try {
            // Meminta status terbaru langsung dari server Midtrans via Service
            $statusResponse = $midtransService->checkTransactionStatus($orderId);
            
            $transactionStatus = $statusResponse->transaction_status;
            $paymentType = $statusResponse->payment_type ?? $penjualan->paymentMethod;
            
            if ($transactionStatus == 'capture' || $transactionStatus == 'settlement') {
                $penjualan->update([
                    'paymentStatus' => 'paid',
                    'paymentMethod' => $paymentType,
                    'orderStatus' => 'diproses',
                    'paidAt' => now()
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

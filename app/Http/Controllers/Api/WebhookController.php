<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Penjualan;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Handler Notifikasi dari Midtrans
     */
    public function midtransNotification(Request $request)
    {
        $serverKey = config('midtrans.server_key');
        
        $orderId = $request->order_id;
        $statusCode = $request->status_code;
        $grossAmount = $request->gross_amount;
        $signatureKey = $request->signature_key;
        
        // Verifikasi Signature Key untuk memastikan notifikasi benar-benar dari Midtrans
        $calculatedSignatureKey = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        if ($calculatedSignatureKey !== $signatureKey) {
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
}

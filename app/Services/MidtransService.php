<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;
use Illuminate\Support\Facades\Log;

class MidtransService
{
    public function __construct()
    {
        // Set konfigurasi Midtrans
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    /**
     * Mempersiapkan parameter dan meminta Snap Token dari Midtrans
     *
     * @param string $orderId Nomor Invoice / Order ID unik
     * @param int $grossAmount Total yang harus dibayar
     * @param object $user Object data user / customer
     * @param array|null $paymentMethods Array metode pembayaran spesifik (opsional)
     * @return string|null Mengembalikan token string, atau null jika gagal
     */
    public function createSnapToken($orderId, $grossAmount, $user, $paymentMethods = null)
    {
        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $grossAmount,
            ],
            'customer_details' => [
                'first_name' => $user->nama,
                'email' => $user->email,
                'phone' => $user->nomorWa,
            ],
        ];

        // Jika Frontend mengirimkan spesifik metode pembayaran, paksa Midtrans untuk hanya menampilkan itu
        if (!empty($paymentMethods) && is_array($paymentMethods)) {
            $params['enabled_payments'] = $paymentMethods;
        }

        try {
            return Snap::getSnapToken($params);
        } catch (\Exception $e) {
            Log::error('Midtrans Snap Error: ' . $e->getMessage(), ['order_id' => $orderId]);
            throw $e;
        }
    }

    /**
     * Memvalidasi keaslian payload dari Webhook Midtrans
     *
     * @param string $orderId
     * @param string $statusCode
     * @param string $grossAmount
     * @param string $signatureKey
     * @return bool
     */
    public function verifySignature($orderId, $statusCode, $grossAmount, $signatureKey)
    {
        $serverKey = config('midtrans.server_key');
        $calculatedSignatureKey = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        return $calculatedSignatureKey === $signatureKey;
    }

    /**
     * Meminta status terbaru transaksi langsung dari server Midtrans (Pull Method)
     *
     * @param string $orderId Nomor Invoice / Order ID
     * @return object Respons dari Midtrans
     */
    public function checkTransactionStatus($orderId)
    {
        try {
            return \Midtrans\Transaction::status($orderId);
        } catch (\Exception $e) {
            Log::error('Midtrans Check Status Error: ' . $e->getMessage(), ['order_id' => $orderId]);
            throw $e;
        }
    }
}

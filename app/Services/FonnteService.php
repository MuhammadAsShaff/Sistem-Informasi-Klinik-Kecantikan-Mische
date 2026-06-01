<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteService
{
    protected $token;

    public function __construct()
    {
        // Mengambil token Fonnte dari file .env
        $this->token = env('FONNTE_TOKEN');
    }

    /**
     * Mengirim pesan WhatsApp melalui API Fonnte
     * 
     * @param string $target Nomor WhatsApp tujuan (bisa dipisah koma untuk banyak target)
     * @param string $message Isi pesan WhatsApp
     * @param string|null $url Gambar/file URL (opsional)
     * @return array
     */
    public function sendMessage($target, $message, $url = null)
    {
        if (empty($this->token)) {
            Log::error('Fonnte API Token tidak ditemukan di .env');
            return [
                'status' => false,
                'reason' => 'Token Fonnte belum diatur'
            ];
        }

        $payload = [
            'target' => $target,
            'message' => $message,
            'countryCode' => '62', // Otomatis mengubah awalan 0 menjadi 62
        ];

        // Jika ingin mengirimkan gambar/berkas
        if ($url) {
            $payload['url'] = $url;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => $this->token
            ])->post('https://api.fonnte.com/send', $payload);

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Gagal mengirim WhatsApp melalui Fonnte: ' . $e->getMessage());
            return [
                'status' => false,
                'reason' => $e->getMessage()
            ];
        }
    }
}

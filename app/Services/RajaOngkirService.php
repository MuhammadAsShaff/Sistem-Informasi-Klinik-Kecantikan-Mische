<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RajaOngkirService
{
    protected $apiKey;
    protected $baseUrl;
    protected $originCityId; // Kota asal pengiriman (Klinik Mische)

    public function __construct()
    {
        $this->apiKey = env('RAJAONGKIR_API_KEY');
        // Default menggunakan API Starter
        $this->baseUrl = 'https://api.rajaongkir.com/starter';
        // Misal id kota asal adalah 114 (Denpasar) atau lainnya, sesuaikan dengan lokasi klinik
        $this->originCityId = env('RAJAONGKIR_ORIGIN_CITY_ID', 114); 
    }

    /**
     * Mendapatkan daftar provinsi
     */
    public function getProvinces()
    {
        try {
            $response = Http::withHeaders([
                'key' => $this->apiKey
            ])->get($this->baseUrl . '/province');

            if ($response->successful()) {
                return $response->json()['rajaongkir']['results'];
            }

            Log::error('RajaOngkir getProvinces error', ['response' => $response->body()]);
            return [];
        } catch (\Exception $e) {
            Log::error('RajaOngkir getProvinces exception', ['message' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Mendapatkan daftar kota berdasarkan ID provinsi
     */
    public function getCities($provinceId = null)
    {
        try {
            $url = $this->baseUrl . '/city';
            if ($provinceId) {
                $url .= '?province=' . $provinceId;
            }

            $response = Http::withHeaders([
                'key' => $this->apiKey
            ])->get($url);

            if ($response->successful()) {
                return $response->json()['rajaongkir']['results'];
            }

            Log::error('RajaOngkir getCities error', ['response' => $response->body()]);
            return [];
        } catch (\Exception $e) {
            Log::error('RajaOngkir getCities exception', ['message' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Mengecek ongkos kirim
     * 
     * @param int $destinationCityId ID kota tujuan
     * @param int $weight Berat barang dalam gram
     * @param string $courier Kode kurir (jne, pos, tiki)
     */
    public function getCost($destinationCityId, $weight, $courier)
    {
        try {
            $response = Http::withHeaders([
                'key' => $this->apiKey
            ])->post($this->baseUrl . '/cost', [
                'origin' => $this->originCityId,
                'destination' => $destinationCityId,
                'weight' => $weight,
                'courier' => strtolower($courier)
            ]);

            if ($response->successful()) {
                return $response->json()['rajaongkir']['results'][0]['costs'] ?? [];
            }

            Log::error('RajaOngkir getCost error', ['response' => $response->body()]);
            return [];
        } catch (\Exception $e) {
            Log::error('RajaOngkir getCost exception', ['message' => $e->getMessage()]);
            return [];
        }
    }
}

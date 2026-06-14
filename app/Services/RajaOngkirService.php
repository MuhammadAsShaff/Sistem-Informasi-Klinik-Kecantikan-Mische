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
        // Gunakan URL dari .env jika ada, jika tidak gunakan default Starter
        $this->baseUrl = env('RAJAONGKIR_BASE_URL', 'https://api.rajaongkir.com/starter');
        // Misal id kota asal adalah 114 (Denpasar) atau lainnya, sesuaikan dengan lokasi klinik
        $this->originCityId = env('RAJAONGKIR_ORIGIN_CITY_ID', 114); 
    }

    /**
     * Mengecek apakah ini Komerce API
     */
    private function isKomerce()
    {
        return strpos($this->baseUrl, 'komerce') !== false;
    }

    /**
     * Mendapatkan daftar provinsi
     */
    public function getProvinces()
    {
        try {
            $endpoint = $this->isKomerce() ? '/destination/province' : '/province';
            $response = Http::withHeaders([
                'key' => $this->apiKey,
                'accept' => 'application/json'
            ])->get($this->baseUrl . $endpoint);

            if ($response->successful()) {
                if ($this->isKomerce()) {
                    // Mapping respons Komerce agar sama persis strukturnya dengan Front-End/RajaOngkir asli
                    $data = $response->json()['data'] ?? [];
                    return array_map(function($item) {
                        return [
                            'province_id' => $item['id'],
                            'province' => $item['name']
                        ];
                    }, $data);
                }
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
            $endpoint = $this->isKomerce() ? '/destination/city' : '/city';
            $url = $this->baseUrl . $endpoint;
            if ($provinceId) {
                $url .= '?province=' . $provinceId;
            }

            $response = Http::withHeaders([
                'key' => $this->apiKey,
                'accept' => 'application/json'
            ])->get($url);

            if ($response->successful()) {
                if ($this->isKomerce()) {
                    $data = $response->json()['data'] ?? [];
                    return array_map(function($item) {
                        return [
                            'city_id' => $item['id'],
                            'province_id' => $item['province_id'] ?? null,
                            'city_name' => $item['name'],
                            'type' => 'Kota',
                            'postal_code' => ''
                        ];
                    }, $data);
                }
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
     */
    public function getCost($destinationCityId, $weight, $courier)
    {
        try {
            if ($this->isKomerce()) {
                // Komerce membutuhkan parameter POST di query params, bukan di body json
                $url = $this->baseUrl . '/calculate/domestic-cost';
                $url .= '?origin=' . $this->originCityId;
                $url .= '&destination=' . $destinationCityId;
                $url .= '&weight=' . $weight;
                $url .= '&courier=' . strtolower($courier);

                $response = Http::withHeaders([
                    'key' => $this->apiKey,
                    'accept' => 'application/json',
                    'content-type' => 'application/json'
                ])->post($url);

                if ($response->successful()) {
                    $data = $response->json()['data'] ?? [];
                    // Memetakan balasan Komerce ke format RajaOngkir asli
                    $mappedCosts = array_map(function($item) {
                        return [
                            'service' => $item['service'],
                            'description' => $item['description'],
                            'cost' => [
                                [
                                    'value' => $item['cost'],
                                    'etd' => $item['etd'],
                                    'note' => ''
                                ]
                            ]
                        ];
                    }, $data);
                    return $mappedCosts;
                }
            } else {
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
            }

            Log::error('RajaOngkir getCost error', ['response' => $response->body()]);
            return [];
        } catch (\Exception $e) {
            Log::error('RajaOngkir getCost exception', ['message' => $e->getMessage()]);
            return [];
        }
    }
}

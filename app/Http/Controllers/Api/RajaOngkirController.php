<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\RajaOngkirService;
use Illuminate\Support\Facades\Validator;

class RajaOngkirController extends Controller
{
    protected $rajaOngkirService;

    public function __construct(RajaOngkirService $rajaOngkirService)
    {
        $this->rajaOngkirService = $rajaOngkirService;
    }

    /**
     * Mendapatkan daftar provinsi
     */
    public function getProvinces()
    {
        try {
            $provinces = $this->rajaOngkirService->getProvinces();

            if (empty($provinces)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal mengambil data provinsi dari RajaOngkir'
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil data provinsi',
                'data' => $provinces
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mendapatkan daftar kota berdasarkan provinsi
     */
    public function getCities(Request $request)
    {
        try {
            $provinceId = $request->query('province');
            $cities = $this->rajaOngkirService->getCities($provinceId);

            if (empty($cities)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal mengambil data kota dari RajaOngkir'
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil data kota',
                'data' => $cities
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mengecek ongkos kirim
     */
    public function checkCost(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'destination' => 'required|numeric',
                'weight' => 'required|numeric|min:1',
                'courier' => 'required|string|in:jne,pos,tiki'
            ], [
                'destination.required' => 'Kota tujuan wajib diisi.',
                'weight.required' => 'Berat wajib diisi.',
                'courier.required' => 'Kurir wajib diisi.',
                'courier.in' => 'Kurir tidak valid (pilih jne, pos, atau tiki).'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan input',
                    'errors' => $validator->errors()
                ], 422);
            }

            $cost = $this->rajaOngkirService->getCost(
                $request->destination,
                $request->weight,
                $request->courier
            );

            if (empty($cost)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal mengambil data ongkos kirim dari RajaOngkir'
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil data ongkos kirim',
                'data' => $cost
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

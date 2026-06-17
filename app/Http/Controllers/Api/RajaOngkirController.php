<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\RajaOngkirService;
use Illuminate\Support\Facades\Validator;
use App\Models\AlamatCustomer;
use App\Models\Keranjang;

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
            $validator = Validator::make($request->query(), [
                'province' => 'required|numeric|min:1'
            ], [
                'province.required' => 'Parameter query ?province wajib diisi.',
                'province.numeric' => 'ID Provinsi harus berupa angka.',
                'province.min' => 'ID Provinsi tidak valid.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan input',
                    'errors' => $validator->errors()
                ], 422);
            }

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
     * Mengecek ongkos kirim berdasarkan alamat customer untuk semua kurir aktif
     */
    public function checkCostByAddress(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'idAlamat' => 'required|numeric|exists:alamat_customer,id',
                'cart_ids' => 'required|array',
                'cart_ids.*' => 'integer|exists:keranjang,idKeranjang'
            ], [
                'idAlamat.required' => 'ID Alamat wajib diisi.',
                'idAlamat.exists' => 'Alamat tidak ditemukan.',
                'cart_ids.required' => 'Daftar item keranjang wajib dikirim.',
                'cart_ids.array' => 'Format keranjang tidak valid.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan input',
                    'errors' => $validator->errors()
                ], 422);
            }

            $idUser = auth('api')->user()->idUser;

            // Pastikan alamat tersebut milik user yang sedang login
            $alamat = AlamatCustomer::where('id', $request->idAlamat)->where('idUser', $idUser)->first();
            if (!$alamat) {
                return response()->json([
                    'success' => false,
                    'message' => 'Alamat tidak ditemukan atau bukan milik Anda.'
                ], 403);
            }

            $destinationCityId = $alamat->cityId;

            // Kalkulasi berat total keranjang
            $keranjangItems = Keranjang::with('produk')->where('idUser', $idUser)->whereIn('idKeranjang', $request->cart_ids)->get();
            if ($keranjangItems->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Keranjang kosong atau tidak valid.'
                ], 400);
            }

            $weight = 0;
            foreach ($keranjangItems as $item) {
                // Asumsi berat kolom adalah 'berat' (gram)
                $beratSatuan = $item->produk->berat ?? 500; // default 500g jika kosong
                $weight += ($beratSatuan * $item->jumlahProduk);
            }

            if ($weight < 1) {
                $weight = 1000; // fallback jika ada kesalahan data
            }

            // Ambil daftar kurir yang didukung dari config
            $couriers = config('rajaongkir.supported_couriers', ['jne', 'pos', 'tiki']);

            $allCourierCosts = [];

            foreach ($couriers as $courier) {
                $costs = $this->rajaOngkirService->getCost(
                    $destinationCityId,
                    $weight,
                    $courier
                );

                if (!empty($costs)) {
                    $allCourierCosts[] = [
                        'code' => $courier,
                        'name' => $this->getCourierName($courier),
                        'costs' => $costs
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil semua data ongkos kirim rekomendasi',
                'data' => $allCourierCosts
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat menghitung ongkos kirim',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mendapatkan nama kurir yang ramah pengguna
     */
    private function getCourierName($code)
    {
        $names = [
            'jne' => 'Jalur Nugraha Ekakurir (JNE)',
            'pos' => 'Pos Indonesia (POS)',
            'tiki' => 'Titipan Kilat (TIKI)',
            'jnt' => 'J&T Express (J&T)',
            'sicepat' => 'SiCepat Express',
        ];

        return $names[strtolower($code)] ?? strtoupper($code);
    }
}

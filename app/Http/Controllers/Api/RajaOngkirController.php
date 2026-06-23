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
    // Dependency Injection: Menyuntikkan Service RajaOngkir ke dalam Controller ini
    protected $rajaOngkirService;

    public function __construct(RajaOngkirService $rajaOngkirService)
    {
        $this->rajaOngkirService = $rajaOngkirService;
    }

    /**
     * getProvinces
     * 
     * Mengambil daftar seluruh Provinsi di Indonesia (Untuk dropdown Alamat di Frontend).
     * Datanya ditarik langsung (Live) dari API pihak ketiga (RajaOngkir).
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
     * getCities
     * 
     * Mengambil daftar Kota/Kabupaten berdasarkan ID Provinsi yang dipilih user.
     * Contoh Request URL: /api/cities?province=11
     */
    public function getCities(Request $request)
    {
        try {
            // Validasi: Pastikan query string ?province wajib ada dan berupa angka
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
                ], 422); // 422 Unprocessable Entity
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
     * checkCostByAddress
     * 
     * Fitur Krusial: Menghitung secara otomatis berapa Ongkos Kirim (Ongkir) 
     * berdasarkan berat total barang di keranjang VS Kota Tujuan alamat si Customer.
     */
    public function checkCostByAddress(Request $request)
    {
        try {
            // 1. Validasi Input: Pastikan dia memilih alamat mana dan keranjang mana yang mau di-checkout
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

            // 2. Keamanan: Pastikan alamat yang diaudit benar-benar miliknya, bukan alamat orang lain
            $alamat = AlamatCustomer::where('id', $request->idAlamat)->where('idUser', $idUser)->first();
            if (!$alamat) {
                return response()->json([
                    'success' => false,
                    'message' => 'Alamat tidak ditemukan atau bukan milik Anda.'
                ], 403);
            }

            // RajaOngkir menggunakan cityId untuk menentukan tujuan pengiriman
            $destinationCityId = $alamat->cityId;

            // 3. Kalkulasi BERAT TOTAL dari semua barang yang dicheckout
            $keranjangItems = Keranjang::with('produk')->where('idUser', $idUser)->whereIn('idKeranjang', $request->cart_ids)->get();
            if ($keranjangItems->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Keranjang kosong atau tidak valid.'
                ], 400);
            }

            $weight = 0;
            foreach ($keranjangItems as $item) {
                // (Setiap barang punya berat dalam gram, jika NULL kita anggap 500g sebagai default aman)
                $beratSatuan = $item->produk->berat ?? 500; 
                $weight += ($beratSatuan * $item->jumlahProduk);
            }

            // Fallback Ekstra: Kurir menolak berat 0 gram, setidaknya minimal paket adalah 1kg (1000g)
            if ($weight < 1) {
                $weight = 1000; 
            }

            // 4. Proses Request Biaya ke Server RajaOngkir untuk semua kurir yang didukung klinik
            // (Kurir bisa diatur di file config/rajaongkir.php)
            $couriers = config('rajaongkir.supported_couriers', ['jne', 'pos', 'tiki']);

            $allCourierCosts = [];

            // Loop untuk menarik harga dari JNE, lalu POS, lalu TIKI, dst...
            foreach ($couriers as $courier) {
                $costs = $this->rajaOngkirService->getCost(
                    $destinationCityId, // Kota Tujuan (Customer)
                    $weight,            // Berat Paket (Gram)
                    $courier            // Nama Kurir (JNE/POS/dll)
                );

                // Jika layanan tersedia untuk jalur rute tersebut, simpan ke array hasil
                if (!empty($costs)) {
                    $allCourierCosts[] = [
                        'code' => $courier,
                        'name' => $this->getCourierName($courier), // Memanggil fungsi helper di bawah untuk mempercantik nama
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
     * getCourierName (Helper Internal)
     * 
     * Mengubah kode singkatan ('jne') menjadi nama panggung yang lebih formal ('Jalur Nugraha Ekakurir (JNE)')
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

        // Jika ada di list, tampilkan namanya, jika tidak kembalikan HURUF BESAR nya saja.
        return $names[strtolower($code)] ?? strtoupper($code);
    }
}

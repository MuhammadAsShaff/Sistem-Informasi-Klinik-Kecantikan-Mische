<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Promo;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use App\Models\Keranjang;
use Carbon\Carbon;

class PromoController extends Controller
{
    /**
     * getAllPromos
     * Menampilkan daftar promo (Admin)
     */
    public function getAllPromos()
    {
        try {
            $promos = Promo::with(['kategori', 'produk'])->latest()->paginate(10);
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil daftar promo.',
                'data' => $promos
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data promo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * getPublicPromos
     * Menampilkan promo pada halaman customer (Hanya yang status aktif / true)
     */
    public function getPublicPromos()
    {
        try {
            $promos = Promo::with(['kategori', 'produk'])
                           ->where('status', true)
                           ->latest()
                           ->get();
                           
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil daftar promo aktif.',
                'data' => $promos
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data promo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * createPromo
     * Menambah promo (Admin)
     */
    public function createPromo(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'gambar' => 'required|image|mimes:jpeg,png,jpg|max:4000',
                'namaPromo' => 'required|string|max:60',
                'jenisPromo' => 'required|string|max:60',
                'kode' => 'required|string|max:12|unique:promo,kode',
                'diskon' => 'required|integer|min:0',
                'deskripsi' => 'required|string',
                'tanggalMulai' => 'required|date',
                'tanggalSelesai' => 'required|date|after_or_equal:tanggalMulai',
                'minimalTransaksi' => 'required|integer|min:0',
                'status' => 'required|boolean',
                'idKategori' => 'nullable|exists:kategoriProduk,idKategori',
                'idProduk' => 'nullable|exists:produkKlinik,idProduk'
            ], [
                'gambar.required' => 'Gambar promo wajib diunggah.',
                'gambar.image' => 'File harus berupa gambar.',
                'gambar.mimes' => 'Format gambar yang diperbolehkan adalah jpeg, png, atau jpg.',
                'gambar.max' => 'Ukuran gambar maksimal 4MB.',
                'kode.unique' => 'Kode promo sudah digunakan.',
                'idKategori.exists' => 'Kategori produk tidak ditemukan.',
                'idProduk.exists' => 'Produk klinik tidak ditemukan.',
                'tanggalSelesai.after_or_equal' => 'Tanggal selesai harus sama atau setelah tanggal mulai.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan pada inputan Anda.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $dataToInsert = $request->all();
            if ($request->hasFile('gambar')) {
                $file = $request->file('gambar');
                $filename = time() . '_' . uniqid() . '.webp';
                
                $manager = new ImageManager(new Driver());
                $image = $manager->decode($file->getPathname());
                $webpData = $image->encodeUsingFileExtension('webp', 80)->toString();
                
                Storage::disk('public')->put('promo/' . $filename, $webpData);
                $dataToInsert['gambar'] = 'promo/' . $filename;
            }

            $promo = Promo::create($dataToInsert);

            return response()->json([
                'success' => true,
                'message' => 'Promo berhasil ditambahkan.',
                'data' => $promo
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan promo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * updatePromo
     * Memperbarui promo (Admin)
     */
    public function updatePromo(Request $request, $idPromo)
    {
        try {
            $promo = Promo::find($idPromo);
            if (!$promo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Promo tidak ditemukan.'
                ], 404);
            }

            $rules = [
                'namaPromo' => 'required|string|max:60',
                'jenisPromo' => 'required|string|max:60',
                'kode' => 'required|string|max:12|unique:promo,kode,' . $idPromo . ',idPromo',
                'diskon' => 'required|integer|min:0',
                'deskripsi' => 'required|string',
                'tanggalMulai' => 'required|date',
                'tanggalSelesai' => 'required|date|after_or_equal:tanggalMulai',
                'minimalTransaksi' => 'required|integer|min:0',
                'status' => 'required|boolean',
                'idKategori' => 'nullable|exists:kategoriProduk,idKategori',
                'idProduk' => 'nullable|exists:produkKlinik,idProduk'
            ];

            if ($request->hasFile('gambar')) {
                $rules['gambar'] = 'image|mimes:jpeg,png,jpg|max:4000';
            }

            $validator = Validator::make($request->all(), $rules, [
                'gambar.image' => 'File harus berupa gambar.',
                'gambar.mimes' => 'Format gambar yang diperbolehkan adalah jpeg, png, atau jpg.',
                'gambar.max' => 'Ukuran gambar maksimal 4MB.',
                'kode.unique' => 'Kode promo sudah digunakan.',
                'idKategori.exists' => 'Kategori produk tidak ditemukan.',
                'idProduk.exists' => 'Produk klinik tidak ditemukan.',
                'tanggalSelesai.after_or_equal' => 'Tanggal selesai harus sama atau setelah tanggal mulai.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan pada inputan Anda.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $dataToUpdate = $request->except(['gambar']);
            if ($request->hasFile('gambar')) {
                if ($promo->gambar) {
                    Storage::disk('public')->delete($promo->gambar);
                }
                $file = $request->file('gambar');
                $filename = time() . '_' . uniqid() . '.webp';
                
                $manager = new ImageManager(new Driver());
                $image = $manager->decode($file->getPathname());
                $webpData = $image->encodeUsingFileExtension('webp', 80)->toString();
                
                Storage::disk('public')->put('promo/' . $filename, $webpData);
                $dataToUpdate['gambar'] = 'promo/' . $filename;
            }

            $promo->update($dataToUpdate);

            return response()->json([
                'success' => true,
                'message' => 'Promo berhasil diperbarui.',
                'data' => $promo
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui promo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * updateStatus
     * Memperbarui hanya status aktif/tidak aktif promo (Admin)
     */
    public function updateStatus(Request $request, $idPromo)
    {
        try {
            $promo = Promo::find($idPromo);
            if (!$promo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Promo tidak ditemukan.'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'status' => 'required|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $promo->update([
                'status' => $request->status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Status promo berhasil diperbarui.',
                'data' => $promo
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status promo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * deletePromo
     * Menghapus promo (Admin)
     */
    public function deletePromo($idPromo)
    {
        try {
            $promo = Promo::find($idPromo);
            if (!$promo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Promo tidak ditemukan.'
                ], 404);
            }
            if ($promo->gambar) {
                Storage::disk('public')->delete($promo->gambar);
            }
            $promo->delete();
            return response()->json([
                'success' => true,
                'message' => 'Promo berhasil dihapus.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus promo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * checkPromo
     * Memvalidasi kode promo saat checkout (Customer)
     */
    public function checkPromo(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'kode' => 'required|string|max:12',
                'cart_ids' => 'required|array',
                'cart_ids.*' => 'integer|exists:keranjang,idKeranjang'
            ], [
                'kode.required' => 'Kode promo wajib diisi.',
                'cart_ids.required' => 'Daftar item keranjang wajib dikirim.',
                'cart_ids.array' => 'Format daftar item keranjang tidak valid.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal.',
                    'errors' => $validator->errors()
                ], 422);
            }

            $promo = Promo::where('kode', $request->kode)->first();

            if (!$promo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Promo tidak ditemukan.'
                ], 404);
            }

            if (!$promo->status) {
                return response()->json([
                    'success' => false,
                    'message' => 'Promo sudah tidak aktif.'
                ], 400);
            }

            $today = Carbon::now()->format('Y-m-d');
            if ($today < $promo->tanggalMulai || $today > $promo->tanggalSelesai) {
                return response()->json([
                    'success' => false,
                    'message' => 'Promo sudah kedaluwarsa atau belum dimulai.'
                ], 400);
            }

            $user = auth()->user();
            $cartItems = Keranjang::where('idUser', $user->idUser)
                                  ->whereIn('idKeranjang', $request->cart_ids)
                                  ->with('produk')
                                  ->get();

            if ($cartItems->isEmpty() || count($cartItems) !== count($request->cart_ids)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Beberapa atau semua item keranjang tidak ditemukan.'
                ], 400);
            }

            $subtotal = 0;
            $isProductValid = false;

            // Jika idProduk dan idKategori promo null, promo berlaku untuk semua produk
            $isGlobalPromo = is_null($promo->idProduk) && is_null($promo->idKategori);

            foreach ($cartItems as $item) {
                $subtotal += ($item->jumlahProduk * $item->produk->harga);

                // Cek apakah produk atau kategori sesuai dengan promo
                if ($isGlobalPromo) {
                    $isProductValid = true;
                } elseif (!is_null($promo->idProduk) && $item->idProduk == $promo->idProduk) {
                    $isProductValid = true;
                } elseif (!is_null($promo->idKategori) && $item->produk->idKategori == $promo->idKategori) {
                    $isProductValid = true;
                }
            }

            if ($subtotal < $promo->minimalTransaksi) {
                return response()->json([
                    'success' => false,
                    'message' => 'Minimal transaksi tidak terpenuhi. Minimal belanja untuk promo ini adalah Rp ' . number_format($promo->minimalTransaksi, 0, ',', '.')
                ], 400);
            }

            if (!$isProductValid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Promo ini tidak berlaku untuk produk di keranjang Anda.'
                ], 400);
            }

            // Hitung nilai diskon sebenarnya untuk ditampilkan di frontend
            $nilaiDiskon = 0;
            $jenisPromoLower = strtolower($promo->jenisPromo);
            if ($jenisPromoLower === 'diskon persen' || $jenisPromoLower === 'persen' || $jenisPromoLower === 'persentase') {
                $nilaiDiskon = $subtotal * ($promo->diskon / 100);
            } elseif ($jenisPromoLower === 'potongan harga' || $jenisPromoLower === 'nominal') {
                $nilaiDiskon = $promo->diskon;
            } elseif ($jenisPromoLower === 'gratis produk') {
                if (is_null($promo->idProduk)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Konfigurasi promo tidak valid: Promo Gratis Produk harus memiliki produk bonus (idProduk).'
                    ], 400);
                }
                $nilaiDiskon = 0; // Diskon nominal 0, karena bonus berupa barang fisik
            } else {
                $nilaiDiskon = $promo->diskon; // Fallback
            }

            return response()->json([
                'success' => true,
                'message' => 'Promo berhasil digunakan.',
                'data' => [
                    'idPromo' => $promo->idPromo,
                    'kode' => $promo->kode,
                    'jenisPromo' => $promo->jenisPromo,
                    'diskon_nominal' => $nilaiDiskon,
                    'diskon_raw' => $promo->diskon,
                    'namaPromo' => $promo->namaPromo,
                    'idProdukBonus' => $jenisPromoLower === 'gratis produk' ? $promo->idProduk : null
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat mengecek promo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

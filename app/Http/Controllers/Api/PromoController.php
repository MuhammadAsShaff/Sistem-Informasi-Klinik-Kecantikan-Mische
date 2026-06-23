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
     * 
     * Menarik semua data promo (baik yang masih aktif, sudah mati, maupun kedaluwarsa). Khusus untuk halaman Admin.
     */
    public function getAllPromos()
    {
        try {
            // Relasikan dengan master kategori dan produk agar admin tahu promo ini berlaku untuk Kategori apa / Produk apa
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
     * 
     * Menampilkan banner promo pada halaman Landing Page Customer.
     * Tentu saja HANYA Promo yang STATUSNYA AKTIF yang boleh tampil! (where status = true).
     */
    public function getPublicPromos()
    {
        try {
            $promos = Promo::with(['kategori', 'produk'])
                           ->where('status', true) // Filter ini sangat krusial!
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
     * 
     * Menambahkan kampanye promo diskon baru oleh Admin.
     */
    public function createPromo(Request $request)
    {
        try {
            // Pembersihan Bug: Terkadang Form Data JS dari browser mengirim teks mentah "null" alih-alih data Null sejati.
            // Kita paksa konversi jadi Null PHP agar tidak error masuk ke Database.
            if (in_array($request->input('idKategori'), ['null', 'undefined', ''])) {
                $request->merge(['idKategori' => null]);
            }
            if (in_array($request->input('idProduk'), ['null', 'undefined', ''])) {
                $request->merge(['idProduk' => null]);
            }

            $validator = Validator::make($request->all(), [
                'gambar' => 'required|image|mimes:jpeg,png,jpg|max:4000',
                'namaPromo' => 'required|string|max:60',
                'jenisPromo' => 'required|string|max:60',
                'kode' => 'required|string|max:12|unique:promo,kode', // Kode (misal HARBOLNAS12) harus unik!
                'diskon' => 'required|integer|min:0',
                'deskripsi' => 'required|string',
                'tanggalMulai' => 'required|date',
                'tanggalSelesai' => 'required|date|after_or_equal:tanggalMulai',
                'minimalTransaksi' => 'required|integer|min:0',
                'status' => 'required|boolean',
                'idKategori' => 'nullable|exists:kategoriProduk,idKategori',
                'idProduk' => 'nullable|exists:produkKlinik,idProduk'
            ], [
                // Pesan Error Bahasa Indonesia ...
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

            // Aturan Bisnis Krusial: Promo hanya boleh DUA TIPE.
            // 1. Promo Global (berlaku untuk semua = kategori dan produk dikosongkan)
            // 2. Promo Spesifik (hanya produk X, ATAU hanya kategori Y)
            // TIDAK BOLEH memasukkan kategori DAN produk secara bersamaan untuk mencegah konflik prioritas diskon.
            if (!is_null($request->input('idKategori')) && !is_null($request->input('idProduk'))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan pada inputan Anda.',
                    'errors' => [
                        'idKategori' => ['Tidak bisa memilih Kategori dan Produk secara bersamaan. Pilih salah satu, atau kosongkan keduanya.'],
                        'idProduk' => ['Tidak bisa memilih Kategori dan Produk secara bersamaan.']
                    ]
                ], 400);
            }

            $dataToInsert = $request->all();
            
            // Proses Kompresi Banner Promo menjadi WebP
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
     * 
     * Mengedit aturan atau besaran diskon promo (Khusus Admin).
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

            // Pembersihan Bug JS Null (Seperti pada Create)
            if ($request->has('idKategori') && in_array($request->input('idKategori'), ['null', 'undefined', ''])) {
                $request->merge(['idKategori' => null]);
            }
            if ($request->has('idProduk') && in_array($request->input('idProduk'), ['null', 'undefined', ''])) {
                $request->merge(['idProduk' => null]);
            }

            // Pengecualian Validasi Unik: Biarkan dia menyimpan kode promo yang sama dengan dirinya sendiri (idPromo miliknya)
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

            // Aturan Bisnis Krusial
            if (!is_null($request->input('idKategori')) && !is_null($request->input('idProduk'))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan pada inputan Anda.',
                    'errors' => [
                        'idKategori' => ['Tidak bisa memilih Kategori dan Produk secara bersamaan. Pilih salah satu, atau kosongkan keduanya.'],
                        'idProduk' => ['Tidak bisa memilih Kategori dan Produk secara bersamaan.']
                    ]
                ], 400);
            }

            $dataToUpdate = $request->except(['gambar']);
            
            // Proses Ganti Gambar Promo Baru
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
     * 
     * Tombol cepat (Toggle) untuk mematikan atau menyalakan Promo secara instan tanpa mengedit deskripsinya.
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
     * 
     * Menghapus secara permanen banner kampanye Promo dari sistem (Dan menghapus gambarnya).
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
     * 
     * JANTUNG DARI FITUR PROMO! (Saat Customer mengetik kode promo di Keranjang Belanja).
     * Mengecek puluhan kriteria (Tanggal, Status, Produk, Minimal Belanja) sebelum mengesahkan diskon.
     */
    public function checkPromo(Request $request)
    {
        try {
            // 1. Pastikan user mengetik sesuatu (kode) dan membawa ID isi keranjangnya
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

            // 2. Cari kode tersebut di database
            $promo = Promo::where('kode', $request->kode)->first();

            // Skenario Error A: Kode Ngawur
            if (!$promo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Promo tidak ditemukan.'
                ], 404);
            }

            // Skenario Error B: Promo sudah dimatikan Admin
            if (!$promo->status) {
                return response()->json([
                    'success' => false,
                    'message' => 'Promo sudah tidak aktif.'
                ], 400);
            }

            // Skenario Error C: Belum Waktunya atau Sudah Basi (Expired)
            $today = Carbon::now()->format('Y-m-d');
            if ($today < $promo->tanggalMulai || $today > $promo->tanggalSelesai) {
                return response()->json([
                    'success' => false,
                    'message' => 'Promo sudah kedaluwarsa atau belum dimulai.'
                ], 400);
            }

            // 3. Tarik isi belanjaannya Customer dari database untuk mulai dihitung
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

            // Jika Promo ini adalah "Promo Global" (Tanpa Kategori Tertentu / Tanpa Barang Tertentu)
            $isGlobalPromo = is_null($promo->idProduk) && is_null($promo->idKategori);

            // Menghitung uang yang harus dibayar
            foreach ($cartItems as $item) {
                $subtotal += ($item->jumlahProduk * $item->produk->harga);

                // Mencari tahu, apakah di dalam keranjangnya ada barang yang MENCAKUP Promo ini?
                if ($isGlobalPromo) {
                    $isProductValid = true; // Langsung valid karena global
                } elseif (!is_null($promo->idProduk) && $item->idProduk == $promo->idProduk) {
                    $isProductValid = true; // Valid! Ternyata dia beli barang yang sedang didiskon
                } elseif (!is_null($promo->idKategori) && $item->produk->idKategori == $promo->idKategori) {
                    $isProductValid = true; // Valid! Ternyata dia beli barang dari Kategori yang sedang didiskon
                }
            }

            // Skenario Error D: Uangnya kurang dari syarat minimal (Contoh: Minimal belanja 100rb)
            if ($subtotal < $promo->minimalTransaksi) {
                return response()->json([
                    'success' => false,
                    'message' => 'Minimal transaksi tidak terpenuhi. Minimal belanja untuk promo ini adalah Rp ' . number_format($promo->minimalTransaksi, 0, ',', '.')
                ], 400);
            }

            // Skenario Error E: Keranjangnya isinya Lipstik, tapi dia masukin Kupon Diskon Facial Wash.
            if (!$isProductValid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Promo ini tidak berlaku untuk produk di keranjang Anda.'
                ], 400);
            }

            // 4. Kalkulator Besaran Diskon yang Akan Dipotong
            $nilaiDiskon = 0;
            $jenisPromoLower = strtolower($promo->jenisPromo);
            
            // Logika Jenis Promo
            if ($jenisPromoLower === 'diskon persen' || $jenisPromoLower === 'persen' || $jenisPromoLower === 'persentase') {
                // (Persen: Subtotal dikali sekian persen)
                $nilaiDiskon = $subtotal * ($promo->diskon / 100);
            } elseif ($jenisPromoLower === 'potongan harga' || $jenisPromoLower === 'nominal') {
                // (Potongan Langsung: Langsung potong 50ribu)
                $nilaiDiskon = $promo->diskon;
            } elseif ($jenisPromoLower === 'gratis produk') {
                // (Beli 1 Gratis 1: Diskon nominalnya 0, tapi ada hadiah barang yang ikut)
                if (is_null($promo->idProduk)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Konfigurasi promo tidak valid: Promo Gratis Produk harus memiliki produk bonus (idProduk).'
                    ], 400);
                }
                $nilaiDiskon = 0; 
            } else {
                $nilaiDiskon = $promo->diskon; // Fallback darurat
            }

            // 5. Berikan Izin Lolos (Success 200) beserta rincian potongannya
            return response()->json([
                'success' => true,
                'message' => 'Promo berhasil digunakan.',
                'data' => [
                    'idPromo' => $promo->idPromo,
                    'kode' => $promo->kode,
                    'jenisPromo' => $promo->jenisPromo,
                    'diskon_nominal' => $nilaiDiskon,   // Berapa Rupiah hasil potongannya
                    'diskon_raw' => $promo->diskon,     // Angka mentah (Misal: 10 dari 10%)
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

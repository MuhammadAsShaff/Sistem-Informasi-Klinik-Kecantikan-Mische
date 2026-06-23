<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Keranjang;
use App\Models\ProdukKlinik;
use Illuminate\Support\Facades\Validator;

class KeranjangController extends Controller
{
    /**
     * getCart
     * 
     * Menarik seluruh data keranjang belanja milik Customer yang sedang login.
     * Nantinya akan ditampilkan di halaman 'Cart/Keranjang' sebelum lanjut ke Checkout.
     */
    public function getCart()
    {
        try {
            $idUser = auth('api')->user()->idUser;
            // with('produk') mengambil detail nama & gambar barang secara otomatis dari tabel ProdukKlinik
            $keranjang = Keranjang::with('produk')->where('idUser', $idUser)->get();
            
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil data keranjang.',
                'data' => $keranjang
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data keranjang.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * addToCart
     * 
     * Aksi saat Customer menekan tombol "Tambah ke Keranjang" di halaman detail produk.
     */
    public function addToCart(Request $request)
    {
        try {
            // 1. Validasi Input
            $validator = Validator::make($request->all(), [
                'idProduk' => 'required|exists:produkKlinik,idProduk',
                'jumlahProduk' => 'required|integer|min:1'
            ], [
                'idProduk.required' => 'Produk wajib diisi.',
                'idProduk.exists' => 'Produk tidak ditemukan.',
                'jumlahProduk.required' => 'Jumlah produk wajib diisi.',
                'jumlahProduk.min' => 'Jumlah produk minimal 1.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan pada inputan Anda.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $idUser = auth('api')->user()->idUser;
            
            // 2. Tarik master data produk untuk mengecek stok aslinya
            $produk = ProdukKlinik::find($request->idProduk);

            // 3. Pengecekan Logika Bisnis: Cegah Penimbunan Melebihi Stok!
            if ($request->jumlahProduk > $produk->stock) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jumlah yang diminta melebihi stok yang tersedia.'
                ], 400);
            }

            // 4. Cek apakah barang yang sama ini sudah pernah dimasukkan ke keranjang sebelumnya?
            $keranjang = Keranjang::where('idUser', $idUser)->where('idProduk', $request->idProduk)->first();

            if ($keranjang) {
                // JIKA SUDAH ADA: Jangan buat baris baru di DB, cukup TAMBAHKAN jumlah kuantitasnya saja
                $newJumlah = $keranjang->jumlahProduk + $request->jumlahProduk;
                
                // Pastikan hasil penjumlahannya tetap tidak melebihi stok gudang
                if ($newJumlah > $produk->stock) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Total jumlah di keranjang melebihi stok yang tersedia.'
                    ], 400);
                }
                
                // Simpan update jumlah
                $keranjang->update(['jumlahProduk' => $newJumlah]);
            } else {
                // JIKA BELUM ADA: Baru kita buat row/baris baru di database
                $keranjang = Keranjang::create([
                    'idUser' => $idUser,
                    'idProduk' => $request->idProduk,
                    'jumlahProduk' => $request->jumlahProduk
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil ditambahkan ke keranjang.',
                'data' => $keranjang
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan ke keranjang.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * updateCart
     * 
     * Saat customer memencet tombol plus (+ / -) di halaman Keranjang untuk menambah/mengurangi qty.
     */
    public function updateCart(Request $request, $idKeranjang)
    {
        try {
            $validator = Validator::make($request->all(), [
                'jumlahProduk' => 'required|integer|min:1'
            ], [
                'jumlahProduk.required' => 'Jumlah produk wajib diisi.',
                'jumlahProduk.min' => 'Jumlah produk minimal 1.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan pada inputan Anda.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $idUser = auth('api')->user()->idUser;
            
            // Keamanan: Pastikan hanya bisa mengedit keranjangnya sendiri
            $keranjang = Keranjang::where('idUser', $idUser)->where('idKeranjang', $idKeranjang)->first();

            if (!$keranjang) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data keranjang tidak ditemukan.'
                ], 404);
            }

            $produk = ProdukKlinik::find($keranjang->idProduk);

            // Validasi Stok
            if ($request->jumlahProduk > $produk->stock) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jumlah yang diminta melebihi stok yang tersedia.'
                ], 400);
            }

            // Terapkan Perubahan
            $keranjang->update(['jumlahProduk' => $request->jumlahProduk]);

            return response()->json([
                'success' => true,
                'message' => 'Jumlah produk di keranjang berhasil diperbarui.',
                'data' => $keranjang
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui keranjang.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * deleteFromCart
     * 
     * Menghapus salah satu item (baris produk) dari dalam Keranjang (Customer pencet ikon tong sampah).
     */
    public function deleteFromCart($idKeranjang)
    {
        try {
            $idUser = auth('api')->user()->idUser;
            
            // Keamanan: Hanya hapus keranjang miliknya sendiri
            $keranjang = Keranjang::where('idUser', $idUser)->where('idKeranjang', $idKeranjang)->first();

            if (!$keranjang) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data keranjang tidak ditemukan.'
                ], 404);
            }

            $keranjang->delete();

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil dihapus dari keranjang.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus keranjang.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

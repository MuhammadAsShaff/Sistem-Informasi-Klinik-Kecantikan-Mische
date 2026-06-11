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
     * Menampilkan data produk di keranjang (Customer)
     */
    public function getCart()
    {
        try {
            $idUser = auth('api')->user()->idUser;
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
     * Menambahkan ke keranjang (Customer)
     */
    public function addToCart(Request $request)
    {
        try {
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
            $produk = ProdukKlinik::find($request->idProduk);

            if ($request->jumlahProduk > $produk->stock) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jumlah yang diminta melebihi stok yang tersedia.'
                ], 400);
            }

            // Cek apakah produk sudah ada di keranjang
            $keranjang = Keranjang::where('idUser', $idUser)->where('idProduk', $request->idProduk)->first();

            if ($keranjang) {
                $newJumlah = $keranjang->jumlahProduk + $request->jumlahProduk;
                if ($newJumlah > $produk->stock) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Total jumlah di keranjang melebihi stok yang tersedia.'
                    ], 400);
                }
                $keranjang->update(['jumlahProduk' => $newJumlah]);
            } else {
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
     * Memperbarui jumlah produk di keranjang (Customer)
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
            $keranjang = Keranjang::where('idUser', $idUser)->where('idKeranjang', $idKeranjang)->first();

            if (!$keranjang) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data keranjang tidak ditemukan.'
                ], 404);
            }

            $produk = ProdukKlinik::find($keranjang->idProduk);

            if ($request->jumlahProduk > $produk->stock) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jumlah yang diminta melebihi stok yang tersedia.'
                ], 400);
            }

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
     * Menghapus data dari keranjang (Customer)
     */
    public function deleteFromCart($idKeranjang)
    {
        try {
            $idUser = auth('api')->user()->idUser;
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

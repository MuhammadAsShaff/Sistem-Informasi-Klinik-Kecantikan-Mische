<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Promo;
use Illuminate\Support\Facades\Validator;

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
                'gambar' => 'required|string',
                'namaPromo' => 'required|string|max:60',
                'jenisPromo' => 'required|string|max:60',
                'kode' => 'required|string|max:12|unique:promo,kode',
                'diskon' => 'required|integer|min:0',
                'deskripsi' => 'required|string',
                'tanggalMulai' => 'required|date',
                'tanggalSelesai' => 'required|date|after_or_equal:tanggalMulai',
                'minimalTransaksi' => 'required|integer|min:0',
                'status' => 'required|boolean',
                'idKategori' => 'required|exists:kategoriProduk,idKategori',
                'idProduk' => 'required|exists:produkKlinik,idProduk'
            ], [
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

            $promo = Promo::create($request->all());

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

            $validator = Validator::make($request->all(), [
                'gambar' => 'required|string',
                'namaPromo' => 'required|string|max:60',
                'jenisPromo' => 'required|string|max:60',
                'kode' => 'required|string|max:12|unique:promo,kode,' . $idPromo . ',idPromo',
                'diskon' => 'required|integer|min:0',
                'deskripsi' => 'required|string',
                'tanggalMulai' => 'required|date',
                'tanggalSelesai' => 'required|date|after_or_equal:tanggalMulai',
                'minimalTransaksi' => 'required|integer|min:0',
                'status' => 'required|boolean',
                'idKategori' => 'required|exists:kategoriProduk,idKategori',
                'idProduk' => 'required|exists:produkKlinik,idProduk'
            ], [
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

            $promo->update($request->all());

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
}

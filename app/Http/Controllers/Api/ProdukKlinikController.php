<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\ProdukKlinik;
use App\Models\Penjualan;
use App\Models\DetailPenjualan;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProdukKlinikController extends Controller
{
    /**
     * Menampilkan daftar produk (Admin)
     */
    public function getAllProducts()
    {
        $produk = ProdukKlinik::with('kategori')->get();
        return response()->json([
            'status' => 'success',
            'data' => $produk
        ], 200);
    }

    /**
     * Menambahkan data produk (Admin)
     */
    public function createProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'harga' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'gambar' => 'nullable|string',
            'idKategori' => 'required|exists:kategoriproduk,idKategori'
        ], [
            'nama.required' => 'Nama produk wajib diisi.',
            'nama.string' => 'Nama produk harus berupa teks.',
            'nama.max' => 'Nama produk maksimal 255 karakter.',
            'deskripsi.string' => 'Deskripsi harus berupa teks.',
            'harga.required' => 'Harga produk wajib diisi.',
            'harga.numeric' => 'Harga produk harus berupa angka.',
            'harga.min' => 'Harga produk tidak boleh kurang dari 0.',
            'stock.required' => 'Stok produk wajib diisi.',
            'stock.integer' => 'Stok produk harus berupa angka bulat.',
            'stock.min' => 'Stok produk tidak boleh kurang dari 0.',
            'gambar.string' => 'Format gambar tidak valid.',
            'idKategori.required' => 'Kategori produk wajib dipilih.',
            'idKategori.exists' => 'Kategori produk yang dipilih tidak ditemukan di database.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 422);
        }

        $produk = ProdukKlinik::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Produk berhasil ditambahkan',
            'data' => $produk
        ], 201);
    }

    /**
     * Memperbarui data produk (Admin)
     */
    public function updateProduct(Request $request, $idProduk)
    {
        $produk = ProdukKlinik::find($idProduk);
        if (!$produk) {
            return response()->json(['status' => 'error', 'message' => 'Produk tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'harga' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'gambar' => 'nullable|string',
            'idKategori' => 'required|exists:kategoriproduk,idKategori'
        ], [
            'nama.required' => 'Nama produk wajib diisi.',
            'nama.string' => 'Nama produk harus berupa teks.',
            'nama.max' => 'Nama produk maksimal 255 karakter.',
            'deskripsi.string' => 'Deskripsi harus berupa teks.',
            'harga.required' => 'Harga produk wajib diisi.',
            'harga.numeric' => 'Harga produk harus berupa angka.',
            'harga.min' => 'Harga produk tidak boleh kurang dari 0.',
            'stock.required' => 'Stok produk wajib diisi.',
            'stock.integer' => 'Stok produk harus berupa angka bulat.',
            'stock.min' => 'Stok produk tidak boleh kurang dari 0.',
            'gambar.string' => 'Format gambar tidak valid.',
            'idKategori.required' => 'Kategori produk wajib dipilih.',
            'idKategori.exists' => 'Kategori produk yang dipilih tidak ditemukan di database.'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()], 422);
        }

        $produk->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Produk berhasil diperbarui',
            'data' => $produk
        ], 200);
    }

    /**
     * Memperbarui stok produk (Admin)
     */
    public function updateStock(Request $request, $idProduk)
    {
        $produk = ProdukKlinik::find($idProduk);
        if (!$produk) {
            return response()->json(['status' => 'error', 'message' => 'Produk tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'stock' => 'required|integer|min:0'
        ], [
            'stock.required' => 'Stok produk wajib diisi.',
            'stock.integer' => 'Stok produk harus berupa angka bulat.',
            'stock.min' => 'Stok produk tidak boleh kurang dari 0.'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()], 422);
        }

        $produk->update(['stock' => $request->stock]);

        return response()->json([
            'status' => 'success',
            'message' => 'Stok produk berhasil diperbarui',
            'data' => $produk
        ], 200);
    }

    /**
     * Menghapus data produk (Admin)
     */
    public function deleteProduct($idProduk)
    {
        $produk = ProdukKlinik::find($idProduk);
        if (!$produk) {
            return response()->json(['status' => 'error', 'message' => 'Produk tidak ditemukan'], 404);
        }

        $produk->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Produk berhasil dihapus'
        ], 200);
    }

    /**
     * Menampilkan daftar produk (Customer)
     */
    public function getPublicProducts()
    {
        $produk = ProdukKlinik::where('stock', '>', 0)->with('kategori')->get();
        return response()->json([
            'status' => 'success',
            'data' => $produk
        ], 200);
    }

    /**
     * Menampilkan detail produk (Customer)
     */
    public function getProductById($idProduk)
    {
        $produk = ProdukKlinik::with('kategori')->find($idProduk);
        if (!$produk) {
            return response()->json(['status' => 'error', 'message' => 'Produk tidak ditemukan'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $produk
        ], 200);
    }

    /**
     * Memesan produk langsung (Customer)
     */
    public function orderProduct(Request $request, $idProduk)
    {
        $produk = ProdukKlinik::find($idProduk);
        if (!$produk) {
            return response()->json(['status' => 'error', 'message' => 'Produk tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'jumlah' => 'required|integer|min:1',
            'idPromo' => 'required|exists:promo,idPromo'
        ], [
            'jumlah.required' => 'Jumlah pesanan wajib diisi.',
            'jumlah.integer' => 'Jumlah pesanan harus berupa angka bulat.',
            'jumlah.min' => 'Jumlah pesanan minimal 1.',
            'idPromo.required' => 'Promo wajib dipilih.',
            'idPromo.exists' => 'Promo yang dipilih tidak valid atau tidak ditemukan.'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()], 422);
        }

        $jumlah = $request->jumlah;

        if ($produk->stock < $jumlah) {
            return response()->json(['status' => 'error', 'message' => 'Stok produk tidak mencukupi'], 400);
        }

        DB::beginTransaction();
        try {
            // Kurangi stok produk
            $produk->decrement('stock', $jumlah);

            // Buat record penjualan
            $totalHarga = $produk->harga * $jumlah;
            $penjualan = Penjualan::create([
                'tanggal' => now(),
                'totalHarga' => $totalHarga,
                'status' => 'pending',
                'idUser' => auth('api')->user()->idUser,
                'idPromo' => $request->idPromo
            ]);

            // Buat record detail penjualan
            DetailPenjualan::create([
                'jumlahProduk' => $jumlah,
                'idPenjualan' => $penjualan->idPenjualan,
                'idProduk' => $produk->idProduk
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Pesanan produk berhasil dibuat',
                'data' => $penjualan
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memproses pesanan: ' . $e->getMessage()
            ], 500);
        }
    }
}

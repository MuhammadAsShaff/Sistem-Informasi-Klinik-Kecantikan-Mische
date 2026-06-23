<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\KategoriProduk;
use Illuminate\Support\Facades\Validator;

class KategoriProdukController extends Controller
{
    /**
     * getAllCategories
     * 
     * Menampilkan daftar semua kategori (Contoh: Skincare, Bodycare, Haircare).
     */
    public function getAllCategories()
    {
        $kategori = KategoriProduk::all();
        
        return response()->json([
            'status' => 'success',
            'data' => $kategori
        ], 200);
    }

    /**
     * getProductCountByCategory
     * 
     * Menampilkan daftar kategori, tapi DITAMBAH dengan angka jumlah produk yang ada di dalam kategori tersebut.
     * (Contoh output: "Skincare (10 Produk)", "Bodycare (5 Produk)").
     */
    public function getProductCountByCategory()
    {
        try {
            // withCount('produkklinik') secara otomatis akan menghitung jumlah relasi anak (produk) dari setiap kategori
            $kategori = KategoriProduk::withCount('produkklinik')->get();
            
            // Format ulang array JSON agar namanya lebih enak dibaca oleh Frontend (produkklinik_count diubah jadi jumlahProduk)
            $formattedData = $kategori->map(function ($item) {
                return [
                    'idKategori' => $item->idKategori,
                    'namaKategori' => $item->nama,
                    'jumlahProduk' => $item->produkklinik_count
                ];
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Berhasil mengambil jumlah produk per kategori',
                'data' => $formattedData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan pada server',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * createCategory
     * 
     * Menambahkan label kategori baru (Khusus Admin).
     */
    public function createCategory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string'
        ], [
            'nama.required' => 'Nama kategori wajib diisi.',
            'nama.string' => 'Nama kategori harus berupa teks.',
            'nama.max' => 'Nama kategori maksimal 255 karakter.',
            'deskripsi.string' => 'Deskripsi harus berupa teks.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 422);
        }

        $kategori = KategoriProduk::create([
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori produk berhasil ditambahkan',
            'data' => $kategori
        ], 201);
    }

    /**
     * updateCategory
     * 
     * Mengubah nama / deksripsi kategori (Khusus Admin).
     */
    public function updateCategory(Request $request, $idKategori)
    {
        $kategori = KategoriProduk::find($idKategori);

        if (!$kategori) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kategori produk tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string'
        ], [
            'nama.required' => 'Nama kategori wajib diisi.',
            'nama.string' => 'Nama kategori harus berupa teks.',
            'nama.max' => 'Nama kategori maksimal 255 karakter.',
            'deskripsi.string' => 'Deskripsi harus berupa teks.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 422);
        }

        $kategori->update([
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori produk berhasil diperbarui',
            'data' => $kategori
        ], 200);
    }

    /**
     * deleteCategory
     * 
     * Menghapus kategori produk (Khusus Admin).
     */
    public function deleteCategory($idKategori)
    {
        $kategori = KategoriProduk::find($idKategori);

        if (!$kategori) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kategori produk tidak ditemukan'
            ], 404);
        }

        // Validasi Bisnis: Jangan hapus kategori JIKA di dalamnya masih ada produk yang menumpang pada kategori ini!
        // Kalau dihapus paksa, produk-produk tersebut bisa jadi yatim-piatu (error database).
        if ($kategori->produkklinik()->count() > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus kategori karena masih digunakan pada produk'
            ], 400); // 400 Bad Request
        }

        $kategori->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori produk berhasil dihapus'
        ], 200);
    }
}

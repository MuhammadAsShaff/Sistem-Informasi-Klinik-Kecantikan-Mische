<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\KategoriProduk;
use Illuminate\Support\Facades\Validator;

class KategoriProdukController extends Controller
{
    /**
     * Menampilkan daftar kategori
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
     * Menambahkan data kategori
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
     * Memperbarui kategori
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
     * Menghapus data kategori
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

        // Opsional: Validasi jika kategori masih dipakai produk
        if ($kategori->produkklinik()->count() > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus kategori karena masih digunakan pada produk'
            ], 400);
        }

        $kategori->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori produk berhasil dihapus'
        ], 200);
    }
}

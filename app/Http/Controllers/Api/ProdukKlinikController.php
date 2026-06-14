<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\ProdukKlinik;
use App\Models\Penjualan;
use App\Models\DetailPenjualan;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
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
            'gambar' => 'required|image|mimes:jpeg,png,jpg|max:4000',
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
            'gambar.required' => 'Gambar produk wajib diunggah.',
            'gambar.image' => 'File harus berupa gambar.',
            'gambar.mimes' => 'Format gambar yang diperbolehkan adalah jpeg, png, atau jpg.',
            'gambar.max' => 'Ukuran gambar maksimal 4MB.',
            'idKategori.required' => 'Kategori produk wajib dipilih.',
            'idKategori.exists' => 'Kategori produk yang dipilih tidak ditemukan di database.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 422);
        }

        $dataToInsert = $request->except('gambar');

        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = time() . '_' . uniqid() . '.webp';
            
            $manager = new ImageManager(new Driver());
            $image = $manager->decode($file->getPathname());
            $webpData = $image->encodeUsingFileExtension('webp', 80)->toString();
            
            Storage::disk('public')->put('produk/' . $filename, $webpData);
            $dataToInsert['gambar'] = 'produk/' . $filename;
        }

        $produk = ProdukKlinik::create($dataToInsert);

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
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:4000',
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
            'gambar.image' => 'File harus berupa gambar.',
            'gambar.mimes' => 'Format gambar yang diperbolehkan adalah jpeg, png, atau jpg.',
            'gambar.max' => 'Ukuran gambar maksimal 4MB.',
            'idKategori.required' => 'Kategori produk wajib dipilih.',
            'idKategori.exists' => 'Kategori produk yang dipilih tidak ditemukan di database.'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()], 422);
        }

        $dataToUpdate = $request->except('gambar');

        if ($request->hasFile('gambar')) {
            if ($produk->gambar) {
                Storage::disk('public')->delete($produk->gambar);
            }
            $file = $request->file('gambar');
            $filename = time() . '_' . uniqid() . '.webp';
            
            $manager = new ImageManager(new Driver());
            $image = $manager->decode($file->getPathname());
            $webpData = $image->encodeUsingFileExtension('webp', 80)->toString();
            
            Storage::disk('public')->put('produk/' . $filename, $webpData);
            $dataToUpdate['gambar'] = 'produk/' . $filename;
        }

        $produk->update($dataToUpdate);

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

        if ($produk->gambar) {
            Storage::disk('public')->delete($produk->gambar);
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

}

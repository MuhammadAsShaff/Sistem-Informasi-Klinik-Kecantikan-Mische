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
     * getAllProducts
     * 
     * Menampilkan daftar semua produk beserta kategorinya (Khusus Admin, termasuk yang stok habis).
     */
    public function getAllProducts()
    {
        // Menarik semua data produk dan merelasikannya langsung dengan tabel kategori agar nama kategori ikut tampil
        $produk = ProdukKlinik::with('kategori')->get();
        return response()->json([
            'status' => 'success',
            'data' => $produk
        ], 200);
    }

    /**
     * createProduct
     * 
     * Menambahkan data produk baru oleh Admin. Termasuk otomatis mengkompres gambar ke WebP agar website lebih cepat dimuat.
     */
    public function createProduct(Request $request)
    {
        // 1. Validasi Inputan form dari Admin
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'harga' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'berat' => 'required|integer|min:1', // Berat dipakai nanti untuk ongkir
            'gambar' => 'required|image|mimes:jpeg,png,jpg|max:4000', // max 4MB
            'idKategori' => 'required|exists:kategoriproduk,idKategori'
        ], [
            // Custom pesan bahasa Indonesia agar admin mudah mengerti jika ada error
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
            'berat.required' => 'Berat produk wajib diisi.',
            'berat.integer' => 'Berat produk harus berupa angka bulat.',
            'berat.min' => 'Berat produk minimal 1 gram.',
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

        // Ambil semua data teks (selain gambar)
        $dataToInsert = $request->except('gambar');

        // 2. Manipulasi & Kompresi Gambar
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            
            // Generate nama file acak yang aman (Contoh: 170023456_aBcDeF.webp)
            $filename = time() . '_' . uniqid() . '.webp';
            
            // Menggunakan library Intervention Image untuk mengkompres JPG/PNG menjadi WEBP (kualitas 80%)
            $manager = new ImageManager(new Driver());
            $image = $manager->decode($file->getPathname());
            $webpData = $image->encodeUsingFileExtension('webp', 80)->toString();
            
            // Simpan gambar tersebut ke dalam folder storage public /produk
            Storage::disk('public')->put('produk/' . $filename, $webpData);
            
            // Masukkan path gambar ke dalam array data yang akan disimpan ke database
            $dataToInsert['gambar'] = 'produk/' . $filename;
        }

        // 3. Simpan ke database
        $produk = ProdukKlinik::create($dataToInsert);

        return response()->json([
            'status' => 'success',
            'message' => 'Produk berhasil ditambahkan',
            'data' => $produk
        ], 201);
    }

    /**
     * updateProduct
     * 
     * Memperbarui detail informasi produk yang sudah ada.
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
            'berat' => 'required|integer|min:1',
            // Gambar boleh null (tidak wajib diisi) jika admin hanya ingin mengubah teks saja
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:4000',
            'idKategori' => 'required|exists:kategoriproduk,idKategori'
        ], [
            // ... (Pesan error disamakan seperti fungsi create) ...
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
            'berat.required' => 'Berat produk wajib diisi.',
            'berat.integer' => 'Berat produk harus berupa angka bulat.',
            'berat.min' => 'Berat produk minimal 1 gram.',
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

        // Jika admin mengupload gambar baru
        if ($request->hasFile('gambar')) {
            // Hapus fisik gambar yang lama di dalam server agar storage tidak bengkak
            if ($produk->gambar) {
                Storage::disk('public')->delete($produk->gambar);
            }
            
            // Lakukan proses kompresi webp sama seperti saat create
            $file = $request->file('gambar');
            $filename = time() . '_' . uniqid() . '.webp';
            
            $manager = new ImageManager(new Driver());
            $image = $manager->decode($file->getPathname());
            $webpData = $image->encodeUsingFileExtension('webp', 80)->toString();
            
            Storage::disk('public')->put('produk/' . $filename, $webpData);
            $dataToUpdate['gambar'] = 'produk/' . $filename;
        }

        // Terapkan semua perubahan di database
        $produk->update($dataToUpdate);

        return response()->json([
            'status' => 'success',
            'message' => 'Produk berhasil diperbarui',
            'data' => $produk
        ], 200);
    }

    /**
     * updateStock
     * 
     * Memperbarui HANYA angka stok produk dengan cepat tanpa perlu edit seluruh detail produk (Admin)
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
     * deleteProduct
     * 
     * Menghapus produk secara permanen dari database
     */
    public function deleteProduct($idProduk)
    {
        $produk = ProdukKlinik::find($idProduk);
        if (!$produk) {
            return response()->json(['status' => 'error', 'message' => 'Produk tidak ditemukan'], 404);
        }

        // Hapus fisik gambar produk di server sebelum data database dihapus
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
     * getPublicProducts
     * 
     * Menampilkan katalog produk kepada Publik/Customer (Tamu Web E-Commerce).
     * Berbeda dengan Admin, ini hanya menampilkan barang yang STOK-NYA ADA (> 0).
     */
    public function getPublicProducts(Request $request)
    {
        // Hanya tarik produk yang ready stock
        $query = ProdukKlinik::where('stock', '>', 0)->with('kategori');

        // Jika frontend mengirim parameter ?idKategori=1 di URL, maka saring/filter berdasarkan kategori tersebut (Fitur Tab)
        if ($request->has('idKategori')) {
            $query->where('idKategori', $request->idKategori);
        }

        $produk = $query->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $produk
        ], 200);
    }

    /**
     * getProductById
     * 
     * Menampilkan detail lengkap 1 produk tertentu (Customer klik gambar produk untuk baca deksripsi).
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

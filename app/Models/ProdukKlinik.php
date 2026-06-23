<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProdukKlinik extends Model
{
    // Mengaktifkan fitur primary key increment
    public $incrementing = true;
    
    // Fitur pencatatan waktu otomatis aktif
    public $timestamps = true;
    
    // Menghubungkan ke tabel 'produkklinik' di MySQL
    protected $table = 'produkklinik';

    // Menentukan kolom primary key
    protected $primaryKey = 'idProduk';

    // Mendefinisikan kolom-kolom yang dapat diisi melalui form (Fillable Security)
    protected $fillable = [
        'nama',       // Nama produk jualan (contoh: "Krim Malam Glowing")
        'deskripsi',  // Penjelasan detail komposisi atau cara pakai
        'harga',      // Harga jual per satuan produk
        'stock',      // Sisa stok produk di gudang klinik
        'berat',      // Berat fisik (dalam gram) yang dipakai untuk hitung ongkir kurir (RajaOngkir)
        'gambar',     // Alamat path/url foto cover produk
        'idKategori'  // Merujuk ke ID dari tabel kategoriproduk (Relasi)
    ];

    /**
     * Relasi Database: Kategori Produk
     * Setiap 1 produk pastilah milik dari 1 Kategori tertentu (contoh: Kategori "Skincare").
     */
    public function kategori() {
        return $this->belongsTo(KategoriProduk::class,'idKategori');
    }

    /**
     * Relasi Database: Promo Produk
     * Satu produk bisa saja diikutkan dalam BANYAK event Promo yang berbeda (contoh: Promo Natal, Promo Lebaran).
     */
    public function promo(){
        return $this->hasMany(Promo::class,'idProduk');
    }

    /**
     * Relasi Database: Detail Penjualan (Nota)
     * Produk yang laris manis akan sering muncul di banyak baris detail nota penjualan.
     */
    public function detailpenjualan()
    {
        return $this->hasMany(DetailPenjualan::class, 'idProduk');
    }

    /**
     * Relasi Database: Keranjang Belanja Customer
     * Produk ini mungkin sedang ditaruh di dalam banyak keranjang milik customer-customer yang berbeda (Belum Checkout).
     */
    public function keranjang()
    {
        return $this->hasMany(Keranjang::class, 'idProduk');
    }
}

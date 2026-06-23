<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KategoriProduk extends Model
{
    // Mengaktifkan fitur auto-increment pada primary key
    public $incrementing = true;
    
    // Mengaktifkan fitur kolom otomatis (created_at & updated_at)
    public $timestamps = true;

    // Spesifikasikan nama tabel yang digunakan di database
    protected $table = 'kategoriproduk';
    
    // Spesifikasikan nama kolom Primary Key-nya
    protected $primaryKey = 'idKategori';
    
    // Menentukan kolom mana saja yang diizinkan untuk diisi datanya dari form (Mass Assignment)
    protected $fillable = [
        'nama',       // Nama kategorinya (misal: "Sabun Wajah", "Obat Jerawat")
        'deskripsi'   // Penjelasan singkat kategori tersebut
    ];

    /**
     * Relasi Database: Produk Klinik
     * Satu kategori produk (misal: "Sabun Wajah") dapat dimiliki oleh banyak varian Produk (HasMany).
     */
    public function produkklinik() {
        return $this->hasMany(ProdukKlinik::class,'idKategori');
    }

    /**
     * Relasi Database: Promo
     * Satu kategori produk bisa saja dikenakan promo berkali-kali.
     */
    public function promo() {
        return $this->hasMany(Promo::class,'idKategori');
    }
}

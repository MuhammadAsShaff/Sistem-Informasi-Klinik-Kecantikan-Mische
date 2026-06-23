<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailPenjualan extends Model
{
    // Mengaktifkan fitur auto-increment pada primary key
    public $incrementing = true;
    
    // Mengaktifkan fitur otomatis pencatatan created_at dan updated_at
    public $timestamps = true;
    
    // Menentukan nama tabel di database secara eksplisit
    protected $table = 'detailpenjualan';

    // Menentukan primary key custom, karena defaultnya 'id'
    protected $primaryKey = 'idDetailPenjualan';

    // Kolom-kolom yang diizinkan untuk diisi secara massal
    protected $fillable = [
        'jumlahProduk', // Berapa banyak produk (qty) yang dibeli pada item ini
        'idPenjualan',  // Merujuk ke transaksi penjualan induk (Nota struk belanjanya)
        'idProduk',     // Merujuk ke produk klinik mana yang dibeli
    ];

    /**
     * Relasi Database: Transaksi Induk
     * Detail barang ini adalah bagian dari satu Transaksi Penjualan yang lebih besar (Keranjang / Checkout).
     */
    public function penjualan()
    {
        return $this->belongsTo(Penjualan::class, 'idPenjualan');
    }

    /**
     * Relasi Database: Produk
     * Menghubungkan record detail ini dengan data fisik Produk Klinik yang sedang dibeli.
     */
    public function produk()
    {
        return $this->belongsTo(ProdukKlinik::class, 'idProduk');
    }
}

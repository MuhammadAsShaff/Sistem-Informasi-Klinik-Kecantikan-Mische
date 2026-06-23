<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Keranjang extends Model
{
    // Tipe auto-increment aktif
    public $incrementing = true;
    
    // Timestamps aktif
    public $timestamps = true;

    // Merujuk pada tabel 'keranjang' di database
    protected $table = 'keranjang';

    // Merujuk pada primary key 'idKeranjang'
    protected $primaryKey = 'idKeranjang';
    
    // Kolom yang dapat diisi massal
    protected $fillable = [
        'jumlahProduk', // Kuantitas (qty) barang yang akan dicheckout
        'idProduk',     // Merujuk pada barang apa yang dimasukkan keranjang
        'idUser'        // Merujuk pada akun customer mana keranjang ini berada
    ];

    /**
     * Relasi Database: Pemilik Keranjang
     * Satu item keranjang hanya dimiliki oleh satu akun user (Customer).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'idUser');
    }

    /**
     * Relasi Database: Barang/Produk di Keranjang
     * Satu item keranjang mewakili satu produk fisik yang ada di tabel ProdukKlinik.
     */
    public function produk()
    {
        return $this->belongsTo(ProdukKlinik::class,'idProduk');
    }
}

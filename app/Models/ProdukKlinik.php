<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProdukKlinik extends Model
{
    public $incrementing = true;
    public $timestamps = true;
    protected $table = 'produkklinik';

    protected $primaryKey = 'idProduk';

    protected $fillable = [
        'nama',
        'deskripsi',
        'harga',
        'stock',
        'idKategori'
    ];

    public function kategori() {
        return $this->belongsTo(KategoriProduk::class,'idKategori');
    }

    public function promo(){
        return $this->hasMany(Promo::class,'idProduk');
    }

    public function detailpenjualan()
    {
        return $this->hasMany(DetailPenjualan::class, 'idProduk');
    }

    public function keranjang()
    {
        return $this->hasMany(Keranjang::class, 'idProduk');
    }
}

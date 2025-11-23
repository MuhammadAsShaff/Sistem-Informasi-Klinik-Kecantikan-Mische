<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KategoriProduk extends Model
{
    public $incrementing = true;
    public $timestamps = true;

    protected $table = 'kategoriproduk';
    protected $primaryKey = 'idKategori';
    protected $fillable = [
        'nama',
        'deskripsi'
    ];

    public function produkklinik() {
        return $this->hasMany(ProdukKlinik::class,'idKategori');
    }

    public function promo() {
        return $this->hasMany(Promo::class,'idKategori');
    }
}

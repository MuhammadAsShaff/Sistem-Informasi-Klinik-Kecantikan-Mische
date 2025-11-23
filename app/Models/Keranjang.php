<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Keranjang extends Model
{
    public $incrementing = true;
    public $timestamps = true;

    protected $table = 'keranjang';

    protected $primaryKey = 'idKeranjang';
    protected $fillable = [
        'jumlahProduk',
        'idProduk',
        'idUser'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'idUser');
    }

    public function produk()
    {
        return $this->belongsTo(ProdukKlinik::class,'idProduk');
    }
}

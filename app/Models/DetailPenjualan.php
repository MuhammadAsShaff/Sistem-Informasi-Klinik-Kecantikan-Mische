<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailPenjualan extends Model
{
    public $incrementing = true;
    public $timestamps = true;
    protected $table = 'detailpenjualan';

    protected $primaryKey = 'idDetailPenjualan';

    protected $fillable = [
        'jumlahProduk',
        'idPenjualan',
        'idProduk',
    ];

    public function penjualan()
    {
        return $this->belongsTo(Penjualan::class, 'idPenjualan');
    }

    public function produk()
    {
        return $this->belongsTo(ProdukKlinik::class, 'idProduk');
    }
}

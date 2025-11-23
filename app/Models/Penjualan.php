<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penjualan extends Model
{
    public $incrementing = true;
    public $timestamps = true;
    protected $table = 'penjualan';

    protected $primaryKey = 'idPenjualan';

    protected $fillable = [
        'tanggal',
        'totalHarga',
        'status',
        'idUser',
        'idPromo'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'idUser');
    }

    public function promo()
    {
        return $this->belongsTo(Promo::class, 'idPromo');
    }
    public function detailpenjualan(){
        return $this->hasMany(DetailPenjualan::class,'idPenjualan');
    }
}

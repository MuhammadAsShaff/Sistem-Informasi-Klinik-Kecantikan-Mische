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
        'idAlamat',
        'invoiceNumber',
        'subtotal',
        'shippingCost',
        'shippingCourier',
        'shippingService',
        'nomorResi',
        'total',
        'paymentStatus',
        'orderStatus',
        'snapToken',
        'midtransOrderId',
        'paidAt',
        'idUser',
        'idPromo'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'idUser');
    }

    public function alamat()
    {
        return $this->belongsTo(AlamatCustomer::class, 'idAlamat', 'id');
    }

    public function promo()
    {
        return $this->belongsTo(Promo::class, 'idPromo');
    }
    public function detailpenjualan(){
        return $this->hasMany(DetailPenjualan::class,'idPenjualan');
    }
}

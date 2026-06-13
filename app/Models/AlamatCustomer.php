<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlamatCustomer extends Model
{
    use HasFactory;

    protected $table = 'alamat_customer';
    

    protected $fillable = [
        'idUser',
        'namaPenerima',
        'nomorHp',
        'detailAlamat',
        'provinceId',
        'cityId',
        'districtId',
        'kodePos',
    ];

    /**
     * Get the user that owns the alamat.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'idUser', 'idUser');
    }
}

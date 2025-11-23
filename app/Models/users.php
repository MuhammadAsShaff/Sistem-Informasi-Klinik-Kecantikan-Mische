<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class users extends Model
{
    public $incementing = true;

    public $timestamps = true;

    protected $table = 'user';

    protected $primaryKey = 'idUser';

    protected $fillable = [
        'nama',
        'alamat',
        'jenisKelamin',
        'tanggalLahir',
        'role',
        'email',
        'nomorWa',
        'password'
    ];

    public function penjualan()
    {
        return $this->hasMany(Penjualan::class, 'idUser');
    }

    public function keranjang()
    {
        return $this->hasMany(Keranjang::class, 'idUser');
    }
    public function reservasi()
    {
        return $this->hasMany(Reservasi::class, 'idUser');
    }
}

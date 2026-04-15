<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfilPerusahaan extends Model
{
    public $incrementing = true;
    public $timestamps = true;
    protected $table = 'profilperusahaan';

    protected $primaryKey = 'idProfil';

    protected $fillable = [
        'visi',
        'misi',
        'fotoPerusahaan',
        'deskripsiPerusahaan',
        'nomorCustomerService',
        'jamBukak',
        'jamKeluar'
    ];
}

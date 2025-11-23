<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfilPerusahaan extends Model
{
    public $incrementing = true;
    public $timestamps = true;
    protected $table = 'profildokter';

    protected $primaryKey = 'idDokter';

    protected $fillable = [
        'visi',
        'misi',
        'deskripsiPerusahaan',
        'nomorCustomerService',
        'jamBukak',
        'jamKeluar'
    ];
}

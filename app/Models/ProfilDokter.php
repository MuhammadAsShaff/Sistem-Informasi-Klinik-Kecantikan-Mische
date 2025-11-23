<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfilDokter extends Model
{
    public $incrementing = true;
    public $timestamps = true;
    protected $table = 'profildokter';

    protected $primaryKey = 'idDokter';

    protected $fillable = [
        'nama',
        'foto',
        'email',
        'deskripsi'
    ];

    public function reservasi(){
        return $this->hasMany(Reservasi::class,'idDokter');
    }
}

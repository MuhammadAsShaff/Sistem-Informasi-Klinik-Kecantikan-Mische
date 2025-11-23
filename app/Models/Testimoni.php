<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimoni extends Model
{
    public $incementing = true;

    public $timestamps = true;

    protected $table = 'testimoni';

    protected $primaryKey = 'idTestimoni';

    protected $fillable = [
        'namaTester',
        'jenisTestimoni',
        'deskripsi',
        'tanggalTreatment',
        'buktiFoto'
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JadwalReservasi extends Model
{
    public $incrementing = true;
    public $timestamps = true;
    protected $table = 'jadwalreservasi';
    protected $primaryKey = 'idJadwal';
    protected $fillable = [
        'jamMulai',
        'jamSelesai',
    ];

    public function reservasi()
    {
        return $this->HasMany(Reservasi::class, 'idJadwal');
    }
}

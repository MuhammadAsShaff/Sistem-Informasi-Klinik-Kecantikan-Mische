<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservasi extends Model
{
    public $incementing = true;

    public $timestamps = true;

    protected $table = 'reservasi';

    protected $primaryKey = 'idReservasi';

    protected $fillable = [
        'namaCustomer',
        'nomorWa',
        'jenisTreatment',
        'tanggalReservasi',
        'status',
        'idUser',
        'idDokter',
        'idJadwal'
    ];

    public function user(){
        return $this->belongsTo(User::class,'idUser');
    } 

    public function dokrter(){
        return $this->belongsTo(ProfilDokter::class,'idDokter');
    }

    public function jadwal()
    {
        return $this->belongsTo(JadwalReservasi::class, 'idJadwal');
    }
    
}

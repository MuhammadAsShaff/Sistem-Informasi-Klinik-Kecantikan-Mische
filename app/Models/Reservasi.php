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
        'kategoriReservasi',
        'jenisReservasi',
        'tanggalReservasi',
        'status',
        'idUser',
        'idDokter',
        'idJadwal',
        'is_rescheduled'
    ];

    public function user(){
        return $this->belongsTo(User::class,'idUser');
    } 

    public function dokter(){
        return $this->belongsTo(ProfilDokter::class,'idDokter');
    }

    public function jadwal()
    {
        return $this->belongsTo(JadwalReservasi::class, 'idJadwal');
    }
    
}

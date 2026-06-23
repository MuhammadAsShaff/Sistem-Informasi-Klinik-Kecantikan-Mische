<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JadwalReservasi extends Model
{
    // Menandakan primary key bertipe integer yang otomatis bertambah nilainya
    public $incrementing = true;
    
    // Aktifkan timestamp (created_at & updated_at) otomatis
    public $timestamps = true;
    
    // Nama tabel database yang dihubungkan dengan model ini
    protected $table = 'jadwalreservasi';
    
    // Definisi primary key tabel
    protected $primaryKey = 'idJadwal';
    
    // Menentukan kolom yang dapat diisi melalui kode (Fillable security)
    protected $fillable = [
        'jamMulai',   // Waktu dimulainya satu slot praktek dokter (misal 10:00:00)
        'jamSelesai', // Waktu selesainya slot tersebut (misal 11:00:00)
    ];

    /**
     * Relasi Database: Daftar Reservasi
     * Satu slot jadwal waktu (misal jam 10-11) bisa dipesan oleh banyak pasien/reservasi
     * pada hari (tanggal) dan dokter yang berbeda.
     */
    public function reservasi()
    {
        return $this->HasMany(Reservasi::class, 'idJadwal');
    }
}

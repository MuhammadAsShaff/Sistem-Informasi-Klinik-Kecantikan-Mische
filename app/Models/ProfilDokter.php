<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfilDokter extends Model
{
    // Increment auto aktif
    public $incrementing = true;
    
    // Aktifkan timestamp kolom otomatis (created_at)
    public $timestamps = true;
    
    // Mapping dengan nama tabel yang sesuai di DB
    protected $table = 'profildokter';

    // Primary key custom
    protected $primaryKey = 'idDokter';

    // Kolom data dokter yang bisa diinput massal dari request form
    protected $fillable = [
        'nama',       // Nama lengkap dan gelar dokter
        'foto',       // Foto profil wajah dokter (dalam format webp)
        'email',      // Alamat email dokter untuk keperluan surat menyurat (jika ada)
        'deskripsi',  // Biodata lengkap, pengalaman, spesialisasi, dll.
        'status'      // Status ketersediaan dokter (Tersedia / Tidak Tersedia / Sedang Cuti)
    ];

    /**
     * Relasi Database: Reservasi Pasien
     * Satu orang Dokter bisa menangani banyak jadwal Reservasi Pasien.
     */
    public function reservasi(){
        return $this->hasMany(Reservasi::class,'idDokter');
    }
}

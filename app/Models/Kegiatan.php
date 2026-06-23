<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kegiatan extends Model
{
    // Menandakan primary key auto increment
    public $incrementing = true;
    
    // Aktifkan pengelolaan otomatis waktu pembuatan/perubahan
    public $timestamps = true;
    
    // Nama tabel di database
    protected $table = 'kegiatan';
    
    // Nama primary key custom
    protected $primaryKey = 'idKegiatan';
    
    // Kolom-kolom yang aman dan boleh diisi massal
    protected $fillable = [
        'namaKegiatan',     // Judul kegiatan (Contoh: "Bakti Sosial Cabang A")
        'deskripsi',        // Penjelasan lengkap mengenai kegiatan
        'foto',             // Path file foto/dokumentasi kegiatan
        'tanggalKegiatan'   // Kapan kegiatan ini dilaksanakan
    ];

}

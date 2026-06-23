<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    // Mengaktifkan fitur auto-increment pada primary key
    public $incrementing = true;
    
    // Mengaktifkan pengelolaan kolom created_at dan updated_at secara otomatis
    public $timestamps = true;
    
    // Menentukan nama tabel yang digunakan oleh model ini
    protected $table = 'event';
    
    // Menentukan kolom primary key
    protected $primaryKey = 'idEvent';
    
    // Menentukan kolom mana saja yang boleh diisi datanya (Mass Assignment)
    protected $fillable = [
        'nama',           // Judul / Nama dari event tersebut
        'deskripsi',      // Penjelasan rincian tentang event
        'foto',           // Path direktori foto/poster event di server
        'tanggalMulai',   // Tanggal saat event ini mulai berlaku/diselenggarakan
        'tanggalSelesai', // Tanggal berakhirnya event tersebut
        'lokasi'          // Tempat diadakannya event (misal: "Klinik Cabang A")
    ];
}

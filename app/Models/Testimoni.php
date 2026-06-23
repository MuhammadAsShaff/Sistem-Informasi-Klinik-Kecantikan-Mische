<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimoni extends Model
{
    // Mengaktifkan fitur increment otomatis untuk primary key
    public $incementing = true;

    // Mengaktifkan fitur timestamps (created_at & updated_at) otomatis
    public $timestamps = true;

    // Nama tabel database yang dihubungkan dengan model ini
    protected $table = 'testimoni';

    // Mendefinisikan kolom primary key khusus
    protected $primaryKey = 'idTestimoni';

    // Kolom-kolom yang aman dan diizinkan untuk diisi secara massal
    protected $fillable = [
        'namaTester',       // Nama orang yang memberikan ulasan/testimoni
        'jenisTestimoni',   // Judul/Tema layanan yang di-review (Misal: "Perawatan Jerawat Batu")
        'deskripsi',        // Isi teks ulasan panjang dari pelanggan
        'tanggalTreatment', // Kapan pelanggan tersebut melakukan treatment/pembelian
        'buktiFoto'         // Bukti otentik berupa foto before/after atau wajah hasil treatment
    ];
}

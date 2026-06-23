<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfilPerusahaan extends Model
{
    // Fitur Primary Key increment otomatis berjalan
    public $incrementing = true;
    
    // Fitur pencatatan waktu update otomatis berjalan
    public $timestamps = true;
    
    // Mengacu pada tabel identitas utama klinik (Tabel ini biasanya hanya berisi 1 baris saja)
    protected $table = 'profilperusahaan';

    // Primary Key tabel 
    protected $primaryKey = 'idProfil';

    // Data-data krusial public relation milik perusahaan (klinik)
    protected $fillable = [
        'visi',                 // Visi klinik jangka panjang
        'misi',                 // Langkah misi untuk mencapai visi
        'fotoPerusahaan',       // Logo resmi klinik atau foto gedung tampak depan
        'deskripsiPerusahaan',  // Sejarah singkat / Profil "Tentang Kami"
        'nomorCustomerService', // Nomor Hotline / WA Admin pusat untuk bantuan keluhan (Di header website)
        'jamBuka',              // Jam operasional buka klinik secara umum (Contoh: 09:00)
        'jamTutup'              // Jam operasional tutup klinik (Contoh: 17:00)
    ];
}

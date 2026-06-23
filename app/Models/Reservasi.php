<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservasi extends Model
{
    public $incementing = true;

    public $timestamps = true;

    // Menentukan nama tabel di database MySQL
    protected $table = 'reservasi'; 

    // Menentukan Primary Key tabel (karena bukan standar 'id')
    protected $primaryKey = 'idReservasi';

    // Kolom-kolom yang boleh diisi lewat form (Keamanan Mass Assignment Laravel)
    protected $fillable = [
        'namaCustomer',
        'nomorWa',
        'kategoriReservasi', // Contoh: Treatment Wajah, Laser, dsb
        'jenisReservasi',    // Detail layanannya apa
        'tanggalReservasi',  // Kapan dia mau datang?
        'status',            // Menunggu, Dikonfirmasi, Selesai, Dibatalkan
        'idUser',            // ID Customer (Jika dia mendaftar pakai aplikasi). Bisa null jika walk-in.
        'idDokter',          // Mau ditangani oleh dokter siapa?
        'idJadwal',          // Jam ke berapa?
        'is_rescheduled'     // Flag keamanan: Apakah customer ini sudah pernah ubah jadwal sebelumnya? (True/False)
    ];

    /**
     * Relasi Database: Pemilik Reservasi
     * Satu reservasi dimiliki oleh satu User (Customer).
     */
    public function user(){
        return $this->belongsTo(User::class,'idUser');
    } 

    /**
     * Relasi Database: Dokter Penanggung Jawab
     * Satu reservasi akan ditangani oleh satu Dokter.
     */
    public function dokter(){
        return $this->belongsTo(ProfilDokter::class,'idDokter');
    }

    /**
     * Relasi Database: Slot Waktu (Jam)
     * Mengambil jam/waktu yang sudah dipilih dari tabel Jadwal.
     */
    public function jadwal()
    {
        return $this->belongsTo(JadwalReservasi::class, 'idJadwal');
    }
    
}

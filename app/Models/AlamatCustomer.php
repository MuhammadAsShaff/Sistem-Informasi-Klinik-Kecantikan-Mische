<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlamatCustomer extends Model
{
    use HasFactory;

    // Menentukan nama tabel secara spesifik di database
    protected $table = 'alamat_customer';
    
    // Kolom-kolom yang diizinkan untuk diisi secara massal (Mass Assignment)
    protected $fillable = [
        'idUser',        // ID akun Customer yang memiliki alamat ini
        'namaPenerima',  // Nama orang yang akan menerima paket (bisa beda dengan nama akun)
        'nomorHp',       // Nomor HP penerima paket
        'detailAlamat',  // Nama jalan, RT/RW, nomor rumah, patokan
        'provinceId',    // ID Provinsi (berdasarkan data dari API RajaOngkir)
        'cityId',        // ID Kota/Kabupaten (berdasarkan API RajaOngkir)
        'districtId',    // ID Kecamatan (jika diperlukan)
        'kodePos',       // Kode Pos wilayah alamat
    ];

    /**
     * Relasi Database: Pemilik Alamat
     * Satu alamat selalu dimiliki oleh satu orang User (Customer).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'idUser', 'idUser');
    }
}

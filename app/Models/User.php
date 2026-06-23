<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject; // Wajib dipasang agar class User bisa generate JWT Token

// Authenticatable berarti tabel ini bisa dipakai untuk fitur Login bawaan Laravel
// JWTSubject adalah Interface wajib dari library jwt-auth
class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    public $incementing = true;

    public $timestamps = true;

    // Nama tabelnya adalah 'user' (bukan 'users' seperti bawaan laravel)
    protected $table = 'user';

    protected $primaryKey = 'idUser';

    // Kolom-kolom profil yang diizinkan untuk diisi atau diupdate
    protected $fillable = [
        'nama',
        'jenisKelamin',
        'tanggalLahir',
        'role',          // 'admin' atau 'customer'
        'email',
        'nomorWa',
        'password',      // Ingat: Selalu di-hash (enkripsi) sebelum disimpan ke kolom ini!
        'idAlamatUtama'  // Alamat default (yang tercentang hijau) saat Checkout
    ];

    /**
     * Relasi: Buku Alamat
     * Satu User bisa memiliki BANYAK alamat pengiriman (Rumah, Kantor, dll). (hasMany)
     */
    public function alamats()
    {
        return $this->hasMany(AlamatCustomer::class, 'idUser', 'idUser');
    }

    /**
     * Relasi: Alamat Default
     * Mengambil 1 alamat spesifik yang dijadikan alamat utama.
     */
    public function alamatUtama()
    {
        return $this->belongsTo(AlamatCustomer::class, 'idAlamatUtama', 'id');
    }

    /**
     * Relasi: Riwayat Belanja
     * Satu User memiliki riwayat banyak faktur Penjualan E-Commerce.
     */
    public function penjualan()
    {
        return $this->hasMany(Penjualan::class, 'idUser');
    }

    /**
     * Relasi: Keranjang Belanja Aktif
     * Satu User memiliki banyak isi barang di keranjangnya saat ini.
     */
    public function keranjang()
    {
        return $this->hasMany(Keranjang::class, 'idUser');
    }

    /**
     * Relasi: Riwayat Janji Temu
     * Satu User bisa melakukan banyak Reservasi klinik berkali-kali.
     */
    public function reservasi()
    {
        return $this->hasMany(Reservasi::class, 'idUser');
    }

    // ==========================================================
    // BAGIAN DI BAWAH INI ADALAH SYARAT WAJIB DARI JWT LIBRARY
    // ==========================================================

    /**
     * getJWTIdentifier
     * Memberitahu JWT, apa kunci unik yang digunakan untuk mengenali user ini? (Jawabannya: idUser)
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * getJWTCustomClaims
     * Fitur ekstra: Jika kita ingin menyematkan data tambahan ke dalam payload Token JWT 
     * (Misal menyematkan 'role' ke dalam string token, agar Frontend tahu ini admin/customer tanpa harus nembak API lagi)
     * Saat ini dibiarkan kosong (array kosong).
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}

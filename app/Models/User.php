<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    public $incementing = true;

    public $timestamps = true;

    protected $table = 'user';

    protected $primaryKey = 'idUser';

    protected $fillable = [
        'nama',
        'jenisKelamin',
        'tanggalLahir',
        'role',
        'email',
        'nomorWa',
        'password'
    ];

    public function alamats()
    {
        return $this->hasMany(AlamatCustomer::class, 'idUser', 'idUser');
    }

    public function penjualan()
    {
        return $this->hasMany(Penjualan::class, 'idUser');
    }

    public function keranjang()
    {
        return $this->hasMany(Keranjang::class, 'idUser');
    }
    public function reservasi()
    {
        return $this->hasMany(Reservasi::class, 'idUser');
    }
        /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penjualan extends Model
{
    public $incrementing = true;
    public $timestamps = true;
    
    // Memberitahu Laravel bahwa model ini menggunakan tabel bernama 'penjualan' di MySQL
    protected $table = 'penjualan';

    // Memberitahu Laravel bahwa Primary Key-nya bernama 'idPenjualan', bukan default 'id'
    protected $primaryKey = 'idPenjualan';

    // Fillable adalah Daftar kolom yang diizinkan untuk diisi secara massal (Mass Assignment).
    // Ini adalah fitur keamanan Laravel agar hacker tidak bisa sembarangan mengisi kolom tersembunyi (seperti role/saldo).
    protected $fillable = [
        'tanggal',
        'idAlamat',
        'invoiceNumber',
        'subtotal',
        'shippingCost',
        'shippingCourier',
        'shippingService',
        'nomorResi',
        'total',
        'paymentStatus',
        'orderStatus',
        'snapToken',        // Token keamanan dari Midtrans
        'midtransOrderId',
        'paidAt',           // Tanggal lunas
        'idUser',           // Milik siapa transaksi ini?
        'idPromo',
        'paymentMethod'     // Contoh: gopay, bca_va, credit_card
    ];

    /**
     * Relasi ke Model User (Customer)
     * Satu transaksi Penjualan hanya dimiliki oleh Satu User (Customer). (BelongsTo / Dimiliki oleh)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'idUser');
    }

    /**
     * Relasi ke Model AlamatCustomer
     * Mengambil detail alamat pengiriman untuk transaksi ini.
     */
    public function alamat()
    {
        return $this->belongsTo(AlamatCustomer::class, 'idAlamat', 'id');
    }

    /**
     * Relasi ke Model Promo
     * Untuk mengetahui voucher/diskon apa yang dipakai di transaksi ini.
     */
    public function promo()
    {
        return $this->belongsTo(Promo::class, 'idPromo');
    }
    
    /**
     * Relasi ke Model DetailPenjualan
     * Satu Penjualan/Invoice bisa berisi BANYAK Produk (HasMany / Memiliki Banyak).
     */
    public function detailpenjualan(){
        return $this->hasMany(DetailPenjualan::class,'idPenjualan');
    }
}

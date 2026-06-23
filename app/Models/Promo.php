<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    // Auto increment primary key hidup
    public $incrementing = true;
    
    // Pencatatan waktu baris otomatis aktif
    public $timestamps = true;

    // Spesifikasikan nama tabel yang bersinggungan di database
    protected $table = 'promo';
    
    // Spesifikasikan nama kolom yang menjadi primary key utamanya
    protected $primaryKey = 'idPromo';
    
    // Daftar kolom atribut promo yang aman untuk di Mass Assignment
    protected $fillable = [
        'gambar',           // Banner/Flyer gambar visual dari event promo ini
        'namaPromo',        // Judul utama promo (misal "Promo Harbolnas")
        'jenisPromo',       // Bisa berupa 2 pilihan nilai: 'produk' ATAU 'kategori'
        'kode',             // Kode Kupon / Voucher yang harus diketikkan customer (misal "DISC50")
        'diskon',           // Nominal potongan yang diberikan (bisa berupa angka persen (%) atau nominal rupiah)
        'deskripsi',        // Syarat dan ketentuan berlaku promo
        'tanggalMulai',     // Masa berlaku kapan promo ini bisa mulai ditebus (diredeem)
        'tanggalSelesai',   // Tenggat waktu (expired) dari masa promo tersebut
        'minimalTransaksi', // Syarat batas keranjang belanja (misal: harus belanja 100rb baru dapet diskon)
        'status',           // Tombol switch cepat dari admin (Aktif / Tidak Aktif)
        
        // Foreign Key Opsional: (Pilih salah satu, jika jenisPromonya Produk maka idKategori kosong, begitupun sebaliknya)
        'idKategori',       // ID Kategori jika promo ini memberlakukan diskon pukul rata pada seluruh kategori produk tertentu
        'idProduk'          // ID Produk khusus jika promo ini HANYA eksklusif men-diskon satu jenis barang saja
    ];

    /**
     * Relasi Database: Kategori (Opsional)
     * Menghubungkan tabel promo dengan Kategori yang sedang didiskon.
     */
    public function kategori(){
        return $this->belongsTo(KategoriProduk::class,'idKategori');
    }

    /**
     * Relasi Database: Produk (Opsional)
     * Menghubungkan promo flash sale ini dengan spesifik 1 produk tertentu.
     */
    public function produk()
    {
        return $this->belongsTo(ProdukKlinik::class, 'idProduk');
    }

    /**
     * Relasi Database: Histori Penjualan
     * Data rekapan siapa saja customer yang sudah berhasil memakai/mengeklaim kode promo ini
     * pada saat checkout. Satu promo bisa dipakai di banyak transaksi penjualan.
     */
    public function penjualan(){
        return $this->hasMany(Penjualan::class,'idPromo');
    }
}

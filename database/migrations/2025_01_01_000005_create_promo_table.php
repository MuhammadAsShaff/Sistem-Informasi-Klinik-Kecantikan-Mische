<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('promo', function (Blueprint $table) {
            // Kolom primary key 'idPromo' (Auto-Increment)
            $table->increments('idPromo');
            
            // Path file/banner gambar promo
            $table->string('gambar');
            
            // Judul/Nama campaign Promo
            $table->string('namaPromo', 60);
            
            // Jenis promo (Bisa difilter untuk 'kategori' atau khusus 'produk' tertentu)
            $table->string('jenisPromo', 60);
            
            // Kode kupon/voucher yang diketik saat checkout (misal: "MANTAP10")
            $table->string('kode', 12);
            
            // Nominal potongan diskon
            $table->unsignedInteger('diskon');
            
            // Syarat dan ketentuan
            $table->text('deskripsi');
            
            // Rentang waktu berlakunya event promo ini
            $table->date('tanggalMulai');
            $table->date('tanggalSelesai');
            
            // Syarat minimal belanja agar kupon ini valid
            $table->unsignedInteger('minimalTransaksi');
            
            // Status aktif/tidaknya kupon (1/0)
            $table->boolean('status');
            
            // Foreign Key 'idKategori' (Boleh kosong/nullable jika promo bukan tipe kategori)
            $table->unsignedInteger('idKategori')->nullable();
            $table->foreign('idKategori')->references('idKategori')->on('kategoriProduk')->onDelete('cascade');
            
            // Foreign Key 'idProduk' (Boleh kosong/nullable jika promo bukan eksklusif untuk 1 produk)
            $table->unsignedInteger('idProduk')->nullable();
            $table->foreign('idProduk')->references('idProduk')->on('produkKlinik')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('promo');
    }
};
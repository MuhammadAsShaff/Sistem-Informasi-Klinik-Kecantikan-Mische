<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('keranjang', function (Blueprint $table) {
            // Kolom primary key (Auto-Increment)
            $table->increments('idKeranjang');
            
            // Kolom untuk menampung jumlah kuantitas produk yang ditambahkan ke keranjang
            $table->unsignedInteger('jumlahProduk');
            
            // Kolom foreign key merujuk pada produk apa yang ditambahkan
            $table->unsignedInteger('idProduk');
            $table->foreign('idProduk')->references('idProduk')->on('produkKlinik')->onDelete('cascade');
            
            // Kolom foreign key merujuk pada siapa pemilik keranjang ini
            $table->unsignedInteger('idUser');
            $table->foreign('idUser')->references('idUser')->on('user')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('keranjang');
    }
};
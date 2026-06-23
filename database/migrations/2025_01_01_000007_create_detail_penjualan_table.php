<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('detailPenjualan', function (Blueprint $table) {
            // Primary Key (Auto-Increment)
            $table->increments('idDetailPenjualan');
            
            // Berapa jumlah qty item/produk ini yang dibeli
            $table->unsignedInteger('jumlahProduk');
            
            // Relasi ke nota transaksi induknya di tabel penjualan
            $table->unsignedInteger('idPenjualan');
            $table->foreign('idPenjualan')->references('idPenjualan')->on('penjualan')->onDelete('cascade');
            
            // Relasi fisik produk yang dibeli
            $table->unsignedInteger('idProduk');
            $table->foreign('idProduk')->references('idProduk')->on('produkKlinik')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('detailPenjualan');
    }
};
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('promo', function (Blueprint $table) {
            $table->increments('idPromo');
            $table->string('gambar');
            $table->string('namaPromo', 60);
            $table->string('jenisPromo', 60);
            $table->string('kode', 12);
            $table->unsignedInteger('diskon');
            $table->text('deskripsi');
            $table->date('tanggalMulai');
            $table->date('tanggalSelesai');
            $table->unsignedInteger('minimalTransaksi');
            $table->boolean('status');
            $table->unsignedInteger('idKategori')->nullable();
            $table->foreign('idKategori')->references('idKategori')->on('kategoriProduk')->onDelete('cascade');
            $table->unsignedInteger('idProduk')->nullable();
            $table->foreign('idProduk')->references('idProduk')->on('produkKlinik')->onDelete('cascade');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('promo');
    }
};
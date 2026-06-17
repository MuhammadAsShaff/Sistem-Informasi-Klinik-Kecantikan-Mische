<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('produkKlinik', function (Blueprint $table) {
            $table->increments('idProduk');
            $table->string('gambar');
            $table->string('nama', 60);
            $table->text('deskripsi');
            $table->unsignedInteger('harga');
            $table->unsignedInteger('stock');
            $table->integer('berat')->default(500)->comment('Berat produk dalam gram');
            $table->unsignedInteger('idKategori');
            $table->foreign('idKategori')->references('idKategori')->on('kategoriProduk')->onDelete('cascade');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('produkKlinik');
    }
};
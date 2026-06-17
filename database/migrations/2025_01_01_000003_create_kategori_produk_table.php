<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('kategoriProduk', function (Blueprint $table) {
            $table->increments('idKategori');
            $table->string('nama', 60);
            $table->text('deskripsi'); 
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('kategoriProduk');
    }
};
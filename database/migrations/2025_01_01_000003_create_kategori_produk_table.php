<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('kategoriProduk', function (Blueprint $table) {
            // Primary key 'idKategori' bertipe Integer Auto-Increment
            $table->increments('idKategori');
            
            // Kolom 'nama' kategori dengan panjang maksimal 60 karakter
            $table->string('nama', 60);
            
            // Kolom 'deskripsi' kategori menggunakan tipe data TEXT agar bisa menampung banyak kalimat
            $table->text('deskripsi'); 
            
            // Kolom created_at dan updated_at
            $table->timestamps();
        });
    }

    public function down(): void {
        // Hapus tabel jika di-rollback
        Schema::dropIfExists('kategoriProduk');
    }
};
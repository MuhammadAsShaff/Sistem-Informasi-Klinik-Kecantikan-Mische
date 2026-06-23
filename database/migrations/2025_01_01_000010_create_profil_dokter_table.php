<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('profilDokter', function (Blueprint $table) {
            // Kolom primary key idDokter
            $table->increments('idDokter');
            
            // Nama dokter, maksimal 60 karakter
            $table->string('nama', 60);
            
            // Path file foto wajah dokter
            $table->string('foto');
            
            // Email aktif dokter
            $table->string('email');
            
            // Biodata lengkap dokter
            $table->text('deskripsi');
            
            // Status ketersediaan, default-nya adalah 'Tersedia'
            $table->string('status')->default('Tersedia');
            
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('profilDokter');
    }
};
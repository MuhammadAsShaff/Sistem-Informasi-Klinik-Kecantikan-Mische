<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('event', function (Blueprint $table) {
            // Kolom primary key (Auto-Increment)
            $table->increments('idEvent');
            
            // Judul acara klinik (misal: "Seminar Kecantikan 2026")
            $table->string('nama', 60);
            
            // Detail / rundown acara
            $table->text('deskripsi');
            
            // Poster atau banner event
            $table->string('foto');
            
            // Rentang waktu penyelenggaraan event
            $table->date('tanggalMulai');
            $table->date('tanggalSelesai');
            
            // Lokasi fisik diadakannya acara (Maksimal 100 karakter)
            $table->string('lokasi', 100);
            
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('event');
    }
};
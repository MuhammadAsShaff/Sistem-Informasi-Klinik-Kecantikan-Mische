<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('kegiatan', function (Blueprint $table) {
            // Primary key idKegiatan
            $table->increments('idKegiatan');
            
            // Nama aktivitas (Contoh: "Bakti Sosial Cabang Jakarta")
            $table->string('namaKegiatan', 60);
            
            // Rincian cerita / blog mengenai kegiatan
            $table->text('deskripsi');
            
            // Foto dokumentasi kegiatan
            $table->string('foto');
            
            // Tanggal pasti aktivitas tersebut dijalankan
            $table->date('tanggalKegiatan');
            
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('kegiatan');
    }
};
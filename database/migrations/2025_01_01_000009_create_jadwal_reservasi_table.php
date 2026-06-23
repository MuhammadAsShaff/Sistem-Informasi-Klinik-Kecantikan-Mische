<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('jadwalReservasi', function (Blueprint $table) {
            // Primary key idJadwal
            $table->increments('idJadwal');
            
            // Tipe data time digunakan khusus untuk menyimpan jam (HH:MM:SS)
            $table->time('jamMulai'); // Contoh: 10:00:00
            $table->time('jamSelesai'); // Contoh: 11:00:00
            
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('jadwalReservasi');
    }
};